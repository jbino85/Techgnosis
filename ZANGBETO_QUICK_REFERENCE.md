# Zàngbétò v1.0 — Quick Reference Card

## What Is It?

**Zàngbétò v1.0** = Unified smart contract security ritual system combining:
- **Immune (Python):** Veils 1 (bones), 4 (temple codes), 6 (chaos) under sandbox limits
- **Shrine (Move/JS):** Sui devnet receipt ledger + witness governance + Arweave/OTS anchoring

---

## The Dance (4 Steps)

| Step | Command | What Happens |
|------|---------|--------------|
| **1. Setup** | `make shrine-bootstrap` | Publish Move pkg; init on-chain objects (ledger, registry, witness set) |
| **2. Patrol** | `make patrol` | Run Veils 1/4/6 under containment; generate receipts → `immune/receipts/out/` |
| **3. Anchor** | `make anchor` | Upload receipts to Arweave; timestamp with OpenTimestamps |
| **4. Submit** | `make submit` | Post anchored receipt on-chain to `zbt::core::submit_receipt` |

**All-in-one:**
```bash
make shrine-bootstrap && make patrol && make anchor && make submit
```

---

## Directory Quick Map

| Path | Purpose |
|------|---------|
| `immune/masks/` | Veil 1 (bones), 4 (ratios), 6 (chaos) Python scripts |
| `immune/sandbox/` | CPU/memory/wall-time limits enforcer |
| `immune/receipts/out/` | Generated JSON receipts (v2.1 schema) |
| `shrine/sources/` | Move contracts: zbt_core, zbt_guard, zbt_errors |
| `shrine/scripts/` | bootstrap.sh, submit_onchain_receipt.js, arweave_anchor.js, ots.sh, listen_receipts.js |
| `shared/schemas/` | receipt.v2.1.json (canonical) |
| `shared/config/` | authorized_elders.json, beacon.json (SPV), security_bounds.json |
| `ops/` | sabbath_checklist.md, cursors/ (event tracking) |
| `.github/workflows/` | patrol.yml (scheduled + manual runs) |

---

## Key Files

| File | Used By | Purpose |
|------|---------|---------|
| `.env.example` | All | Config: SUI_RPC_URL, PKG_ID, ARWEAVE_KEY, etc. |
| `shared/schemas/receipt.v2.1.json` | Validator | Receipt structure (mask, beat, beacon, severity, witness_sigs, ...) |
| `shared/config/authorized_elders.json` | Shrine | Elder pubkeys for multi-sig |
| `shared/config/beacon.json` | CI | SPV Bitcoin block reference (timestamp anchor) |
| `immune/sandbox/run_with_limits.py` | Patrol | Enforces CPU/memory budgets per veil |
| `shrine/scripts/bootstrap.sh` | Setup | Publishes Move pkg + initializes ledger/registry/witness-set |
| `shrine/scripts/submit_onchain_receipt.js` | Submit | Posts receipt JSON on-chain via TransactionBlock |
| `shared/utils/validate_receipt.js` | CI/QA | AJV schema validator |
| `ops/sabbath_checklist.md` | Weekly | Ritual: collect → filter → attest → patch → anchor → rotate → seal |

---

## Receipt Flow

```
Veil 1/4/6 (Python)
       ↓ JSON (v2.1 schema)
immune/receipts/out/*.json
       ↓ validate_receipt.js
       ✓ (or abort)
       ↓ arweave_anchor.js
Arweave TX ID
       ↓ ots.sh
OpenTimestamps proof (BTC-anchored)
       ↓ submit_onchain_receipt.js
Sui devnet: zbt::core::submit_receipt()
       ↓ event: ReceiptSubmitted
listen_receipts.js logs → ops/cursors/lastEventCursor.json
```

---

## On-Chain Objects (Sui Move)

After `make shrine-bootstrap`, you have:

| Object | ID Variable | Type | Purpose |
|--------|-------------|------|---------|
| Move Package | `PKG_ID` | Published package | Contains zbt::core, zbt::guard, zbt::errors |
| Receipt Ledger | `LEDGER_ID` | Key object | Stores all receipts in table; next_id counter |
| Witness Set | `WSET_ID` | Key object | Admin threshold, admins list, witness vector, pubkey table |
| Admin Nonces | `NONCES` | Key object | Prevents signature replay per admin |
| Witness Registry | `REG_ID` | Key object | Maps witness → WitnessStats ID |
| Witness Stats | `STATS_ID` | Shared object | Tracks last_submit + count_window for rate limiting |

---

## Veil Runtime Limits

| Veil | CPU (s) | Memory (MiB) | Wall (s) | Processes |
|------|---------|-------------|---------|-----------|
| **1** (Bones) | 30 | 256 | — | 1 |
| **4** (Codes) | 60 | 512 | — | 1 |
| **6** (Chaos) | 45 | 1024 | — | 10 |

Enforced by `immune/sandbox/run_with_limits.py`. All results BLAKE3-hashed for `run_commit` field.

---

## Error Codes (Move)

| Const | Code | Meaning |
|-------|------|---------|
| E_NOT_WITNESS | 9101 | Signer not in witness list |
| E_NOT_ADMIN | 9102 | Signer not admin; invalid approval |
| E_RATE_LIMIT | 9103 | Witness submitted >10 receipts in 600s window |
| E_HASH_MISMATCH | 9104 | Provided evidence hash ≠ stored hash |
| E_SIG_INVALID | 9105 | Signature verification failed |
| E_PENDING_EXPIRED | 9106 | >600s since receipt created (confirm_pending window expired) |
| E_PENDING_STATUS | 9107 | Receipt status ≠ 5 (PendingRateCheck) |
| E_NONCE_REUSED | 9108 | Admin nonce not incremented |
| E_PUBKEY_INVALID | 9109 | Admin pubkey ≠ 32 bytes |
| E_EVIDENCE_HASH_INVALID | 9110 | Evidence hash ≠ 32 bytes |

---

## Receipt Status Codes

| Code | Name | Transitions |
|------|------|-----------|
| **0** | New | Initial; witness submits |
| **1** | Verified | witness calls `attest_verified()` or `confirm_pending()` |
| **2** | Disputed | witness calls `mark_disputed()` |
| **3** | Fixed | submitter/admin calls `mark_fixed()` |
| **4** | AcceptedRisk | witness calls `accept_risk()` |
| **5** | PendingRateCheck | Internal; 600s window for rate check before finalization |

---

## GitHub Actions Patrol

**Trigger:** Nightly (00:00 UTC) or manual dispatch

**Steps:**
1. Checkout
2. Setup Node 20 + Python 3.11
3. `make deps` → npm i + pip install
4. `make patrol` → Run Veils 1/4/6 → produce `immune/receipts/out/*.json`
5. `validate_receipt.js` → Check all JSON against schema v2.1
6. `make anchor` → Arweave + OTS
7. **If manual dispatch:** `make submit` → on-chain

---

## Environment Variables

```bash
# Sui Devnet
SUI_RPC_URL=https://fullnode.devnet.sui.io:443
SUI_PRIVATE_KEY_B64=...
SUI_ACTIVE_ADDRESS=0x...

# On-Chain Objects (from bootstrap.sh)
PKG_ID=0x...
WSET_ID=0x...
LEDGER_ID=0x...
REG_ID=0x...
STATS_ID=0x...

# Anchoring
ARWEAVE_KEY=./secrets/arweave.json

# Ops Guardrails
ZB_ALLOW_STUBS=0          # Disallow mock receipts in CI
ZB_ALLOW_NO_BLAKE3=0      # Require BLAKE3 in run_commit
```

---

## Sabbath Seal (Weekly Checklist)

```markdown
1. Collect patrol receipts + listener logs
2. Filter by fingerprint; discard duplicates
3. Attest: Elder quorum calls
   - attest_verified() → status 1
   - mark_disputed() → status 2
   - accept_risk() → status 4
4. Patch: Land fixes; commit hash in receipt
5. Anchor: Arweave upload + OTS; save txid to CHANGELOG
6. Rotate: Backup cursors; rotate witness keys (if needed)
7. Seal: Publish weekly "Sabbath Seal" note
```

See `ops/sabbath_checklist.md` for full ritual.

---

## Validator Usage

```bash
# Single receipt
node shared/utils/validate_receipt.js immune/receipts/out/receipt.json

# All receipts
node shared/utils/validate_receipt.js immune/receipts/out/*.json

# Exit codes: 0 = all valid, 1 = any invalid
```

---

## Critical Guardrails

✅ **No stubs:** `ZB_ALLOW_STUBS=0` enforced in CI  
✅ **BLAKE3 required:** Pattern `blake3:[0-9a-f]{64}`  
✅ **Beacon SPV:** Must be valid Bitcoin block proof  
✅ **3+ signatures:** Witness sigs array length ≥ 3  
✅ **Resource limits:** CPU/memory per veil enforced by `run_with_limits.py`  
✅ **Clock ref:** Replace `0x6` with your Sui devnet Clock ID  

---

## Integration with osovm

1. **Clone/submodule** zangbeto repo
2. **Symlink Makefile targets** to osovm root (optional)
3. **Share Elder registry** via osovm config
4. **Link beacon.json** to osovm's SPV oracle
5. **Use shared validators** for receipt schema checks

---

## Glossary

| Term | Definition |
|------|-----------|
| **Mask** | Veil runtime (Veil 1, 4, 6) |
| **Beat** | Patrol cycle number |
| **Beacon** | Bitcoin block header (SPV proof for timestamp) |
| **Receipt** | JSON finding with evidence hash, severity, witness sigs |
| **Shrine** | On-chain ledger (Sui Move) |
| **Immune** | Off-chain ritual body (Python Veils) |
| **Sabbath** | Weekly review + attest + rotate + seal cycle |
| **Arweave Anchor** | Permanent storage of receipt JSON |
| **OTS Proof** | OpenTimestamps BTC timestamp proof |
| **Admin Nonce** | Replay-prevention counter per signer |

---

## Roadmap Items

- [ ] Seccomp/AppArmor containerization for masks
- [ ] Patrol credit pool (global budget) tracking
- [ ] veil_dashboard.py (real-time monitoring)
- [ ] VRF scheduler integration (replace seedrandom)
- [ ] Automated Elder key rotation
- [ ] Multi-chain Shrine (Aptos, Movement, etc.)

---

**Àṣẹ. Dance complete. Build, patrol, seal, repeat.**

🔥🌀🕯️
