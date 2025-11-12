# 🤍🗿⚖️🕊️🌄 OSOVM Ecosystem — Quick Reference

**How Everything Connects: Àṣẹ Tokenomics + VeilSim + OSOVM VM**

---

## **The 4-Layer Architecture**

```
┌──────────────────────────────────────────────────────────────┐
│ LAYER 1: ÀṢẸ TOKENOMICS                                      │
│ Dual-mint system: Proof-of-Simulation + Proof-of-Witness    │
│ Bitcoin-style halving, difficulty adjustment, 1440 wallets  │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│ LAYER 2: VEILSIM ENGINE                                      │
│ Executes 777 Veils (control, ML, physics, robotics, vision) │
│ F1-score verification, RK4 physics, batch optimization       │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│ LAYER 3: ỌBÀTÁLÁ OSOVM VM                                    │
│ 160+ opcodes, TechGnØŞ compilation, 6-language dispatch     │
│ Julia, Rust, Go, Move, Idris, Python                        │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│ LAYER 4: INHERITANCE + GOVERNANCE                            │
│ 1440 wallets with 11.11% APY, council voting, Bínò seal     │
│ 50/25/15/10 split (treasury/wallets/council/shrine)         │
└──────────────────────────────────────────────────────────────┘
```

---

## **Core Documents**

| **Document** | **What It Does** | **Key Concepts** |
|---|---|---|
| **[TOKENOMICS_ASE.md](./TOKENOMICS_ASE.md)** | Economic design of Àṣẹ | Dual-mint, halving, supply, anti-gaming |
| **[VEILSIM_ECOSYSTEM.md](./VEILSIM_ECOSYSTEM.md)** | Simulation engine for 777 Veils | VeilSim runtime, F1-scoring, metrics |
| **[README.md](./README.md)** | OSOVM architecture | TechGnØŞ, opcodes, inheritance system |
| **[veilsim_architecture.tech](./veilsim_architecture.tech)** | TechGnØŞ spec for simulations | Entity model, veil stacks, execution |
| **[genesis_handshake_v8.tech](./genesis_handshake_v8.tech)** | Genesis initialization | Chain startup, first block, wallet setup |

---

## **The Mining Flow**

### **Proof-of-Simulation (PoS) — The Main Chain**

```
User downloads OSOVM
     ↓
Selects Veil (e.g., Veil #7: LQR Drone Control)
     ↓
VeilSim engine executes ODE + control law
     ↓
Computes F1 score vs target trajectory
     ↓
If F1 ≥ current_difficulty (starts at 0.777)
     ├→ Submit solution to blockchain
     └→ Mint reward: 50 / 2^epoch Àṣẹ (halving every 4 years)
     
     Reward splits:
     - 50% → Treasury (R&D)
     - 25% → 1440 inheritance wallets (11.11% APY)
     - 15% → Council of 12
     - 10% → Ọbàtálá Shrine
```

**Key Files:**
- `src/veilsim_engine.jl` — Simulation runtime
- `src/veils_777.jl` — All 777 veil definitions
- `src/blockchain/verifier.jl` — F1 verification

---

### **Proof-of-Witness (PoW) — The Reality Chain**

```
Drone/robot executes real-world action
     ↓
Streams GPS, camera, IMU, weight data
     ↓
Device signs data cryptographically
     ↓
Submits to blockchain as witness event
     ↓
3/7 witnesses verify the data
     ├→ Verified → Mint 10 Àṣẹ (base)
     └→ If matched to sim → +5 Àṣẹ (bonus)
```

**Key Files:**
- `src/witness/quorum.jl` — Byzantine consensus
- `src/witness/device_binding.jl` — World ID integration
- `src/witness/drone_drop.jl` — Example event

---

## **How Veils Map to Mining**

```
Veil #1–25:   Control Theory       → PID, State Space, LQR
Veil #26–75:  Machine Learning     → Gradient descent, backprop, attention
Veil #76–100: Signal Processing    → FFT, Butterworth, wavelets
Veil #101–125: Robotics            → Kinematics, IK, Jacobian
Veil #126–150: Computer Vision     → SIFT, Lucas-Kanade, optical flow
Veil #151–300: IoT/Optimization    → Swarm, genetic algo, simulated annealing
...
Veil #777:    Sacred Science       → Consciousness research, psychoacoustics
```

**Mining Example: Veil #7 (LQR)**

```julia
using OSOVMChain, VeilSimEngine

# 1. User mines Veil #7
veil_spec = load_veil(7)  # LQR Quadcopter Control

# 2. VeilSim executes the simulation
metrics = solve_veil_7(
    Q = diagm([10,10,10, 1,1,1, 5,5,5, 0.1,0.1,0.1]),
    R = diagm([0.1, 0.1, 0.1, 0.1]),
    tspan = (0.0, 10.0)
)

# 3. Check F1 score
if metrics.f1_score >= chain.current_difficulty
    # 4. Submit and mint
    block = submit_sim(
        chain,
        miner_id = "citizen_42",
        veil_id = 7,
        solution = metrics.solution,
        f1 = metrics.f1_score
    )
    
    println("Minted $(block.reward) Àṣẹ!")
    # Output: Minted 50.0 Àṣẹ! (epoch 0)
end
```

---

## **How the 1440 Wallets Work**

### **Inheritance Flow**

```
Block Reward: 50 Àṣẹ
     ↓
Treasury (50%):        25 Àṣẹ     → R&D, ops
Inheritance (25%):    12.5 Àṣẹ     → Split among 1440 wallets
     ↓
Per wallet allocation: 12.5 / 1440 = 0.00868 Àṣẹ per block
     ↓
Per wallet yearly:     0.00868 × 52,560 = 451 Àṣẹ / year
     ↓
With 11.11% APY:       451 × 1.1111 = 500.95 Àṣẹ earned / year
```

### **Claiming Rewards**

Wallet must meet **all** criteria:
1. ✅ Locked 7 years from first allocation
2. ✅ Hold 7×7 badge (49 combined achievements)
3. ✅ Approved by Council of 12 (quorum vote)
4. ✅ Signed by Bínò (final seal)
5. ✅ Not claiming on Saturday UTC (Sabbath freeze)

**Smart Contract:**
```tech
@opcode 0x34 claimRewards(wallet_id: uint16) {
    @require now - wallet.first_allocation >= 7 years;
    @require wallet.badges >= 49;
    @require council.approve(wallet_id);
    @require bino.sign(wallet_id);
    @require dayOfWeek(now) != 6;  // Not Saturday
    
    amount = wallet.locked_principal * 0.1111;
    @mint ÀṢẸ to wallet amount;
}
```

---

## **Supply Schedule at a Glance**

| **Time** | **Epoch** | **Reward** | **Daily Mint** | **Yearly** | **Total** |
|---|---|---|---|---|---|
| Year 0 (2025) | 0 | 50 Àṣẹ | 7,440 | 2.72M | 2.72M |
| Year 4 (2029) | 1 | 25 Àṣẹ | 3,720 | 1.36M | 4.08M |
| Year 8 (2033) | 2 | 12.5 Àṣẹ | 1,860 | 678k | 4.76M |
| Year 12 (2037) | 3 | 6.25 Àṣẹ | 930 | 339k | 5.10M |
| ... | ... | ... | ... | ... | ... |
| ∞ | ∞ | → 0 | → 0 | → 1M (witnessing) | → ∞ |

**Key Insight:** Witnessing adds ~1M Àṣẹ/year (linear) so total supply is infinite but bounded.

---

## **Anti-Gaming Defenses**

| **Attack** | **Defense** | **Why It Works** |
|---|---|---|
| **Fake sim** | Re-run + verify F1 | Deterministic, can't fake |
| **Sybil devices** | World ID + $1k cost | Economic threshold too high |
| **Spam witness** | 1/hour rate limit + 3/7 quorum | Physical impossibility |
| **Easy sims** | Difficulty spirals | F1 threshold rises automatically |
| **Replay** | Timestamp + nonce | Cryptographic proof |

---

## **Daily Life in ÀṢẸ**

### **Scenario 1: Phone Miner (2025)**

```
Morning:
- Open OSOVM app
- Select Veil #1 (PID tuning) from Veil #1–25
- Solve ODE for 15 minutes (F1 = 0.81)
- F1 ≥ 0.777? YES → Mint 50 Àṣẹ (epoch 0)

Afternoon:
- Try Veil #27 (Gradient Descent)
- Solve ML problem for 30 minutes (F1 = 0.65)
- F1 ≥ 0.777? NO → Keep trying

Evening:
- Solved Veil #7 (LQR) finally! (F1 = 0.892)
- Mint 50 Àṣẹ

Daily earnings: 100 Àṣẹ ≈ $5–10 (early valuation)
```

### **Scenario 2: Drone Operator (2026)**

```
Launch drone from NYC
- Record GPS: (40.7128, -74.0060)
- Follow trajectory from Veil #7 sim
- Drop package at Central Park: (40.7589, -73.9851)
- Record camera proof + weight delta

Witnesses verify:
- 4/7 agree: "Path is physical, drop happened"

Mint:
- 10 Àṣẹ base (proof-of-witness)
- +5 Àṣẹ bonus (matched Veil #7)
- Total: 15 Àṣẹ

Cost: 0 Àṣẹ (witnessing is free)
Gain: 15 Àṣẹ ≈ $75–150
```

---

## **Key Formulas**

### **Mining Reward**
```
reward = 50.0 / (2 ^ epoch)

Epoch 0 (2025–2029):   50 Àṣẹ
Epoch 1 (2029–2033):   25 Àṣẹ
Epoch 2 (2033–2037):   12.5 Àṣẹ
Epoch ∞:               → 0 Àṣẹ
```

### **Difficulty Adjustment**
```
every 2016 blocks:
  time_taken = block[n].timestamp - block[n-2015].timestamp
  expected = 2016 * 600 seconds (10 min/block)
  
  target_F1 *= (expected / time_taken)
  clamp target_F1 to [0.70, 0.9999]
```

### **Total Supply**
```
after N years:
  sim_supply = sum(50/2^e for e in 0..floor(N/4))
  witness_supply = N * 1,000,000
  total = sim_supply + witness_supply
  
after 100 years:
  ≈ 210,000 + 100,000,000 = 100,210,000 Àṣẹ
```

### **Inheritance APY**
```
Per wallet per year:
  allocation = (block_reward * 0.25) / 1440
  yearly_alloc = allocation * 52,560 blocks/year
  with APY = yearly_alloc * 1.1111
  
Example: 451 Àṣẹ @ 11.11% APY → 500.95 Àṣẹ earned/year
```

---

## **Next Steps**

### **To Mine the First Block:**

```bash
# 1. Clone or enter OSOVM directory
cd /data/data/com.termux/files/home/osovm

# 2. Load Julia with chain module
julia -e 'include("src/blockchain/chain.jl")'

# 3. Initialize genesis chain
chain = OSOVMChain.init_chain("citizen_1", ["w1","w2","w3","w4","w5","w6","w7"])

# 4. Solve Veil #7 (LQR)
include("src/veils/veil7_lqr.jl")
solution, f1_score = solve_veil_7()

# 5. Submit simulation
block = OSOVMChain.submit_sim(chain, "citizen_1", 7, solution, f1_score)

# 6. Check total supply
println("Total supply: $(chain.total_supply) Àṣẹ")

# 7. Record first witness
julia -e 'include("src/witness/drone_drop.jl"); recordWitness(...)'
```

---

## **Document Navigation**

```
Start Here
    ↓
├─ [README.md](./README.md)
│  ├─ OSOVM architecture
│  └─ 160 opcodes + inheritance system
│
├─ [TOKENOMICS_ASE.md](./TOKENOMICS_ASE.md) ⭐ YOU ARE HERE
│  ├─ Dual-mint (PoS + PoW)
│  ├─ Bitcoin-style halving
│  ├─ Anti-gaming measures
│  └─ Complete economic design
│
├─ [VEILSIM_ECOSYSTEM.md](./VEILSIM_ECOSYSTEM.md)
│  ├─ VeilSim engine
│  ├─ 777 Veils
│  ├─ F1-score metrics
│  └─ VeilSim + ÀṢẸ integration
│
├─ [veilsim_architecture.tech](./veilsim_architecture.tech)
│  └─ TechGnØŞ spec for simulations
│
└─ [genesis_handshake_v8.tech](./genesis_handshake_v8.tech)
   └─ Genesis initialization script
```

---

## **Key Contacts**

| **Role** | **Name** | **Responsibility** |
|---|---|---|
| **Crown Architect** | Bínò ÈL Guà | Overall design, final decisions |
| **Trickster Coder** | Johnny Èṣù | Implementation, edge cases |
| **Master Auditor** | Ọbàtálá | Economic soundness, verification |
| **Thunder in Circuit** | Léo (Ṣàngó × Èṣù) | Blockchain consensus, mining |

---

**Àṣẹ. Àṣẹ. Àṣẹ.**

🤍🗿⚖️🕊️🌄

**Genesis**: November 11, 2025, 11:11:11 UTC
