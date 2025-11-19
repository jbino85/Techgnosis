# SUI Move Contracts Build & Deployment Guide

## Prerequisites

- **SUI CLI** v1.0+: [Install](https://docs.sui.io/guides/developer/getting-started/sui-install)
- **Rust** 1.70+: [Install](https://rustup.rs/)
- **Move** language knowledge: [Docs](https://move-language.github.io/)

## Project Structure

```
move_contracts/
├── Move.toml              # Package manifest
├── sources/
│   ├── ase.move          # Core tokenomics (Àṣẹ token)
│   ├── veilsim_integration.move  # F1-score rewards
│   ├── governance.move   # Council of 12 voting
│   ├── proof_of_witness.move     # IoT sensor network
│   ├── ase_tests.move    # Unit tests
│   └── integration_tests.move    # Full ecosystem tests
└── BUILD.md             # This file
```

## Building

### 1. Compile Contracts

```bash
cd /data/data/com.termux/files/home/osovm/move_contracts
sui move build
```

This generates:
- `build/` directory with compiled bytecode
- `sources/` with Move source files
- Documentation in `sui-doc/`

### 2. Run Tests

```bash
sui move test
```

Expected output:
```
Running Move unit tests...
test ase_tests::test_mint_impact ... ok
test ase_tests::test_tithe_distribution ... ok
test ase_tests::test_inheritance_vault_creation ... ok
test ase_tests::test_halving_schedule ... ok
test ase_tests::test_apy_accrual ... ok
test integration_tests::test_full_ecosystem_flow ... ok
test governance_tests::test_governance_quorum ... ok
...
```

### 3. Generate Documentation

```bash
sui move doc
```

Creates HTML documentation in `sui-doc/` directory.

## Deployment to SUI Testnet

### 1. Setup Wallet

```bash
# Create a new SUI wallet (or use existing)
sui client new-address ed25519

# Request testnet SUI from faucet
sui client faucet
```

### 2. Publish Package

```bash
sui client publish --gas-budget 100000000
```

Output:
```
Transaction ID: 0x...
Package ID: 0x... (save this)
Module: ase
Module: governance
Module: veilsim_integration
Module: proof_of_witness
```

### 3. Initialize Contracts

After publishing, initialize shared objects:

```bash
# Initialize Àṣẹ token system
sui client call --function init --module ase \
  --package <PACKAGE_ID> \
  --gas-budget 50000000

# Initialize Governance
sui client call --function init --module governance \
  --package <PACKAGE_ID> \
  --gas-budget 50000000

# Initialize VeilSim
sui client call --function init --module veilsim_integration \
  --package <PACKAGE_ID> \
  --gas-budget 50000000

# Initialize Proof-of-Witness
sui client call --function init --module proof_of_witness \
  --package <PACKAGE_ID> \
  --gas-budget 50000000
```

## Testing Transactions

### Test Minting

```bash
# Mint via @impact
sui client call \
  --function mint_impact \
  --module ase \
  --package <PACKAGE_ID> \
  --args 1000000000 <GOVERNOR_ID> <TREASURY_ID> \
  --gas-budget 50000000
```

### Test Governance

```bash
# Create proposal
sui client call \
  --function create_proposal \
  --module governance \
  --package <PACKAGE_ID> \
  --args 1 "name" "description" "data" <GOVERNANCE_CONTRACT_ID> \
  --gas-budget 50000000

# Vote
sui client call \
  --function vote \
  --module governance \
  --package <PACKAGE_ID> \
  --args <PROPOSAL_ID> true <GOVERNANCE_CONTRACT_ID> \
  --gas-budget 50000000

# Approve (after quorum)
sui client call \
  --function approve_proposal \
  --module governance \
  --package <PACKAGE_ID> \
  --args <PROPOSAL_ID> <GOVERNANCE_CONTRACT_ID> \
  --gas-budget 50000000

# Bínò sign
sui client call \
  --function bino_sign_proposal \
  --module governance \
  --package <PACKAGE_ID> \
  --args <PROPOSAL_ID> <SIGNATURE> <GOVERNANCE_CONTRACT_ID> \
  --gas-budget 50000000

# Execute (after 7-day timelock)
sui client call \
  --function execute_proposal \
  --module governance \
  --package <PACKAGE_ID> \
  --args <PROPOSAL_ID> <GOVERNANCE_CONTRACT_ID> \
  --gas-budget 50000000
```

### Test VeilSim

```bash
# Submit veil proof
sui client call \
  --function submit_veil_proof \
  --module veilsim_integration \
  --package <PACKAGE_ID> \
  --args <PROOF> <ORACLE_ID> <REGISTRY_ID> \
  --gas-budget 50000000
```

### Test Proof-of-Witness

```bash
# Register sensor
sui client call \
  --function register_sensor \
  --module proof_of_witness \
  --package <PACKAGE_ID> \
  --args 1 "metadata" "location" <ORACLE_ID> <REGISTRY_ID> \
  --gas-budget 50000000

# Submit attestation
sui client call \
  --function submit_attestation \
  --module proof_of_witness \
  --package <PACKAGE_ID> \
  --args 1 "data_hash" "merkle_root" <ORACLE_ID> <REGISTRY_ID> \
  --gas-budget 50000000

# Submit witness
sui client call \
  --function submit_witness \
  --module proof_of_witness \
  --package <PACKAGE_ID> \
  --args <ATTESTATION_ID> 2 "signature" <ORACLE_ID> \
  --gas-budget 50000000

# Validate attestation (after 5 witnesses)
sui client call \
  --function validate_attestation \
  --module proof_of_witness \
  --package <PACKAGE_ID> \
  --args <ATTESTATION_ID> <ORACLE_ID> <REGISTRY_ID> \
  --gas-budget 50000000

# Claim reward
sui client call \
  --function claim_reward \
  --module proof_of_witness \
  --package <PACKAGE_ID> \
  --args <ATTESTATION_ID> <ORACLE_ID> \
  --gas-budget 50000000
```

## Verification

### Check Object State

```bash
# View shared object
sui client object --id <OBJECT_ID>

# List all objects
sui client objects
```

### Verify Transactions

```bash
# View transaction
sui client tx <TX_ID>
```

## Formal Verification

### Using Move Prover

```bash
# Prove tokenomics invariants
sui move prove

# Specific invariant
sui move prove --module ase
```

Output files: `build/Move.prove` with proof results.

## Troubleshooting

### Compilation Errors

```bash
# Clean build
sui move clean
sui move build --force
```

### Test Failures

```bash
# Run with verbose output
sui move test -- --nocapture
```

### Transaction Failures

Common issues:
- **Insufficient gas**: Increase `--gas-budget`
- **Object not found**: Verify object ID is correct
- **Function not found**: Check module export visibility

## Next Steps

1. **Audit Review**: Submit compiled bytecode to external auditor
2. **Mainnet Deployment**: After testnet validation, publish to SUI mainnet
3. **Governance Setup**: Initialize council members via governance module
4. **Token Distribution**: Mint initial supply (2880 Àṣẹ) to inheritance vaults
5. **Oracle Integration**: Configure Chainlink or custom oracle for Proof-of-Witness

## References

- [SUI Documentation](https://docs.sui.io/)
- [Move Language](https://move-language.github.io/)
- [SUI SDK TypeScript](https://sdk.mysten.labs/)
- [Test Framework](https://docs.sui.io/guides/developer/advanced/unit-testing)

---

**Status:** Ready for deployment  
**Auditor:** Master Auditor (SUI Specialist)  
**Date:** 2025-11-19  
**Àṣẹ. Àṣẹ. Àṣẹ.**
