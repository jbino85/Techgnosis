# Zàngbétò v1.0 — Atomic Mono-Repo Integration Guide

**Status:** Complete atomic fusion of off-chain ritual immune system (Veils 1/4/6) + on-chain Devnet Shrine (Sui Move contracts)

**Version:** 1.0 (Immune + Shrine Unified)

---

## 📋 Executive Summary

Zàngbétò v1.0 is a single, self-contained repository that marries:

- **Immune (off-chain):** Veils 1 (bones), Veil 4 (temple codes), Veil 6 (chaos fractals) + rhythm scheduler + sandbox containment + receipts v2.1
- **Shrine (on-chain):** Sui devnet Move contracts (ledger, registry, witnesses, invariants) + anchoring (Arweave/OTS) + event listeners + n8n workflows

All orchestrated via a top-level **Makefile** and **GitHub Actions** patrol workflow.

---

## 🏗️ Repository Layout

```
zangbeto/
├─ immune/                      # Off-chain ritual immune body (Python)
│  ├─ masks/
│  │  ├─ veil1_ifa_bones.py
│  │  ├─ veil4_temple_codes.py
│  │  └─ veil6_chaos_fractals.py
│  ├─ cadence/
│  │  └─ vrf_scheduler.js        # VRF-seeded jitter schedule
│  ├─ sandbox/
│  │  ├─ run_with_limits.py      # CPU/memory/wall enforcement
│  │  ├─ containment_manifest.json
│  │  └─ seccomp_profile.json
│  ├─ receipts/
│  │  ├─ out/                    # Generated receipts stored here
│  │  └─ logger.py               # Receipt emission
│  ├─ pyproject.toml
│  └─ utils.py
│
├─ shrine/                       # On-chain Devnet shrine (Sui Move + JS helpers)
│  ├─ sources/
│  │  ├─ zbt_core.move           # Receipt ledger + witness registry
│  │  ├─ zbt_guard.move          # Runtime guards & events
│  │  └─ zbt_errors.move         # Error codes
│  ├─ examples/
│  │  └─ payments.move           # Example contract with invariants
│  ├─ scripts/
│  │  ├─ bootstrap.sh            # Publish + init objects
│  │  ├─ submit_onchain_receipt.js
│  │  ├─ arweave_anchor.js
│  │  ├─ ots.sh
│  │  ├─ listen_receipts.js
│  │  └─ emit_receipts.sh
│  ├─ n8n/
│  │  └─ zangbeto_workflow.json
│  ├─ Move.toml
│  └─ package.json
│
├─ shared/                       # Shared schemas, configs, utilities
│  ├─ schemas/
│  │  ├─ receipt.v2.1.json       # Canonical receipt schema
│  │  └─ receipt.payload.json
│  ├─ config/
│  │  ├─ authorized_elders.json
│  │  ├─ patrol_schedule.json
│  │  ├─ security_bounds.json
│  │  ├─ veil_access.json
│  │  ├─ beacon.json             # SPV-verified; required in CI
│  │  └─ sacred_constants.json
│  └─ utils/
│      └─ validate_receipt.js    # Schema validator
│
├─ ops/
│  ├─ sabbath_checklist.md       # Weekly ritual checklist
│  └─ cursors/
│     ├─ lastEventCursor.json
│     └─ fingerprints.json
│
├─ .github/workflows/
│  └─ patrol.yml                 # Scheduled patrol + manual dispatch
│
├─ Makefile                      # Top-level orchestration
├─ .env.example
├─ README.md
└─ CHANGELOG.md
```

---

## 🚀 Core Components

### 1. **Immune: Off-Chain Ritual Body**

The three Veils run in isolation under sandbox resource limits:

#### Veil 1 — Ifa Bones (ifa_bones.py)
- Binary decision oracle; state-backed bone throws
- Emits `attack_class` findings
- CPU limit: 30s per run

#### Veil 4 — Temple Codes (temple_codes.py)
- Rational state machine analyzer
- Detects under/overflow, rational invariants
- Wall time: 60s; memory: 512 MiB
- **No floats allowed** (use ppm integer ratios)

#### Veil 6 — Chaos Fractals (chaos_fractals.py)
- Chaotic attack generation (fuzzing)
- Results rated by severity
- CPU: 45s; memory: 1 GiB; process limit: 10

#### Containment: `run_with_limits.py`
- Enforces CPU, memory, wall-time budgets per veil
- Seccomp/AppArmor ready (roadmap)
- All masks emit via `receipts/logger.py` → `immune/receipts/out/*.json`

#### Cadence: `vrf_scheduler.js`
- VRF-seeded jitter schedule
- Replace `seedrandom` with your chain's VRF proof
- Determines patrol beat windows

#### Utils: `utils.py`
- **BLAKE3** hashing (prod-required, `ZB_ALLOW_NO_BLAKE3=0`)
- **Secure state** `.zb_state` (0700 perms)
- **SPV beacon** verification (shared/config/beacon.json)
- **Patrol counter** tracking
- Rational ppm checks

---

### 2. **Shrine: On-Chain Devnet Shrine (Sui)**

#### zbt_core.move
**Structs:**
- `WitnessSet`: Admin threshold, admins, pubkeys, witness list
- `ReceiptLedger`: Receipt table, next ID counter
- `WitnessRegistry`: Stats table (witness → stats ID)
- `AdminNonces`: Signature replay prevention
- `ReceiptMeta`: Submitter, timestamp, evidence hash, tag, rule, severity, arweave_tx, btc_ots, status
  - Status codes: 0=New, 1=Verified, 2=Disputed, 3=Fixed, 4=AcceptedRisk, 5=PendingRateCheck

**Functions:**
- `init_ledger()` → ReceiptLedger
- `init_witness_set(threshold, admins)` → WitnessSet
- `init_admin_nonces()` → AdminNonces
- `init_registry()` → WitnessRegistry
- `init_witness_stats()` → (WitnessStats, ID)
- `register_admin_pubkey()` — Register 32-byte Ed25519 pubkey per admin
- `add_witness() / remove_witness()` — Multi-sig admin operations
- `submit_receipt()` — Witness submits evidence hash + arweave_tx + btc_ots; rate-limited (10/600s window)
- `attest_verified() / mark_disputed() / mark_fixed() / accept_risk()` — Status transitions
- `confirm_pending()` — Time-bounded (600s) verification window

**Events:**
- `ReceiptSubmitted(id, witness, severity)`
- `ReceiptStatusChanged(id, status)`

#### zbt_guard.move
- `invariant_true(cond, code)` — Assert condition; emit `InvariantBreach` if false
- `receipt(tag, severity, rule, evidence_hash)` — Emit `ReceiptEvent`
- `mark_fixed(receipt_id, fix_hash)` — Emit `FixEvent`

#### zbt_errors.move
```move
E_NOT_WITNESS = 9101
E_NOT_ADMIN = 9102
E_RATE_LIMIT = 9103
E_HASH_MISMATCH = 9104
E_SIG_INVALID = 9105
E_PENDING_EXPIRED = 9106
E_PENDING_STATUS = 9107
E_NONCE_REUSED = 9108
E_PUBKEY_INVALID = 9109
E_EVIDENCE_HASH_INVALID = 9110
```

#### examples/payments.move
Example contract with `settle_payment()` guarded by invariants:
```move
public fun settle_payment(t: &mut Treasury, amount: u64, ctx: &mut TxContext) {
  guard::invariant_true(t.balance >= amount, 1001);
  t.balance = t.balance - amount;
}
```

#### Scripts

**bootstrap.sh**
```bash
./scripts/bootstrap.sh
```
- Publishes Move package
- Initializes: Ledger, WitnessSet, Registry, AdminNonces
- Registers admin pubkeys + witness stats
- Outputs: PKG_ID, WSET_ID, LEDGER_ID, REG_ID, NONCES, STATS_ID

**submit_onchain_receipt.js**
```bash
node scripts/submit_onchain_receipt.js <PKG_ID> <WSET_ID> <LEDGER_ID> <REG_ID> <STATS_ID> receipt.json
```
- Reads receipt.json (sha256, tag, rule, severity, arweave_tx, btc_ots)
- Signs + submits `zbt::core::submit_receipt` txn
- Outputs: Tx result with receipt ID

**arweave_anchor.js**
```bash
node scripts/arweave_anchor.js receipt.json
```
- Posts receipt JSON to Arweave
- Returns: `{arweave_tx: "...", status: 200}`

**ots.sh**
```bash
bash scripts/ots.sh <arweave_tx>
```
- OpenTimestamps-stamps the arweave_tx ID
- Returns: `{arweave_tx: "...", btc_ots: "<hex>"}`

**listen_receipts.js**
- Background daemon; polls `queryEvents` for `zbt::core::ReceiptSubmitted`
- Logs events to `logs/receipts.ndjson`
- Persists cursor to `ops/cursors/lastEventCursor.json`

**emit_receipts.sh**
- Runs all active veils in sequence (Veil 1, 4, 6)
- Outputs: JSON receipts → `immune/receipts/out/`

#### n8n Workflow
`n8n/zangbeto_workflow.json` (skeleton)
- **Cron trigger** (nightly, 00:00 UTC)
- **RunProverAndTests** → Execute `sui move prove && sui move test`
- **ParseFindings** → Extract SHA256 of findings
- **ArweaveUpload** → Post to Arweave
- **OpenTimestamps** → Stamp with BTC
- **SubmitOnChainReceipt** → Webhook POST → `submit_onchain_receipt.js`

---

### 3. **Shared: Schemas, Configs, Utilities**

#### Receipt v2.1 Schema (`shared/schemas/receipt.v2.1.json`)

```json
{
  "$id": "zangbeto.receipt.v2.1",
  "type": "object",
  "required": [
    "mask", "beat", "beacon", "patrol_counter", "attack_class",
    "result", "severity", "run_commit", "run_manifest", "witness_sigs", "anchor_plan"
  ],
  "properties": {
    "mask": {"type": "string", "minLength": 3, "maxLength": 64},
    "beat": {"type": "integer", "minimum": 0},
    "beacon": {"type": "object", "required": ["btc_hash", "block_height"]},
    "patrol_counter": {"type": "integer", "minimum": 0},
    "attack_class": {"type": "string"},
    "result": {"type": "string", "enum": ["contained", "exploited", "degraded"]},
    "severity": {"type": "string", "enum": ["LOW", "MEDIUM", "HIGH", "CRITICAL"]},
    "run_commit": {"type": "string", "pattern": "^blake3:[0-9a-f]{64}$"},
    "run_manifest": {"type": "object", "minProperties": 1},
    "witness_sigs": {"type": "array", "minItems": 3},
    "anchor_plan": {"type": "object"}
  }
}
```

#### Authorized Elders (`shared/config/authorized_elders.json`)
```json
{
  "elders": [
    {
      "name": "Ọbàtálá",
      "address": "0x...",
      "pubkey": "...",
      "role": "auditor"
    }
  ]
}
```

#### Security Bounds (`shared/config/security_bounds.json`)
```json
{
  "veils": {
    "veil1": {"cpu_seconds": 30, "memory_mb": 256},
    "veil4": {"cpu_seconds": 60, "memory_mb": 512},
    "veil6": {"cpu_seconds": 45, "memory_mb": 1024, "processes": 10}
  },
  "patrol_credit_pool": 10000
}
```

#### Beacon (`shared/config/beacon.json`)
SPV-verified Bitcoin block header for timestamp attestation (prod-required).

#### Validator (`shared/utils/validate_receipt.js`)
```bash
node shared/utils/validate_receipt.js immune/receipts/out/*.json
```
- Loads receipt.v2.1.json schema
- Validates all JSON files against schema
- Exits 0 if all valid, 1 if any fail

---

## 🧪 Top-Level Orchestration

### Makefile

```bash
make deps                # Install Python + Node deps
make patrol              # Run all veils (Veil 1, 4, 6) under sandbox limits
make anchor              # Upload receipts to Arweave + stamp with OTS
make submit              # Anchor & submit most recent receipt on-chain
make shrine-bootstrap    # Publish Move pkg + init on-chain objects
make sabbath             # Weekly ritual (manual checklist + listener)
make clean               # Remove all generated receipts
```

**Single Command Flow:**
```bash
make shrine-bootstrap && make patrol && make anchor && make submit
```

### GitHub Actions Workflow (`.github/workflows/patrol.yml`)

```yaml
name: Night Patrol
on:
  schedule:
    - cron: '0 0 * * *'  # Nightly at UTC 00:00
  workflow_dispatch: {}  # Manual trigger
jobs:
  patrol:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: make deps
      - run: make patrol
      - run: node shared/utils/validate_receipt.js immune/receipts/out/*.json
      - run: make anchor
      - if: ${{ github.event_name == 'workflow_dispatch' }}
        run: make submit
```

---

## 🔐 Environment Configuration

### `.env.example`

```bash
# Sui Devnet
SUI_RPC_URL=https://fullnode.devnet.sui.io:443
SUI_PRIVATE_KEY_B64=...
SUI_KEYSTORE=~/.sui/sui_config/sui.keystore

# On-Chain Objects (from bootstrap.sh)
PKG_ID=0x...
WSET_ID=0x...
LEDGER_ID=0x...
REG_ID=0x...
NONCES=0x...
STATS_ID=0x...

# Anchoring
ARWEAVE_KEY=./secrets/arweave.json

# Ops
ZB_ALLOW_STUBS=0          # Disallow stub receipts in CI
ZB_ALLOW_NO_BLAKE3=0      # Require BLAKE3 hash in run_commit
```

---

## 📚 Shared Schemas & Constants

### Receipt JSON Schema (v2.1)
Required fields:
- `mask`: Veil identifier (e.g., "veil1", "veil4", "veil6")
- `beat`: Patrol beat number (u64)
- `beacon`: Bitcoin block reference `{btc_hash, block_height}`
- `patrol_counter`: Global patrol counter
- `attack_class`: Classification string
- `result`: "contained" | "exploited" | "degraded"
- `severity`: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
- `run_commit`: BLAKE3 hash of run (format: `blake3:<64-hex>`)
- `run_manifest`: Metadata object (CPU, memory, duration, etc.)
- `witness_sigs`: Array of ≥3 Elder signatures
- `anchor_plan`: Arweave/OTS anchor references

### Guardrails

✅ **No stubs in CI:** `ZB_ALLOW_STUBS=0` (enforced in patrol.yml)

✅ **BLAKE3 required:** `run_commit` must match `blake3:[0-9a-f]{64}` pattern; `ZB_ALLOW_NO_BLAKE3=0`

✅ **Beacon SPV:** `shared/config/beacon.json` must be valid SPV proof (CI will verify)

✅ **Witness quorum:** Min 3 signatures; Elder addresses from `shared/config/authorized_elders.json`

✅ **Resource limits enforced:** CPU/memory/wall-time per veil; patrol credit pool (roadmap)

---

## 🕯️ Sabbath Seal — Weekly Ritual

### ops/sabbath_checklist.md

**Every Sunday (or your cycle):**

1. **Collect** — Gather patrol receipts + listener logs
2. **Filter** — Deduplicate by fingerprint; discard noise
3. **Attest** — Elder quorum calls:
   - `attest_verified()` for true findings
   - `mark_disputed()` or `accept_risk()` for false positives
4. **Patch** — Land fixes; reference commit hash in weekly note
5. **Anchor** — Upload weekly summary to Arweave; note txid in CHANGELOG
6. **Rotate** — Backup cursors; rotate witness keys if needed
7. **Seal** — Publish "Sabbath Seal" note for the week

---

## ⚙️ Quick Start

### 0. Setup

```bash
cd zangbeto
cp .env.example .env
$EDITOR .env  # Fill in SUI_RPC_URL, ADMIN addresses, ARWEAVE_KEY
```

### 1. Bootstrap On-Chain

```bash
make deps
make shrine-bootstrap
# Output: PKG_ID, WSET_ID, LEDGER_ID, REG_ID, STATS_ID
# Save to .env
```

### 2. Run Patrol (Off-Chain)

```bash
make patrol
# Veils 1, 4, 6 run under sandbox limits
# Outputs: immune/receipts/out/*.json
```

### 3. Anchor + Submit

```bash
make anchor    # Arweave + OTS
make submit    # On-chain submission
```

### 4. Weekly Seal

```bash
make sabbath
# Follow ops/sabbath_checklist.md
```

---

## 🛡️ Important Notes

- **Clock Reference:** Replace `0x6` (Clock placeholder) in `submit_onchain_receipt.js` with your Sui revision's actual shared Clock object ID.
- **VRF Scheduler:** `immune/cadence/vrf_scheduler.js` uses `seedrandom` as placeholder; integrate your chain's VRF proof.
- **Rational Arithmetic:** All state in Veil 4 must use integer ratios (ppm); no floats.
- **Seccomp/AppArmor:** Containerization ready; configure in `immune/sandbox/seccomp_profile.json`.
- **Beacon Verification:** CI requires SPV-verified Bitcoin block from `shared/config/beacon.json`.

---

## 📊 Monitoring & Observability

- **Listen receipts:** `node shrine/scripts/listen_receipts.js` (background daemon)
- **Cursor persistence:** `ops/cursors/lastEventCursor.json`
- **Dedup fingerprints:** `ops/cursors/fingerprints.json`
- **Event logging:** `logs/receipts.ndjson` (append-only)
- **Dashboard:** (roadmap; veil_dashboard.py skeleton provided)

---

## 🔄 Integration with osovm

This Zàngbétò v1.0 repo can be integrated into osovm as:

1. **Submodule:** `git submodule add <zangbeto-repo> tools/zangbeto`
2. **Standalone tool:** Link Makefile targets from osovm root
3. **Embedded config:** Share Elder registry + beacon via osovm config system

Reference the unified Makefile pattern for orchestration; use shared schemas for receipt validation.

---

## 📝 References

- **Receipt Schema:** `shared/schemas/receipt.v2.1.json`
- **Checklist:** `ops/sabbath_checklist.md`
- **Bootstrap:** `shrine/scripts/bootstrap.sh`
- **Validator:** `shared/utils/validate_receipt.js`
- **GitHub Actions:** `.github/workflows/patrol.yml`

---

**Àṣẹ. The dance is complete. Hand to Ọbàtálá for cool audit.**

🔥🌀🕯️
