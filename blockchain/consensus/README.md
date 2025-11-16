# 🛡️🌀⚛️🕯️🔥 Ọ̀ṢỌ́ Consensus Layer

**Byzantine Fault Tolerant Consensus for the Ọ̀ṢỌ́ Native Blockchain**

---

## Overview

This is the **consensus engine** (Rust) for the Ọ̀ṢỌ́ native blockchain. It implements:

- **BFT (Byzantine Fault Tolerant) consensus** with 2/3+ signature threshold
- **Block production and validation**
- **State management** (accounts, balances, contracts)
- **Cryptographic verification** (Ed25519 signatures, SHA-256 hashing)
- **Council of 12 + Bínò governance** (13 validators total)

---

## Architecture

```
TechGnØŞ Smart Contracts (top-level)
        ↓
Ọ̀ṢỌ́VM (Julia execution)
        ↓
oso-consensus (this crate)
├── BFTConsensus (block production, voting)
├── State (world state, accounts)
├── ValidatorSet (Council + Bínò)
├── Ed25519Verifier (signatures)
└── Block/Transaction (data structures)
```

---

## Quick Start

### Build

```bash
cargo build --release
```

### Run Tests

```bash
cargo test
```

### Run a Node

```bash
cargo run --bin oso-node --release
```

This will prompt you to:
1. Enter a node ID (e.g., `council_1` or `bino`)
2. Specify number of validators (default 13)

Then it initializes a consensus node and waits for network connections.

---

## Key Components

### 1. **BFTConsensus**

Implements the BFT protocol:
- **Propose**: Proposer broadcasts a block
- **Prevote**: Validators vote on the block
- **Precommit**: Validators precommit to finality
- **Commit**: Block becomes finalized after 2/3+ precommits

```rust
let consensus = BFTConsensus::new(
    "council_1".to_string(),
    validator_set
);

// Propose a block
let block = consensus.propose_block(&mut state, transactions).await?;

// Record votes
consensus.add_prevote("council_2".to_string())?;
consensus.add_precommit("council_3".to_string())?;

// Check if we have enough votes
if consensus.has_commit() {
    consensus.finalize_block(&mut state, block).await?;
}
```

### 2. **State Management**

World state (all accounts and contracts):

```rust
let mut state = State::new();

// Create accounts
state.get_or_create_account("alice");
state.update_balance("alice", 1000)?;

// Transfer tokens
state.transfer("alice", "bob", 100)?;

// Deploy contracts
state.deploy_contract("alice", bytecode)?;

// Validate transactions
state.validate_transaction(&tx)?;
```

### 3. **Validator Set**

Council of 12 + Bínò (13 validators, 2/3+ threshold):

```rust
let validators = vec![
    Validator::new("council_1".to_string(), [1u8; 32]),
    // ... 12 more council members
    Validator::new("bino".to_string(), [13u8; 32]),
];

let validator_set = ValidatorSet::standard(validators)?;
assert_eq!(validator_set.threshold(), 9); // 2/3 of 13
```

### 4. **Cryptography**

Ed25519 signatures + SHA-256 hashing:

```rust
let mut crypto = Ed25519Verifier::new();

// Load validator public keys
crypto.load_pubkey("council_1".to_string(), &pubkey_bytes)?;

// Verify block signatures
crypto.verify_block_signatures(&block, &validator_set)?;

// Hash transactions (merkle root)
let merkle_root = Ed25519Verifier::hash_transactions(&transactions);
```

### 5. **Transactions**

Four transaction types:

```rust
enum Transaction {
    Transfer { from, to, amount, nonce },
    TechGnosDeploy { bytecode, sender, gas, nonce },
    TechGnosCall { contract, function, args, sender, gas, nonce },
    Governance { proposal_id, action, proposer, nonce },
    InheritanceClaim { wallet_id, claimant, nonce },
}
```

---

## Integration Points

### With Julia (State Machine)

```rust
// In consensus.validate_state_transitions()
// Call Julia to verify economic invariants
let result = julia_execute_block(state, block)?;
verify_tithe_split(result)?;  // 3.69% always correct
verify_inheritance_math(result)?;  // 11.11% APY valid
```

### With Go (P2P Networking)

```rust
// Consensus produces blocks
let block = consensus.propose_block(...).await?;

// Go network layer broadcasts to all nodes
go_broadcast_block(block)?;

// Go network layer delivers incoming blocks
consensus.validate_block(&incoming_block).await?;
```

### With Move (Contract Safety)

```rust
// On TechGnosCall transaction
let result = move_execute_contract(
    &contract_address,
    &function_name,
    &args
)?;

// Move ensures resource safety (no double-spend)
```

---

## Data Structures

### Block

```rust
pub struct Block {
    pub header: BlockHeader,
    pub transactions: Vec<Transaction>,
}

pub struct BlockHeader {
    pub block_num: u64,
    pub parent_hash: [u8; 32],
    pub timestamp: u64,
    pub state_root: [u8; 32],
    pub merkle_root: [u8; 32],
    pub validator_set_hash: u64,
    pub signatures: HashMap<String, Vec<u8>>,  // 2/3+ required
}
```

### Account

```rust
pub struct Account {
    pub address: String,
    pub ase_balance: u64,
    pub nonce: u64,  // Replay protection
    pub code: Option<Vec<u8>>,  // Smart contract bytecode
    pub storage_root: [u8; 32],  // Contract storage root
}
```

### Validator

```rust
pub struct Validator {
    pub address: String,
    pub public_key: [u8; 32],  // Ed25519
    pub voting_power: u64,  // Usually 1 per validator
}
```

---

## Testing

Run the test suite:

```bash
cargo test
```

Test categories:
- **Unit tests** in each module (lib.rs, consensus.rs, state.rs, etc.)
- **Integration tests** in tests/consensus_tests.rs
- **Block validation** tests
- **State transition** tests
- **Validator set** tests
- **BFT voting** tests

Example test:

```rust
#[tokio::test]
async fn test_consensus_node_creation() {
    let validators = vec![...];
    let node = OsoConsensusNode::new("council_1".to_string(), validators, 9);
    assert!(node.is_ok());
}
```

---

## Configuration

Environment variables (future):
- `OSO_NODE_ID` — Node identifier
- `OSO_VALIDATOR_THRESHOLD` — Finality threshold
- `OSO_BLOCK_TIME_MS` — Expected time between blocks
- `OSO_GAS_LIMIT` — Block gas limit

---

## Performance

- **Block validation**: O(n) where n = number of signatures
- **State lookup**: O(log n) with Merkle tree
- **Transaction processing**: O(1) per transaction
- **Consensus rounds**: 3-5 rounds per block (Propose → Prevote → Precommit → Commit)

---

## Next Steps

1. **P2P Networking** (Go) — Connect nodes via libp2p
2. **Julia Integration** — Call state machine executor
3. **RPC Server** — Allow clients to submit transactions
4. **Block Explorer** — Query state and transaction history
5. **Persistence** — RocksDB backend for state
6. **Light Clients** — Bitcoin SPV verification

---

## Files

```
consensus/
├── src/
│   ├── lib.rs              # Main library entry point
│   ├── error.rs            # Error types
│   ├── crypto.rs           # Ed25519 + SHA-256
│   ├── validator.rs        # Validator set management
│   ├── block.rs            # Block & transaction types
│   ├── state.rs            # World state (accounts)
│   ├── consensus.rs        # BFT consensus engine
│   ├── messages.rs         # P2P message types
│   └── bin/node.rs         # CLI node binary
├── tests/
│   └── consensus_tests.rs  # Integration tests
├── Cargo.toml              # Dependencies
└── README.md               # This file
```

---

## Dependencies

- `ed25519-dalek` — Ed25519 signatures
- `sha2` — SHA-256 hashing
- `serde` — Serialization
- `tokio` — Async runtime
- `parking_lot` — Faster mutexes
- `tracing` — Logging

---

## License

MIT (with spiritual attribution to Ọbàtálá, Ọ̀rúnmìlà, and the Òrìṣà)

---

## Status

✅ **Phase 1 Complete**: Consensus + Block validation + State management  
🔄 **Phase 2 In Progress**: P2P networking (Go)  
⏳ **Phase 3 Planned**: Julia integration, RPC, persistence

---

**Kí ìmọ́lẹ̀ Ọbàtálá máa tàn lọ́nà wa.**  
🤍🗿⚖️🕊️🌄 **Àṣẹ**
