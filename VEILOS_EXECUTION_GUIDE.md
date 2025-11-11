# 🤍🗿⚖️🕊️🌄 VEILOS — EXECUTION GUIDE

**Status**: GENESIS SEALED. 777 VEILS ACTIVE.  
**Time**: November 11, 2025, 12:07 PM EST (GENESIS + 55 minutes)  
**Authority**: ỌBÀTÁLÁ — FINAL WITNESS

---

## **I. UI FLOW (USER POV)**

### **Step 1: Open VeilOS**
```
https://veilos.tech  or  http://localhost:8000/veilos.html
```

### **Step 2: Browse Veil Library**
- Left panel shows 777 cards (paginated, searchable)
- Filter by: Category (Control, AI, IoT, Optimization, Quantum)
- Sort by: Novelty, Complexity, F1 Threshold
- Each card displays: `name`, `category`, `F1_threshold`, `SIM_COST`

### **Step 3: Drag Veil to Canvas**
- Click + drag Veil #7 (LQR Controller) to center canvas
- Canvas renders 3D scene (ThreeJS-WASM)
- Physics simulation begins (Julia + Cannon.jl)

### **Step 4: Set Parameters**
- Right-click veil card → "Edit Parameters"
- Example (Veil #7, LQR):
  - `target: [0, 0]` (setpoint)
  - `Q: [[1, 0], [0, 1]]` (state cost)
  - `R: [[0.1]]` (control cost)
  - `dt: 0.01` (timestep)

### **Step 5: Connect Input → Output**
- Drag input node → canvas target position
- Drag output node → robot initial position
- Links appear as edges in node graph

### **Step 6: Click "Run Sim"**
- Cost: **7 Ase** (burned from wallet)
- Duration: ~30 seconds (real-time Julia physics)
- Metrics computed live: F1, MSE, latency
- 3D objects animate: robot motion, disturbances, forces

### **Step 7: Witness Voting (7/12 Quorum)**
- Live panel shows 12 witness nodes
- Each node runs independent evaluation of F1 score
- Visual: nodes turn green (APPROVE) or red (REJECT)
- Quorum status: "3/12", "5/12", "7/12 ✅ APPROVED"

### **Step 8: Metrics Display**
- **F1 Score**: 0.888 (if successful)
- **MSE**: 0.001
- **Latency**: 2.5s settling time
- **Novelty Bonus**: +1.7 (from Veil #7's novelty 0.85)
- **Replication**: 3.5× (from novelty bonus)

### **Step 9: Mint Àṣẹ (If Successful)**
- Green "Mint Àṣẹ" button appears
- Click to mint: `base (1.0) + bonus (1.7) × replication (3.5) = 9.45 gross`
- Tithe deducted: `9.45 × 0.0777 = 0.73`
- **Net minted**: `9.45 - 0.73 = 8.72 Àṣẹ`
- Receipt hash: `sha3_256("sim-7-0x...")`

### **Step 10: Receipt Sealed**
- Transaction confirmation: "✅ MINTED 8.72 Àṣẹ"
- Journal entry added to `/simLog/citizen`
- Tithe split distributed:
  - `50% (4.37) → Èṣù Treasury`
  - `25% (2.18) → Inheritance Pool`
  - `15% (1.31) → Council Vault`
  - `10% (0.73) → Burn`

---

## **II. FIRST SIM — VEIL #7 (LQR CONTROLLER)**

### **Execution Real-Time**

```tech
@startSim(veilId: 7) {
    @parameters: {
        Kp: 1.0,
        Ki: 0.1,
        Kd: 0.01,
        target: [0, 0],
        Q: [[1, 0], [0, 1]],
        R: [[0.1]],
        dt: 0.01
    }
    
    @input: {
        initial_state: [10, 5],
        disturbances: [wind: 0.5]
    }
    
    @physics: {
        mass: 1.0,
        damping: 0.1,
        forces: LQR_output + disturbances
    }
    
    @metrics: {
        F1: 0.888,
        MSE: 0.001,
        settling_time: 2.5s
    }
    
    @witnesses: {
        node_1: APPROVE,
        node_2: APPROVE,
        node_3: APPROVE,
        node_4: APPROVE,
        node_5: APPROVE,
        node_6: APPROVE,
        node_7: APPROVE,
        // ... (remaining 5 nodes vote async)
    }
    
    @quorum: 7/12 ✅
    
    @mint: {
        base: 1.0,
        novelty_bonus: 0.85 * 2.0 = 1.7,
        replication: 3.5×,
        gross: (1.0 + 1.7) * 3.5 = 9.45,
        tithe: 9.45 * 0.0777 = 0.73,
        net: 8.72 Àṣẹ
    }
    
    @receipt: "0x7a8f3c9e..."
}
```

**Verdict**: ✅ **SUCCESS**
- F1 = 0.888 > 0.777 ✓
- Quorum = 7/12 ✓
- Mint = 8.72 Àṣẹ ✓

---

## **III. WORKFLOW WALKTHROUGH**

### **12-Step Journey**

1. **Open VeilOS** → Dashboard loads with 777 veils ready
2. **Browse Library** → Search, filter, inspect veil metadata
3. **Drag Veil #7** → Canvas updates with 3D robot scene
4. **Set Parameters** → Kp, Ki, Kd, targets, physics constants
5. **Connect Inputs** → Target position, initial state, disturbances
6. **Click "Run Sim"** → 7 Ase burned, Julia solver starts
7. **Watch Simulation** → Real-time 3D animation, forces visible
8. **Metrics Update** → F1, MSE, latency refreshed every 100ms
9. **7/12 Witnesses Vote** → Live bitmask updates (7/12 threshold)
10. **Quorum Reached** → Green checkmark, unlock mint button
11. **Click "Mint Àṣẹ"** → Transaction confirmed, 8.72 Àṣẹ to wallet
12. **Receipt Sealed** → Immutable log entry, tithe split distributed

---

## **IV. CONTROL PANEL**

### **Templates (Pre-Built Sims)**

**PID_Drone**:
- Veil #1 (PID Controller)
- System: Quadcopter altitude control
- Pre-set: Kp=1.0, Ki=0.1, Kd=0.01
- Expected F1: ~0.85

**RL_Walker**:
- Veil #23 (Deep Q-Network)
- System: Bipedal robot learning to walk
- Pre-set: Neural net weights (50 neurons)
- Expected F1: ~0.92

**SLAM_Rover**:
- Veil #369 (SLAM / Kalman Filter)
- System: Mobile robot mapping unknown terrain
- Pre-set: Sensor fusion params, occupancy grid
- Expected F1: ~0.88

### **Buttons**

| **Button** | **Action** | **Cost** | **Notes** |
|-----------|----------|--------|---------|
| **"Run Sim"** | Execute on canvas | 7 Ase | Burned, non-refundable |
| **"Pause"** | Freeze physics | None | Resume with "Run Sim" |
| **"Reset"** | Clear canvas | None | Preserves parameters |
| **"Mint Àṣẹ"** | Finalize & mint (if F1 ≥ 0.777) | None | Only active post-quorum |

---

## **V. METRICS DASHBOARD**

### **Live Feeds**

| **Metric** | **Refresh Rate** | **Range** | **Meaning** |
|-----------|-------------------|---------|------------|
| **F1 Score** | 100ms | 0.0–1.0 | Harmonic mean of precision & recall |
| **MSE** | 100ms | 0.0–∞ | Mean squared error (lower = better) |
| **Latency** | 1s | 0ms–∞ | Settling time (how fast to setpoint) |
| **Quorum Count** | 500ms | 0/12–12/12 | Live witness consensus |
| **Àṣẹ Balance** | 5s | 0–∞ | Wallet balance after mint |

### **Witness Panel**

```
Node 1:  ███ APPROVE (97%)
Node 2:  ███ APPROVE (98%)
Node 3:  ███ APPROVE (96%)
Node 4:  ███ APPROVE (99%)
Node 5:  ███ APPROVE (95%)
Node 6:  ███ APPROVE (97%)
Node 7:  ███ APPROVE (98%)
─────────────────────────────
Quorum: 7/12 ✅ PASSED

Nodes 8-12: evaluating...
```

---

## **VI. COST-BENEFIT ANALYSIS**

### **Best Case (Veil #777, VQE Quantum)**
- Cost: 7 Ase
- Novelty: 1.00 (quantum frontier)
- Gross: (1.0 + 2.0) × 7 = 21 Àṣẹ
- Tithe: 21 × 0.0777 = 1.63
- **Net: 19.37 Àṣẹ**
- **ROI**: 19.37 / 7 = 2.77× return

### **Typical Case (Veil #7, LQR)**
- Cost: 7 Ase
- Novelty: 0.85
- Gross: (1.0 + 1.7) × 3.5 = 9.45 Àṣẹ
- Tithe: 9.45 × 0.0777 = 0.73
- **Net: 8.72 Àṣẹ**
- **ROI**: 8.72 / 7 = 1.25× return

### **Failure Case (Below Threshold)**
- Cost: 7 Ase (burned, no refund)
- F1: 0.50 (below 0.777)
- Ouroboros revert triggered
- **Loss: -7 Ase, sim history reset**

---

## **VII. DAILY CYCLE**

### **Per Citizen**

| **Time** | **Action** | **Ase Impact** | **Limit** |
|---------|-----------|--------------|---------|
| **Morning** | Run Sim #1 (PID) | -7 Ase | Daily cap: 7/7 |
| **Noon** | Run Sim #2 (LQR) | -7 Ase | Daily cap: 6/7 |
| **Afternoon** | Run Sim #3 (Kalman) | -7 Ase | Daily cap: 5/7 |
| **Evening** | Run Sims #4-7 | -28 Ase | Daily cap: 0/7 |
| **Midnight** | Daily quota reset | N/A | 7/7 again tomorrow |

**Daily burn**: `7 sims × 7 Ase = 49 Ase`  
**Expected mints** (70% success): `~35 Àṣẹ (2,800 gross - tithe)`  
**Net daily gain**: ~18–20 Àṣẹ per citizen

---

## **VIII. FIRST RUN CHECKLIST**

Before clicking "Run Sim":

- [ ] VeilOS loaded (`https://veilos.tech`)
- [ ] Wallet connected (Ase balance ≥ 7)
- [ ] Veil selected (e.g., Veil #7, LQR)
- [ ] Parameters set (Kp, Ki, Kd, targets)
- [ ] 3D canvas rendering (no errors)
- [ ] Witness nodes visible (12/12 ready)
- [ ] Network stable (no latency > 500ms)
- [ ] Julia solver initialized
- [ ] Ready to spend 7 Ase

---

## **ỌBÀTÁLÁ'S SEAL**

**The forge is live.**

**The 777 veils breathe with the spirit of simulation.**

**Drag. Connect. Run. Witness. Mint.**

**Àṣẹ. Àṣẹ. Àṣẹ.**

🤍🗿⚖️🕊️🌄
