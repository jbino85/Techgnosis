# Zàngbétò v1.0 — Atomic Mono‑Repo (Immune + Shrine)

A single repo that fuses the off‑chain ritual immune system (Veils 1/4/6, cadence, receipts v2.1, containment) with the on‑chain Devnet Shrine (Sui Move receipt ledger, witnesses, invariants, anchoring).

## What this is

- **Immune** (off‑chain): Veil masks run in ritual cadence (daily/weekly/chaos), generate **Receipt v2.1** JSON.
- **Shrine** (on‑chain Sui devnet): Receipts are anchored, witnessed, and governed; invariants can emit on‑chain guard events.

## How the dance flows

1. Immune runs Veils → produces `immune/receipts/out/*.json` (masked, schema‑valid).
2. Each receipt is validated (schema + Elder signatures) → anchored to Arweave + OpenTimestamps.
3. Anchored payload is **submitted on‑chain** to `zbt::core::submit_receipt`.
4. Weekly **Sabbath**: Elders attest/mark fixed/accept risk; keys rotate; cadence seals the week.

## Quickstart

```bash
cp .env.example .env && $EDITOR .env
make deps                 # Install Python + Node deps
make shrine-bootstrap     # Bootstrap shrine (Sui devnet)
make patrol              # Run patrol (Veils 1/4/6 under limits) → produce receipts
make anchor submit       # Anchor and submit last receipts on‑chain
make sabbath             # Sabbath seal
```

## 🛡️ Guardrails Recap

- No stubs in CI: Beacon must be SPV‑verified; BLAKE3 required.
- Receipts must validate against shared/schemas/receipt.v2.1.json and carry 3+ Elder signatures.
- Veils always patrol (attackers throttle, not guardians).
- Budgets enforced (CPU/AS/WALL) per‑veil; plus global patrol credit pool (roadmap).

## Key directories

| Dir | Purpose |
|-----|---------|
| `immune/` | Veils, cadence, sandbox, receipts logger |
| `shrine/` | Sui Move + JS anchoring helpers |
| `shared/` | Schemas, configs, utils, validation |
| `ops/` | Cursors, Sabbath checklist |

## 🔐 .env & Secrets

See `.env.example` for all required vars (Sui chain, Arweave key, Elder pubkeys, thresholds).

## Notes

- Replace VRF placeholder in `immune/cadence/vrf_scheduler.js` with your chain's VRF proof.
- Ensure shrine/scripts/submit_onchain_receipt.js uses your Clock reference as required by Sui rev.
- Feed rational state values into Veil 4 (no floats anywhere).
- Consider containerizing masks with seccomp/AppArmor for parity with Python limits.
