// **P2P Messages**
// Communication between consensus nodes

use crate::block::{Block, Transaction};
use serde::{Deserialize, Serialize};

/// P2P message envelope
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Message {
    /// Sender node ID
    pub sender: String,
    /// Message timestamp
    pub timestamp: u64,
    /// Message payload
    pub payload: ConsensusMessage,
}

impl Message {
    pub fn new(sender: String, timestamp: u64, payload: ConsensusMessage) -> Self {
        Self {
            sender,
            timestamp,
            payload,
        }
    }
}

/// Consensus-related messages
#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum ConsensusMessage {
    /// Proposer announces a new block
    Propose {
        round: u64,
        block: Block,
    },

    /// Validator broadcasts prevote
    Prevote {
        round: u64,
        block_hash: Option<[u8; 32]>,
    },

    /// Validator broadcasts precommit
    Precommit {
        round: u64,
        block_hash: Option<[u8; 32]>,
    },

    /// Request a block by height
    RequestBlock {
        block_num: u64,
    },

    /// Response to block request
    Block {
        block: Block,
    },

    /// Request state sync
    RequestState {
        from_block: u64,
    },

    /// Response to state sync (transactions to apply)
    StateUpdate {
        block_num: u64,
        transactions: Vec<Transaction>,
    },

    /// Heartbeat (keep-alive)
    Heartbeat {
        block_height: u64,
        round: u64,
    },

    /// Error message
    Error {
        code: u32,
        message: String,
    },
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_message_creation() {
        let msg = Message::new(
            "node_1".to_string(),
            1000,
            ConsensusMessage::Heartbeat {
                block_height: 5,
                round: 10,
            },
        );

        assert_eq!(msg.sender, "node_1");
        assert_eq!(msg.timestamp, 1000);
    }

    #[test]
    fn test_message_serialization() {
        let msg = Message::new(
            "node_1".to_string(),
            1000,
            ConsensusMessage::Heartbeat {
                block_height: 5,
                round: 10,
            },
        );

        let serialized = serde_json::to_string(&msg).unwrap();
        let deserialized: Message = serde_json::from_str(&serialized).unwrap();

        assert_eq!(deserialized.sender, msg.sender);
        assert_eq!(deserialized.timestamp, msg.timestamp);
    }
}
