// **World state management**
// Accounts, balances, contract storage

use crate::block::Transaction;
use crate::error::Result;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::HashMap;

/// Account in the Ọ̀ṢỌ́ chain
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Account {
    /// Account address
    pub address: String,
    /// Àṣẹ balance (in smallest units)
    pub ase_balance: u64,
    /// Account nonce (replay protection)
    pub nonce: u64,
    /// Smart contract code (if this account is a contract)
    pub code: Option<Vec<u8>>,
    /// Storage root (for contract state)
    pub storage_root: [u8; 32],
}

impl Account {
    pub fn new(address: String) -> Self {
        Self {
            address,
            ase_balance: 0,
            nonce: 0,
            code: None,
            storage_root: [0u8; 32],
        }
    }

    pub fn with_balance(address: String, balance: u64) -> Self {
        Self {
            address,
            ase_balance: balance,
            nonce: 0,
            code: None,
            storage_root: [0u8; 32],
        }
    }

    pub fn is_contract(&self) -> bool {
        self.code.is_some()
    }
}

/// World state (all accounts and contracts)
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct State {
    /// All accounts (address → Account)
    pub accounts: HashMap<String, Account>,
    /// Block height
    pub block_height: u64,
    /// Current state root hash
    pub root_hash: [u8; 32],
    /// Block history (block_num → block_hash)
    pub block_history: HashMap<u64, [u8; 32]>,
    /// Transaction receipts (tx_hash → receipt)
    pub receipts: HashMap<String, TransactionReceipt>,
}

/// Receipt of transaction execution
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TransactionReceipt {
    pub tx_hash: String,
    pub block_num: u64,
    pub status: TransactionStatus,
    pub gas_used: u64,
    pub output: Vec<u8>,
}

#[derive(Clone, Debug, Serialize, Deserialize, Eq, PartialEq)]
pub enum TransactionStatus {
    Success,
    Failed(String),
    Pending,
}

impl State {
    pub fn new() -> Self {
        Self {
            accounts: HashMap::new(),
            block_height: 0,
            root_hash: [0u8; 32],
            block_history: HashMap::new(),
            receipts: HashMap::new(),
        }
    }

    /// Get or create an account
    pub fn get_or_create_account(&mut self, address: &str) -> &mut Account {
        self.accounts
            .entry(address.to_string())
            .or_insert_with(|| Account::new(address.to_string()))
    }

    /// Get an account (read-only)
    pub fn get_account(&self, address: &str) -> Option<&Account> {
        self.accounts.get(address)
    }

    /// Update account balance
    pub fn update_balance(&mut self, address: &str, new_balance: u64) -> Result<()> {
        let account = self.get_or_create_account(address);
        account.ase_balance = new_balance;
        Ok(())
    }

    /// Transfer tokens between accounts
    pub fn transfer(&mut self, from: &str, to: &str, amount: u64) -> Result<()> {
        let from_account = self.get_account(from).cloned().unwrap_or_else(|| Account::new(from.to_string()));
        
        if from_account.ase_balance < amount {
            return Err(crate::error::ConsensusError::InvalidStateTransition(
                format!("insufficient balance: {} < {}", from_account.ase_balance, amount),
            ));
        }

        let from_account = self.get_or_create_account(from);
        from_account.ase_balance -= amount;

        let to_account = self.get_or_create_account(to);
        to_account.ase_balance += amount;

        Ok(())
    }

    /// Deploy a contract
    pub fn deploy_contract(&mut self, address: &str, bytecode: Vec<u8>) -> Result<()> {
        let account = self.get_or_create_account(address);
        account.code = Some(bytecode);
        Ok(())
    }

    /// Increment block height and update root hash
    pub fn commit_block(&mut self, block_hash: [u8; 32]) -> Result<()> {
        self.block_height += 1;
        self.block_history.insert(self.block_height, block_hash);
        self.update_root_hash();
        Ok(())
    }

    /// Recalculate state root hash
    fn update_root_hash(&mut self) {
        let serialized = bincode::serialize(&self.accounts).unwrap_or_default();
        let mut hasher = Sha256::new();
        hasher.update(&serialized);
        let hash = hasher.finalize();
        self.root_hash.copy_from_slice(&hash[..32]);
    }

    /// Get current state root
    pub fn root_hash(&self) -> [u8; 32] {
        self.root_hash
    }

    /// Get current block height
    pub fn block_height(&self) -> u64 {
        self.block_height
    }

    /// Get account count
    pub fn account_count(&self) -> usize {
        self.accounts.len()
    }

    /// Validate transaction against current state
    pub fn validate_transaction(&self, tx: &Transaction) -> Result<()> {
        match tx {
            Transaction::Transfer { from, to, amount, nonce } => {
                // Check sender exists and has sufficient balance
                let account = self.get_account(from).ok_or_else(|| {
                    crate::error::ConsensusError::InvalidStateTransition(
                        format!("account not found: {}", from),
                    )
                })?;

                if account.nonce != *nonce {
                    return Err(crate::error::ConsensusError::InvalidStateTransition(
                        format!("nonce mismatch: expected {}, got {}", account.nonce, nonce),
                    ));
                }

                if account.ase_balance < *amount {
                    return Err(crate::error::ConsensusError::InvalidStateTransition(
                        format!("insufficient balance: {} < {}", account.ase_balance, amount),
                    ));
                }

                // Recipient cannot be empty
                if to.is_empty() {
                    return Err(crate::error::ConsensusError::InvalidStateTransition(
                        "recipient cannot be empty".to_string(),
                    ));
                }

                Ok(())
            }

            Transaction::TechGnosDeploy { sender, nonce, .. } => {
                let account = self.get_account(sender).ok_or_else(|| {
                    crate::error::ConsensusError::InvalidStateTransition(
                        format!("account not found: {}", sender),
                    )
                })?;

                if account.nonce != *nonce {
                    return Err(crate::error::ConsensusError::InvalidStateTransition(
                        format!("nonce mismatch: expected {}, got {}", account.nonce, nonce),
                    ));
                }

                Ok(())
            }

            Transaction::TechGnosCall { sender, nonce, .. } => {
                let account = self.get_account(sender).ok_or_else(|| {
                    crate::error::ConsensusError::InvalidStateTransition(
                        format!("account not found: {}", sender),
                    )
                })?;

                if account.nonce != *nonce {
                    return Err(crate::error::ConsensusError::InvalidStateTransition(
                        format!("nonce mismatch: expected {}, got {}", account.nonce, nonce),
                    ));
                }

                Ok(())
            }

            _ => Ok(()),
        }
    }
}

impl Default for State {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_state_creation() {
        let state = State::new();
        assert_eq!(state.block_height, 0);
        assert_eq!(state.account_count(), 0);
    }

    #[test]
    fn test_account_creation() {
        let mut state = State::new();
        let account = state.get_or_create_account("alice");
        assert_eq!(account.address, "alice");
        assert_eq!(account.ase_balance, 0);
    }

    #[test]
    fn test_transfer() {
        let mut state = State::new();
        state.update_balance("alice", 1000).unwrap();

        let result = state.transfer("alice", "bob", 100);
        assert!(result.is_ok());

        assert_eq!(state.get_account("alice").unwrap().ase_balance, 900);
        assert_eq!(state.get_account("bob").unwrap().ase_balance, 100);
    }

    #[test]
    fn test_transfer_insufficient_balance() {
        let mut state = State::new();
        state.update_balance("alice", 50).unwrap();

        let result = state.transfer("alice", "bob", 100);
        assert!(result.is_err());
    }

    #[test]
    fn test_block_height_increment() {
        let mut state = State::new();
        assert_eq!(state.block_height(), 0);

        state.commit_block([1u8; 32]).unwrap();
        assert_eq!(state.block_height(), 1);

        state.commit_block([2u8; 32]).unwrap();
        assert_eq!(state.block_height(), 2);
    }
}
