// **Validator management**
// Council of 12 + Bínò governance

use crate::error::{ConsensusError, Result};
use serde::{Deserialize, Serialize};
use std::collections::HashSet;

/// A single validator in the consensus set
#[derive(Clone, Debug, Serialize, Deserialize, Eq, PartialEq)]
pub struct Validator {
    /// Validator address (Council member or Bínò)
    pub address: String,
    /// Ed25519 public key (32 bytes)
    pub public_key: [u8; 32],
    /// Voting power (typically 1 per validator, but can be weighted)
    pub voting_power: u64,
}

impl Validator {
    pub fn new(address: String, public_key: [u8; 32]) -> Self {
        Self {
            address,
            public_key,
            voting_power: 1,
        }
    }

    pub fn with_voting_power(address: String, public_key: [u8; 32], voting_power: u64) -> Self {
        Self {
            address,
            public_key,
            voting_power,
        }
    }
}

/// Set of validators (Council of 12 + Bínò)
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ValidatorSet {
    /// All validators
    validators: Vec<Validator>,
    /// Validator addresses (for O(1) lookup)
    validator_set: HashSet<String>,
    /// Threshold for block finality (2/3 + 1)
    threshold: u64,
}

impl ValidatorSet {
    /// Create a new validator set
    pub fn new(validators: Vec<Validator>, custom_threshold: u64) -> Result<Self> {
        if validators.is_empty() {
            return Err(ConsensusError::EmptyValidatorSet);
        }

        // Check for duplicates
        let addresses: HashSet<_> = validators.iter().map(|v| &v.address).collect();
        if addresses.len() != validators.len() {
            return Err(ConsensusError::DuplicateValidator);
        }

        // Calculate total voting power
        let total_voting_power: u64 = validators.iter().map(|v| v.voting_power).sum();

        // Threshold must be > 2/3 of total voting power
        let min_threshold = (total_voting_power * 2 / 3) + 1;
        if custom_threshold < min_threshold {
            return Err(ConsensusError::InvalidThreshold);
        }

        let validator_set: HashSet<String> = validators.iter().map(|v| v.address.clone()).collect();

        Ok(Self {
            validators,
            validator_set,
            threshold: custom_threshold,
        })
    }

    /// Create a standard validator set (Council of 12 + Bínò = 13 validators, 2/3 threshold)
    pub fn standard(validators: Vec<Validator>) -> Result<Self> {
        if validators.len() != 13 {
            return Err(ConsensusError::Internal(
                "Standard validator set requires exactly 13 validators (12 Council + Bínò)"
                    .to_string(),
            ));
        }

        // 2/3 of 13 = 8.66, so threshold = 9
        let threshold = 9;
        Self::new(validators, threshold)
    }

    /// Get all validators
    pub fn validators(&self) -> &[Validator] {
        &self.validators
    }

    /// Check if a validator is in the set
    pub fn contains_validator(&self, address: &str) -> bool {
        self.validator_set.contains(address)
    }

    /// Get validator by address
    pub fn get_validator(&self, address: &str) -> Option<&Validator> {
        self.validators.iter().find(|v| v.address == address)
    }

    /// Get finality threshold (number of signatures required)
    pub fn threshold(&self) -> u64 {
        self.threshold
    }

    /// Get total voting power
    pub fn total_voting_power(&self) -> u64 {
        self.validators.iter().map(|v| v.voting_power).sum()
    }

    /// Get validator count
    pub fn len(&self) -> usize {
        self.validators.len()
    }

    pub fn is_empty(&self) -> bool {
        self.validators.is_empty()
    }
}

impl Default for ValidatorSet {
    fn default() -> Self {
        let validators = vec![
            Validator::new("council_1".to_string(), [1u8; 32]),
            Validator::new("council_2".to_string(), [2u8; 32]),
            Validator::new("council_3".to_string(), [3u8; 32]),
            Validator::new("council_4".to_string(), [4u8; 32]),
            Validator::new("council_5".to_string(), [5u8; 32]),
            Validator::new("council_6".to_string(), [6u8; 32]),
            Validator::new("council_7".to_string(), [7u8; 32]),
            Validator::new("council_8".to_string(), [8u8; 32]),
            Validator::new("council_9".to_string(), [9u8; 32]),
            Validator::new("council_10".to_string(), [10u8; 32]),
            Validator::new("council_11".to_string(), [11u8; 32]),
            Validator::new("council_12".to_string(), [12u8; 32]),
            Validator::new("bino".to_string(), [13u8; 32]),
        ];

        Self::standard(validators).unwrap()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validator_creation() {
        let validator = Validator::new("test".to_string(), [0u8; 32]);
        assert_eq!(validator.address, "test");
        assert_eq!(validator.voting_power, 1);
    }

    #[test]
    fn test_validator_set_standard() {
        let set = ValidatorSet::default();
        assert_eq!(set.len(), 13);
        assert_eq!(set.threshold(), 9);
    }

    #[test]
    fn test_validator_set_contains() {
        let set = ValidatorSet::default();
        assert!(set.contains_validator("council_1"));
        assert!(set.contains_validator("bino"));
        assert!(!set.contains_validator("unknown"));
    }

    #[test]
    fn test_validator_set_invalid_threshold() {
        let validators = vec![
            Validator::new("v1".to_string(), [1u8; 32]),
            Validator::new("v2".to_string(), [2u8; 32]),
        ];
        // Threshold must be > 2/3 of 2 = 1.33, so min 2
        let result = ValidatorSet::new(validators, 1);
        assert!(result.is_err());
    }
}
