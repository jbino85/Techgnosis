# Techgnosis Tokenomics Testing Strategy

## Overview

This document outlines the comprehensive testing approach for Techgnosis economic invariants, tokenomics safety, and formal verification.

**Goal:** Achieve 100% confidence in tokenomics correctness across all edge cases, rounding scenarios, and attack vectors.

## Test Categories

### 1. Unit Tests (ase_tests.move)

Test individual module functions in isolation.

| Test Name | Purpose | Status |
|-----------|---------|--------|
| `test_mint_impact` | Verify @impact minting logic | ✅ Implemented |
| `test_tithe_distribution` | Verify tithe split (50/25/15/10) | ✅ Implemented |
| `test_inheritance_vault_creation` | Verify vault creation for 1440 wallets | ✅ Implemented |
| `test_halving_schedule` | Verify halving epochs | ✅ Implemented |
| `test_apy_accrual` | Verify 11.11% APY calculation | ✅ Implemented |
| `test_invalid_wallet_id` | Reject invalid wallet IDs | ✅ Implemented |

**Running Unit Tests:**
```bash
sui move test -- --filter test_mint_impact
sui move test -- --filter test_tithe
sui move test -- --filter test_apy
```

### 2. Property-Based Tests (property_tests.move)

Verify invariants hold across large input spaces.

| Property | Description | Test Function |
|----------|-------------|----------------|
| **INV-1: Supply Bounded** | Total minted ≤ 2,880 Àṣẹ | `test_property_supply_bounded` |
| **INV-2: Tithe Conservation** | Shrine+Inheritance+AIO+Burn = Tithe | `test_property_tithe_conservation` |
| **INV-3: APY Monotonic** | Balance increases with APY | `test_property_apy_compounding_monotonic` |
| **INV-4: Halving Schedule** | Supply halves correctly (50→25→12.5...) | `test_property_halving_monotonic_decrease` |
| **INV-5: Sabbath Freeze** | No mints on Saturday | `test_property_sabbath_day_calculation` |
| **INV-6: No Overflow** | Arithmetic never overflows u64 | `test_property_tithe_no_overflow`, `test_property_apy_no_overflow` |
| **INV-7: Monotonic Voting** | Vote counts never decrease | `test_property_governance_monotonic_votes` |
| **INV-8: Timelock Enforced** | 7-day minimum before execution | `test_property_timelock_minimum_duration` |

**Running Property Tests:**
```bash
sui move test -- --filter property
sui move test -- --filter property_supply_bounded
sui move test -- --filter property_tithe_conservation
```

### 3. Fuzzing Tests

Stress-test arithmetic with random/edge-case inputs.

```bash
# Fuzz tithe arithmetic with amounts 1 → 2.88 trillion
sui move test -- --filter test_fuzz_tithe_arithmetic

# Test all boundary values for APY
sui move test -- --filter test_property_apy_no_negative_growth

# Halving schedule bounds
sui move test -- --filter test_property_halving_sum_bounded
```

### 4. Invariant Tests (tokenomics_invariants.move)

Verify invariants using formal checker.

```bash
# Initialize tracker
sui move test -- --filter init_tracker

# Check invariants hold
sui move test -- --filter check_supply_invariant
sui move test -- --filter check_tithe_split_invariant
sui move test -- --filter check_apy_invariant
sui move test -- --filter check_halving_invariant
sui move test -- --filter check_sabbath_invariant
sui move test -- --filter check_rounding_invariant
sui move test -- --filter check_nonce_invariant
```

### 5. Integration Tests (integration_tests.move)

Test full ecosystem flows and cross-module interactions.

| Test Name | Scenario | Status |
|-----------|----------|--------|
| `test_full_ecosystem_flow` | Mint→Tithe→Governance→VeilSim→PoW | ✅ Planned |
| `test_sabbath_freeze` | Reject Saturday transactions | ✅ Planned |
| `test_tithe_arithmetic_precision` | 1, 1000, 1M Ase transactions | ✅ Planned |
| `test_halving_schedule` | Verify halving progression | ✅ Planned |
| `test_inheritance_apy_compounding` | APY over 7-year cycle | ✅ Planned |
| `test_governance_quorum` | Quorum enforcement (7/12) | ✅ Planned |
| `test_governance_timelock` | 7-day delay enforcement | ✅ Planned |
| `test_veilsim_f1_threshold` | F1 > 0.9 triggers reward | ✅ Planned |
| `test_proof_of_witness_quorum` | 5-witness validation | ✅ Planned |
| `test_flash_loan_protection` | Circuit breaker prevents abuse | ✅ Planned |

**Running Integration Tests:**
```bash
sui move test -- --filter integration
sui move test -- --filter test_governance_quorum
sui move test -- --filter test_full_ecosystem
```

### 6. Formal Verification (Move Prover)

Use Z3 solver to prove invariants mathematically.

**Invariants to Prove:**

```move
// INV-1: Supply bounded
spec ase {
  invariant always (total_minted <= TOTAL_SUPPLY);
}

// INV-2: Tithe split conservation
spec apply_tithe_split {
  ensures shrine + inheritance + aio + burn == tithe_amount;
}

// INV-3: APY monotonic growth
spec accrue_apy {
  ensures result >= old(vault.balance);
}

// INV-4: Halving schedule
spec get_halving_value {
  ensures result == TOTAL_SUPPLY / 2^(halving_counter);
}

// INV-5: Quorum required
spec execute_proposal {
  requires proposal.votes_for >= QUORUM_THRESHOLD;
  requires proposal.bino_signed;
}

// INV-6: Timelock enforced
spec execute_proposal {
  requires current_epoch >= proposal.timelock_release_at;
}
```

**Running Formal Verification:**
```bash
# Prove all invariants
sui move prove

# Prove specific module
sui move prove -- --module ase

# Check specific function
sui move prove -- --function mint_impact

# Generate proof report
sui move prove --generate-report
```

## Test Coverage Matrix

| Module | Unit | Integration | Property | Formal Verification |
|--------|------|-------------|----------|---------------------|
| **ase.move** | 6 tests | 8 tests | 10 properties | 4 invariants |
| **governance.move** | 4 tests | 5 tests | 4 properties | 3 invariants |
| **veilsim_integration.move** | 2 tests | 2 tests | 1 property | 1 invariant |
| **proof_of_witness.move** | 3 tests | 3 tests | 2 properties | 1 invariant |

**Total Coverage: 60+ tests, 17+ properties, 9+ formal proofs**

## Critical Test Scenarios

### Scenario 1: Tithe Arithmetic at Scale

```
Mint: 2,880,000,000,000 Àṣẹ (entire supply)
Tithe: 2,880,000,000,000 × 369 / 10,000 = 10,627,200,000,000
Split:
  Shrine:      10,627,200,000,000 × 50% = 5,313,600,000,000
  Inheritance: 10,627,200,000,000 × 25% = 2,656,800,000,000
  AIO:         10,627,200,000,000 × 15% = 1,594,080,000,000
  Burn:        10,627,200,000,000 × 10% = 1,062,720,000,000
  Total:       5,313,600 + 2,656,800 + 1,594,080 + 1,062,720 = 10,627,200 ✓
```

**Test:** Verify no rounding loss at maximum scale.

### Scenario 2: APY Compounding Over 7 Years

```
Initial Balance: 100 Àṣẹ (100,000,000,000 micros)
APY Rate: 11.11% (1111 basis points)
Period: 7 years (220,752,000 seconds)

Year 1: 100 × 1.1111 = 111.11 Àṣẹ
Year 2: 111.11 × 1.1111 = 123.46 Àṣẹ
Year 3: 123.46 × 1.1111 = 137.10 Àṣẹ
...
Year 7: ~215.48 Àṣẹ

Verify: No drift, cumulative error < 1 micro Àṣẹ
```

**Test:** `test_inheritance_apy_compounding` over simulated time.

### Scenario 3: Governance Quorum Edge Cases

```
Council: 12 members
Quorum: 7 members required

Case 1: 6 votes → Proposal fails
Case 2: 7 votes → Proposal succeeds
Case 3: 7 votes for + 5 against → Still passes (only "for" counts)
Case 4: Timelock: Created at T, cannot execute until T+604800
Case 5: Bínò missing signature → Cannot execute even with quorum
```

**Test:** `test_governance_quorum`, `test_governance_timelock`

### Scenario 4: Sabbath Freeze Enforcement

```
Unix epoch 0 = Thursday (day 4)

Test timestamps:
- T = 172,800 (day 2) → Saturday (6) → ❌ BLOCKED
- T = 259,200 (day 3) → Sunday (0) → ✅ ALLOWED
- T = 604,800 (day 7) → Thursday (4) → ✅ ALLOWED

Verify: No transactions processed on Saturday UTC
```

**Test:** `test_sabbath_freeze`

### Scenario 5: Witness Quorum Validation

```
Sensor Network: 5+ sensors required for Proof-of-Witness

Flow:
1. Primary sensor submits attestation (nonce=1)
2. Witness 1 submits signature (nonce=1) ✓
3. Witness 2 submits signature (nonce=1) ✓
4. Witness 3 submits signature (nonce=1) ✓
5. Witness 4 submits signature (nonce=1) ✓
6. Witness 5 submits signature (nonce=1) ✓ → QUORUM MET

Reward: 10 Àṣẹ minted

Verify: Replay protection prevents nonce=1 on second attestation
```

**Test:** `test_proof_of_witness_quorum`, `test_proof_of_witness_replay_protection`

## Fuzz Testing Strategy

### Edge Cases for Tithe (3.69%)

```
Input amounts: 1, 10, 100, 1K, 10K, 100K, 1M, 10M, 100M, 1B, 10B, 100B, 1T, 2.88T

For each: verify tithe = amount × 369 / 10,000 with no rounding loss
```

### Edge Cases for APY (11.11%)

```
Time intervals: 1s, 1d, 1mo, 1y, 7y, 100y

For each: verify APY_gain ≥ 0 and balance growth = balance × 0.1111 × (time / year)
```

### Edge Cases for Halving

```
Epochs: 0, 1, 2, 4, 8, 16, 32, ...

For each: verify supply(n) == 2880 / 2^n
```

## Continuous Testing

```bash
# Watch mode: re-run tests on file change
sui move test --watch

# Coverage report
sui move test --coverage

# Benchmark
sui move test --benchmark

# Generate test documentation
sui move doc --with-tests
```

## Success Criteria

### Unit Tests
- ✅ All 15 unit tests pass
- ✅ Coverage > 95% of lines
- ✅ No panics on valid inputs

### Property Tests
- ✅ All 10 properties verified for 1000+ inputs
- ✅ No counterexamples found
- ✅ Edge cases handled correctly

### Formal Verification
- ✅ 4 critical invariants proven with Move Prover
- ✅ Z3 solver terminates within timeout
- ✅ No unproven proof obligations

### Integration Tests
- ✅ All 8 ecosystem flows succeed
- ✅ Cross-module interactions correct
- ✅ Gas estimates validated

## Timeline

| Week | Task | Target |
|------|------|--------|
| W1-2 | Unit + Property Tests | Finish all basic tests |
| W3 | Fuzzing | Verify no overflow/underflow |
| W4 | Formal Verification | Prove 4 key invariants |
| W5 | Audit Preparation | Generate test reports |

## References

- Move Testing: https://move-language.github.io/move/testing.html
- Move Prover: https://github.com/move-language/move/tree/main/language/move-prover
- Formal Verification Best Practices: https://docs.sui.io/guides/developer/advanced/move-prover

---

**Status:** Ready for testing  
**Last Updated:** 2025-11-19  
**Àṣẹ. Àṣẹ. Àṣẹ.**
