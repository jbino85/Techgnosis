// **Block structure and transactions**
// Core data structures for Ọ̀ṢỌ́ chain

use crate::error::{ConsensusError, Result};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// A transaction on the Ọ̀ṢỌ́ chain
#[derive(Clone, Debug, Serialize, Deserialize, Eq, PartialEq)]
pub enum Transaction {
    /// Deploy a TechGnØŞ smart contract
    TechGnosDeploy {
        /// Contract bytecode (compiled TechGnØŞ IR)
        bytecode: Vec<u8>,
        /// Sender address
        sender: String,
        /// Gas budget
        gas: u64,
        /// Nonce (replay protection)
        nonce: u64,
    },

    /// Call a TechGnØŞ smart contract function
    TechGnosCall {
        /// Contract address
        contract: String,
        /// Function name
        function: String,
        /// Function arguments (serialized)
        args: Vec<Vec<u8>>,
        /// Sender address
        sender: String,
        /// Gas budget
        gas: u64,
        /// Nonce (replay protection)
        nonce: u64,
    },

    /// Transfer Àṣẹ tokens
    Transfer {
        /// From address
        from: String,
        /// To address
        to: String,
        /// Amount in smallest unit
        amount: u64,
        /// Nonce (replay protection)
        nonce: u64,
    },

    /// Governance proposal (Quadrinity DAO)
    Governance {
        /// Proposal ID
        proposal_id: String,
        /// Proposal action (JSON encoded)
        action: Vec<u8>,
        /// Proposer address
        proposer: String,
        /// Nonce (replay protection)
        nonce: u64,
    },

    /// Inheritance wallet claim
    InheritanceClaim {
        /// Wallet ID (0..1440)
        wallet_id: u16,
        /// Claimant address
        claimant: String,
        /// Nonce (replay protection)
        nonce: u64,
    },
}

impl Transaction {
    pub fn sender(&self) -> &str {
        match self {
            Self::TechGnosDeploy { sender, .. } => sender,
            Self::TechGnosCall { sender, .. } => sender,
            Self::Transfer { from, .. } => from,
            Self::Governance { proposer, .. } => proposer,
            Self::InheritanceClaim { claimant, .. } => claimant,
        }
    }

    pub fn nonce(&self) -> u64 {
        match self {
            Self::TechGnosDeploy { nonce, .. } => *nonce,
            Self::TechGnosCall { nonce, .. } => *nonce,
            Self::Transfer { nonce, .. } => *nonce,
            Self::Governance { nonce, .. } => *nonce,
            Self::InheritanceClaim { nonce, .. } => *nonce,
        }
    }

    pub fn gas_budget(&self) -> u64 {
        match self {
            Self::TechGnosDeploy { gas, .. } => *gas,
            Self::TechGnosCall { gas, .. } => *gas,
            _ => 0,
        }
    }
}

/// Block header (contains metadata and signatures)
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct BlockHeader {
    /// Block number (height)
    pub block_num: u64,
    /// Hash of parent block
    pub parent_hash: [u8; 32],
    /// Timestamp (milliseconds since epoch)
    pub timestamp: u64,
    /// Root hash of world state (Merkle tree)
    pub state_root: [u8; 32],
    /// Merkle root of transactions
    pub merkle_root: [u8; 32],
    /// Hash of the validator set at this block
    pub validator_set_hash: u64,
    /// Signatures from validators (address → signature)
    pub signatures: HashMap<String, Vec<u8>>,
}

impl BlockHeader {
    pub fn new(
        block_num: u64,
        parent_hash: [u8; 32],
        timestamp: u64,
        state_root: [u8; 32],
        merkle_root: [u8; 32],
        validator_set_hash: u64,
    ) -> Self {
        Self {
            block_num,
            parent_hash,
            timestamp,
            state_root,
            merkle_root,
            validator_set_hash,
            signatures: HashMap::new(),
        }
    }

    pub fn add_signature(&mut self, validator_address: String, signature: Vec<u8>) {
        self.signatures.insert(validator_address, signature);
    }

    pub fn signature_count(&self) -> usize {
        self.signatures.len()
    }
}

/// A complete block
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Block {
    /// Block header (metadata + signatures)
    pub header: BlockHeader,
    /// Transactions in this block
    pub transactions: Vec<Transaction>,
}

impl Block {
    pub fn new(header: BlockHeader, transactions: Vec<Transaction>) -> Self {
        Self { header, transactions }
    }

    /// Verify basic block structure
    pub fn verify_structure(&self) -> Result<()> {
        // Block number must be positive
        if self.header.block_num == 0 {
            return Err(ConsensusError::InvalidBlockStructure(
                "block_num cannot be 0".to_string(),
            ));
        }

        // Must have at least one transaction (genesis block has coinbase)
        if self.transactions.is_empty() {
            return Err(ConsensusError::InvalidBlockStructure(
                "block must contain at least one transaction".to_string(),
            ));
        }

        // All transactions must be valid
        for tx in &self.transactions {
            Self::verify_transaction(tx)?;
        }

        Ok(())
    }

    /// Verify a single transaction
    fn verify_transaction(tx: &Transaction) -> Result<()> {
        // Sender address cannot be empty
        if tx.sender().is_empty() {
            return Err(ConsensusError::InvalidBlockStructure(
                "transaction sender cannot be empty".to_string(),
            ));
        }

        // Type-specific checks
        match tx {
            Transaction::TechGnosDeploy { bytecode, .. } => {
                if bytecode.is_empty() {
                    return Err(ConsensusError::InvalidBlockStructure(
                        "contract bytecode cannot be empty".to_string(),
                    ));
                }
            }
            Transaction::TechGnosCall { contract, function, .. } => {
                if contract.is_empty() {
                    return Err(ConsensusError::InvalidBlockStructure(
                        "contract address cannot be empty".to_string(),
                    ));
                }
                if function.is_empty() {
                    return Err(ConsensusError::InvalidBlockStructure(
                        "function name cannot be empty".to_string(),
                    ));
                }
            }
            Transaction::Transfer { from, to, amount, .. } => {
                if from.is_empty() || to.is_empty() {
                    return Err(ConsensusError::InvalidBlockStructure(
                        "transfer addresses cannot be empty".to_string(),
                    ));
                }
                if *amount == 0 {
                    return Err(ConsensusError::InvalidBlockStructure(
                        "transfer amount must be positive".to_string(),
                    ));
                }
            }
            _ => {}
        }

        Ok(())
    }

    pub fn transaction_count(&self) -> usize {
        self.transactions.len()
    }

    pub fn size_bytes(&self) -> usize {
        bincode::serialized_size(self).unwrap_or(0) as usize
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_transaction_sender() {
        let tx = Transaction::Transfer {
            from: "alice".to_string(),
            to: "bob".to_string(),
            amount: 100,
            nonce: 1,
        };
        assert_eq!(tx.sender(), "alice");
        assert_eq!(tx.nonce(), 1);
    }

    #[test]
    fn test_block_header_creation() {
        let header = BlockHeader::new(1, [0u8; 32], 1000, [1u8; 32], [2u8; 32], 1);
        assert_eq!(header.block_num, 1);
        assert_eq!(header.signature_count(), 0);
    }

    #[test]
    fn test_block_with_transactions() {
        let header = BlockHeader::new(1, [0u8; 32], 1000, [1u8; 32], [2u8; 32], 1);
        let tx = Transaction::Transfer {
            from: "alice".to_string(),
            to: "bob".to_string(),
            amount: 100,
            nonce: 1,
        };
        let block = Block::new(header, vec![tx]);
        assert_eq!(block.transaction_count(), 1);
    }

    #[test]
    fn test_block_structure_validation() {
        let header = BlockHeader::new(1, [0u8; 32], 1000, [1u8; 32], [2u8; 32], 1);
        let tx = Transaction::Transfer {
            from: "alice".to_string(),
            to: "bob".to_string(),
            amount: 100,
            nonce: 1,
        };
        let block = Block::new(header, vec![tx]);
        assert!(block.verify_structure().is_ok());
    }

    #[test]
    fn test_block_structure_empty_transactions() {
        let header = BlockHeader::new(1, [0u8; 32], 1000, [1u8; 32], [2u8; 32], 1);
        let block = Block::new(header, vec![]);
        assert!(block.verify_structure().is_err());
    }
}
