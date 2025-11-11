# ỌBÀTÁLÁ GENESIS v8 — LAUNCH GUIDE

## ⏳ GENESIS TIMESTAMP
**November 11, 2025 at 11:11:11.11 UTC**

---

## PART 1: PREFLIGHT PREPARATION (Before 10:11 UTC)

### Step 1: Start the Dashboard Server
```bash
cd /data/data/com.termux/files/home/osovm
python3 -m http.server 8000
```
**Output:** `Serving HTTP on 0.0.0.0 port 8000`  
**Access:** http://localhost:8000/dashboard/

### Step 2: Complete Preflight Checklist via Dashboard

Navigate to **✓ PREFLIGHT CHECKLIST** section and verify:

- [ ] World ID verified (world.id/bino.1111)
- [ ] Audio recording ready (genesis_whisper.wav)
- [ ] Whisper-cpp installed and tested
- [ ] Julia runtime configured
- [ ] Bitcoin wallet funded for OP_RETURN
- [ ] Arweave wallet funded
- [ ] Ethereum contract deployed (0xAseGenesis)
- [ ] Sui wallet connected (Phantom)
- [ ] Device synchronized (Samsung Galaxy Z Fold V7)
- [ ] Breath practice complete
- [ ] BIPON39 mnemonic generated and secured
- [ ] All .tech files validated

### Step 3: Execute Dashboard Workflow Steps 1-5

1. **Run Preflight Checks** (Button: "Run Preflight")
   - System validates checklist items
   - Must achieve ≥80% completion
   - Log entry: `✓ Preflight: X/12 checks passed`

2. **Generate BIPON39 Mnemonic** (Button: "Generate")
   - Mode: 2048-word extended
   - Entropy: 128-256 bits
   - Output: Seed, Odù, elemental signature
   - **SAVE SECURELY** (download or write down)

3. **Fund Anchor Chains** (Button: "Fund All")
   - Bitcoin: ~$50 (OP_RETURN capacity)
   - Arweave: ~$10 (permanent storage)
   - Ethereum: ~$100 (contract deployment)
   - Sui: ~$20 (Move object creation)
   - Log: `✓ All chains funded (Step 3/6)`

4. **Record Genesis Audio** (Button: "Record")
   - Captures your breath + whisper
   - Required phrase: "Èmi ni Bínò ÈL Guà Ọmọ Kọ́dà Àṣẹ"
   - File saved as: genesis_whisper.wav
   - Log: `✓ Audio recorded (Step 4/6)`

5. **Wait for Genesis Time** (Automatic)
   - Countdown timer shows time remaining
   - At 1 hour: Border pulses orange
   - At 1 minute: Border pulses gold
   - Button "Execute Genesis" becomes enabled at T-5s
   - Status: `⚡ IMMINENT`

---

## PART 2: GENESIS EXECUTION (11:11:11.11 UTC ± 5 seconds)

### Step 6: Execute Genesis Sequence

**Click Button:** "EXECUTE GENESIS" (Step 6/6)

**Automatic Sequence (in order):**

1. **Precision Timing Check**
   - System verifies time is within ±50ms of target
   - Drift logged: `✅ Genesis timestamp: ... (drift: Xms)`
   - If outside window: `⏱️ Not yet genesis time. Please wait...`

2. **Audio Verification**
   - Loads: genesis_whisper.wav
   - Verifies transcription via whisper-cpp
   - Validates breath strength > 0.7
   - Log: `✅ Whisper verified`

3. **World ID Verification**
   - Reads: world_id_proof.json
   - Validates action: "genesis_1440"
   - Log: `✅ World ID verified: world.id/bino.1111`

4. **Receipt Generation**
   - Combines: Whisper + World ID + Timestamp
   - Generates SHA3-256 hash
   - Log: `📜 Receipt hash: [64-char hex]`

5. **Token Minting**
   - **Perfect Wallet (#0001):** 1440 Àṣẹ (no flaw)
   - **Flawed Wallets (#0002–#1440):** 1 Ase each (with Ase flaw)
   - Total Supply: 2880 tokens
   - Log: `✅ 1440 flawed wallets created`

6. **Chain Anchoring** (Parallel)
   - **Bitcoin OP_RETURN:** "0xAse1440"
   - **Arweave TX:** "genesis_1440"
   - **Ethereum Contract:** "0xAseGenesis"
   - **Sui Object:** "ase_1440"
   - Status updates: Pending → Confirming → Confirmed
   - Log entries: `⚓ Anchoring to [chain]...` → `✓ [chain] anchor confirmed`

7. **Genesis Seal**
   - Emits GenesisSealed event
   - Records all metadata to blockchain
   - Status: `✓ GENESIS EXECUTED`
   - Log: `✅ GENESIS COMPLETE - Àṣẹ. Àṣẹ. Àṣẹ.`

---

## REQUIRED FILES & DEPENDENCIES

### Pre-Generated Files (Must Exist)
```
/data/data/com.termux/files/home/osovm/
├── genesis_handshake_v8.tech          ✓ (Protocol definition)
├── whisper_ase_v8.jl                  ✓ (Runtime executor)
├── genesis_whisper.wav                  ⏳ (Generated at Step 4)
├── world_id_proof.json                  ⏳ (From world.id verification)
├── dashboard/
│   ├── index.html                     ✓ (Dashboard UI)
│   ├── app.js                         ✓ (Event handlers & logic)
│   └── style.css                      ✓ (Styling)
```

### System Dependencies
- **Julia 1.8+** (for whisper_ase_v8.jl execution)
- **Python 3.6+** (for HTTP server)
- **whisper-cpp** (for audio transcription)
- **Web browser** (Chrome, Firefox, Edge recommended)
- **Phantom Wallet extension** (for Sui integration)

### Julia Packages Required
```julia
using Dates          # Timing
using HTTP           # Chain communication
using JSON3          # Proof parsing
using SHA            # Receipt hashing
using LibSndFile     # Audio loading
```

Install via:
```bash
julia -e 'using Pkg; Pkg.add(["Dates", "HTTP", "JSON3", "SHA", "LibSndFile"])'
```

---

## MANUAL EXECUTION (Alternative to Dashboard)

### Option A: Execute via Julia
```bash
cd /data/data/com.termux/files/home/osovm
julia whisper_ase_v8.jl
```

**Requirements:**
- genesis_whisper.wav in current directory
- world_id_proof.json in current directory
- All Julia dependencies installed
- Execution at correct time (script waits)

### Option B: Execute via .tech Compiler
```bash
cd /data/data/com.termux/files/home/osovm
techgnos_compiler genesis_handshake_v8.tech --execute --timestamp="2025-11-11T11:11:11.11Z"
```

**Note:** Requires techgnos compiler (from src/techgnos_compiler.jl)

---

## MONITORING & LOGS

### Dashboard Logs
- Location: **📊 SYSTEM LOGS** section
- Auto-scrolls when "Auto-scroll" is checked
- Color coding:
  - 🟢 Green: Info messages
  - 🟠 Orange: Warnings
  - 🔴 Red: Errors
- Export: Click **Export Logs** button

### Julia Script Output
```
✅ Genesis timestamp: 2025-11-11T11:11:11.110Z (drift: Xms)
✅ Whisper verified: 'Èmi ni Bínò ÈL Guà Ọmọ Kọ́dà Àṣẹ'
✅ Breath strength: X.XX
✅ World ID verified: world.id/bino.1111
📜 Receipt hash: [64-char hex]
✅ Minting 1440 Àṣẹ to wallet #0001 (perfect)
✅ 1440 flawed wallets created
⚓ Anchoring to Bitcoin: 0xAse1440
⚓ Anchoring to Arweave: genesis_1440
⚓ Anchoring to Ethereum: 0xAseGenesis
⚓ Anchoring to Sui: ase_1440
================================================
GENESIS v8 — FLAW IN 1440
================================================
Wallet #0001: 1440 Àṣẹ (perfect)
Wallets #0002–#1440: 1 Ase each (flawed)
Total: 2880 tokens
Receipt: [hash]
================================================
Àṣẹ. Àṣẹ. Àṣẹ.
================================================
```

---

## TROUBLESHOOTING

### Issue: Phantom Wallet Not Connecting
- **Solution:** Install Phantom wallet extension from https://phantom.app
- **Verify:** Should appear in browser extension menu
- **Test:** Click "Connect Phantom Wallet" button

### Issue: Audio Recording Fails
- **Solution:** Grant browser permission for microphone
- **Check:** Browser settings > Site permissions > Microphone
- **Test:** Click "Test Audio Setup" first

### Issue: Countdown Timer Not Working
- **Solution:** Check system time synchronization
- **Command:** `date` (should be within 1 second of UTC)
- **Fix:** `ntpdate pool.ntp.org` (if available)

### Issue: Julia Script Errors
- **Check Package:** `julia -e 'using LibSndFile'`
- **Reinstall:** `julia -e 'using Pkg; Pkg.add("LibSndFile")'`
- **Verify File:** `genesis_whisper.wav` exists and is valid WAV format

### Issue: world_id_proof.json Missing
- **Solution:** Complete World ID verification first
- **URL:** https://world.id/bino.1111
- **Action ID:** genesis_1440
- **Output:** Save proof JSON to current directory

---

## FINAL CHECKLIST (T-1 Hour)

- [ ] Dashboard running on http://localhost:8000/dashboard/
- [ ] All preflight checklist items checked (≥80%)
- [ ] BIPON39 mnemonic generated and saved
- [ ] All chains funded (Bitcoin, Arweave, Ethereum, Sui)
- [ ] genesis_whisper.wav recorded with correct phrase
- [ ] world_id_proof.json file present
- [ ] Julia runtime ready (tested with `julia --version`)
- [ ] System time synchronized to UTC
- [ ] Phantom wallet connected (if using Sui)
- [ ] Device fully charged
- [ ] Network connection stable

---

## EXECUTION COMMAND SUMMARY

### Sequential Startup (10:00 UTC - 11:11 UTC)

```bash
# Terminal 1: Start Dashboard
cd /data/data/com.termux/files/home/osovm
python3 -m http.server 8000

# Terminal 2: Monitor (optional)
watch -n 1 'date +%H:%M:%S'

# Terminal 3: Julia Runtime (ready for 11:11:11 UTC)
cd /data/data/com.termux/files/home/osovm
julia -i whisper_ase_v8.jl
```

### At 11:11:11.11 UTC

**Primary Method (Recommended):**
1. Open http://localhost:8000/dashboard/ in browser
2. Verify all workflow steps 1-5 complete
3. Click **"EXECUTE GENESIS"** button
4. Monitor logs for `✅ GENESIS COMPLETE`

**Backup Method:**
```bash
cd /data/data/com.termux/files/home/osovm
julia whisper_ase_v8.jl
```

---

## POST-GENESIS

### Verification

Check blockchain anchors:
```bash
# Bitcoin OP_RETURN verification
bitcoin-cli getrawtransaction [txid] 1 | grep OP_RETURN

# Arweave TX lookup
curl https://arweave.net/tx/genesis_1440

# Ethereum contract event
etherscan.io/address/0xAseGenesis#events

# Sui object query
sui client object ase_1440
```

### Token Distribution

- **Perfect (Àṣẹ):** 1440 in wallet #0001
- **Flawed (Ase):** 1 each in wallets #0002–#1440
- **Total Supply:** 2880
- **Redemption:** 7x7 Pilgrimage (49-day cycle starting 11/11/2025)

---

## THREAD REFERENCE
**T-0147eaad-f804-488c-aae1-c4743e504919**

---

## 🤍🗿⚖️🕊️🌄
**Àṣẹ. Àṣẹ. Àṣẹ.**
