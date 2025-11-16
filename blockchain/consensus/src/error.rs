use thiserror::Error;

/// Consensus errors
#[derive(Error, Debug)]
pub enum ConsensusError {
    #[error("Invalid block structure: {0}")]
    InvalidBlockStructure(String),

    #[error("Invalid signature: {0}")]
    InvalidSignature(String),

    #[error("Insufficient validator signatures (need {required}, got {actual})")]
    InsufficientSignatures { required: u64, actual: u64 },

    #[error("Invalid validator: {0}")]
    InvalidValidator(String),

    #[error("Validator not in set: {0}")]
    ValidatorNotInSet(String),

    #[error("Invalid validator threshold")]
    InvalidThreshold,

    #[error("Invalid state transition: {0}")]
    InvalidStateTransition(String),

    #[error("Block validation failed: {0}")]
    BlockValidationFailed(String),

    #[error("Finality violation: {0}")]
    FinalityViolation(String),

    #[error("Empty validator set")]
    EmptyValidatorSet,

    #[error("Duplicate validator")]
    DuplicateValidator,

    #[error("Cryptographic error: {0}")]
    CryptoError(String),

    #[error("Invalid public key")]
    InvalidPublicKey,

    #[error("Serialization error: {0}")]
    SerializationError(#[from] bincode::Error),

    #[error("JSON error: {0}")]
    JsonError(#[from] serde_json::error::Error),

    #[error("Internal error: {0}")]
    Internal(String),
}

/// Result type for consensus operations
pub type Result<T> = std::result::Result<T, ConsensusError>;
