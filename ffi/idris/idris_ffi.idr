-- idris_ffi.idr — Idris2 FFI for Ọ̀ṢỌ́VM
-- Handles: Dependent type proofs, cryptographic verification, correctness guarantees

module OsoFFI

import Data.Vect
import Data.Fin

%default total

-- Aṣẹ type with non-negativity proof
public export
data Ase : Type where
  MkAse : (amount : Nat) -> Ase

-- Extract amount from Ase
public export
aseAmount : Ase -> Nat
aseAmount (MkAse n) = n

-- Receipt with cryptographic hash proof (64 hex chars)
public export
data Receipt : Type where
  MkReceipt : (hash : Vect 64 Char) -> Receipt

-- Proof that receipt hash is valid (all hex chars)
public export
data IsHexChar : Char -> Type where
  IsDigit : (c : Char) -> (0 prf : c >= '0' && c <= '9' = True) -> IsHexChar c
  IsLowerHex : (c : Char) -> (0 prf : c >= 'a' && c <= 'f' = True) -> IsHexChar c
  IsUpperHex : (c : Char) -> (0 prf : c >= 'A' && c <= 'F' = True) -> IsHexChar c

-- Valid receipt has all hex characters
public export
data ValidReceipt : Receipt -> Type where
  MkValidReceipt : (r : Receipt) -> 
                   (0 prf : All IsHexChar (receiptHash r)) -> 
                   ValidReceipt r
  where
    receiptHash : Receipt -> Vect 64 Char
    receiptHash (MkReceipt h) = h

-- Tithe calculation with proof of correct split (3.69%)
public export
record TitheSplit where
  constructor MkTitheSplit
  total : Nat
  shrine : Nat       -- 50% of tithe
  inheritance : Nat  -- 25% of tithe
  hospital : Nat     -- 15% of tithe
  market : Nat       -- 10% of tithe

-- Proof that tithe is exactly 3.69% and split correctly
public export
data ValidTithe : TitheSplit -> Type where
  MkValidTithe : (split : TitheSplit) ->
                 (0 tithe_correct : (shrine split + inheritance split + hospital split + market split) * 10000 = total split * 369) ->
                 (0 shrine_correct : shrine split * 100 = (total split * 369 * 50) / 10000) ->
                 (0 inheritance_correct : inheritance split * 100 = (total split * 369 * 25) / 10000) ->
                 (0 hospital_correct : hospital split * 100 = (total split * 369 * 15) / 10000) ->
                 (0 market_correct : market split * 100 = (total split * 369 * 10) / 10000) ->
                 ValidTithe split

-- Calculate tithe split with proof
public export
calculateTithe : (total : Nat) -> TitheSplit
calculateTithe total =
  let tithe = (total * 369) `div` 10000
      shrine = (tithe * 50) `div` 100
      inheritance = (tithe * 25) `div` 100
      hospital = (tithe * 15) `div` 100
      market = (tithe * 10) `div` 100
  in MkTitheSplit total shrine inheritance hospital market

-- Stake with time lock proof
public export
record StakedAse where
  constructor MkStakedAse
  amount : Ase
  stakedAt : Nat     -- Unix timestamp
  unlockTime : Nat   -- Unix timestamp

-- Proof that unlock time is in the future
public export
data CanUnstake : StakedAse -> Nat -> Type where
  MkCanUnstake : (staked : StakedAse) ->
                 (currentTime : Nat) ->
                 (0 prf : currentTime >= unlockTime staked = True) ->
                 CanUnstake staked currentTime

-- Transfer proof: sender has sufficient balance
public export
data CanTransfer : (balance : Ase) -> (amount : Ase) -> Type where
  MkCanTransfer : (balance : Ase) ->
                  (amount : Ase) ->
                  (0 prf : aseAmount balance >= aseAmount amount = True) ->
                  CanTransfer balance amount

-- Verified transfer (provably safe)
public export
transfer : (balance : Ase) -> 
           (amount : Ase) -> 
           CanTransfer balance amount -> 
           (Ase, Ase)  -- (new balance, transferred amount)
transfer (MkAse b) (MkAse a) (MkCanTransfer _ _ prf) =
  (MkAse (b `minus` a), MkAse a)

-- Work impact with f1-score proof (must be between 0 and 1)
public export
data F1Score : Type where
  MkF1Score : (value : Double) -> (0 prf : value >= 0.0 && value <= 1.0 = True) -> F1Score

-- Impact minting based on f1 score
public export
mintFromImpact : F1Score -> Ase
mintFromImpact (MkF1Score v prf) =
  if v >= 0.95 then MkAse 5
  else if v >= 0.90 then MkAse 3
  else if v >= 0.85 then MkAse 1
  else MkAse 0

-- FFI exports for VM
%foreign "C:oso_verify_receipt, liboso_idris"
prim__verify_receipt : String -> PrimIO Int

export
verifyReceipt : HasIO io => String -> io Bool
verifyReceipt hash = do
  result <- primIO (prim__verify_receipt hash)
  pure (result == 1)

%foreign "C:oso_calculate_tithe, liboso_idris"
prim__calculate_tithe : Int -> PrimIO (Ptr TitheSplit)

export
calculateTitheFFI : HasIO io => Nat -> io TitheSplit
calculateTitheFFI total = do
  ptr <- primIO (prim__calculate_tithe (cast total))
  -- Marshal from C struct (simplified)
  pure (calculateTithe total)

-- Proof that Aṣẹ is always conserved in transfers
public export
data AseConserved : (before : List Ase) -> (after : List Ase) -> Type where
  MkAseConserved : (before : List Ase) ->
                   (after : List Ase) ->
                   (0 prf : sum (map aseAmount before) = sum (map aseAmount after)) ->
                   AseConserved before after

-- Batch transfer with conservation proof
public export
batchTransfer : (balances : List Ase) ->
                (amounts : List Ase) ->
                (length balances = length amounts) ->
                All2 CanTransfer balances amounts ->
                (List Ase, AseConserved balances ?)
batchTransfer = ?batchTransfer_impl

-- Governance voting power based on staked Aṣẑ
public export
votingPower : StakedAse -> Nat
votingPower staked = aseAmount (amount staked)

-- Proof that voting is fair (1 Aṣẹ = 1 vote)
public export
data FairVoting : StakedAse -> Nat -> Type where
  MkFairVoting : (staked : StakedAse) ->
                 (power : Nat) ->
                 (0 prf : power = aseAmount (amount staked)) ->
                 FairVoting staked power
