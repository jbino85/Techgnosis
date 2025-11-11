// move_ffi.move — Move FFI for Ọ̀ṢỌ́VM
// Handles: Resource safety, linear types, ownership

module OsoVM::Ase {
    use std::signer;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::timestamp;

    /// Aṣẹ coin type (sacred work token)
    struct Ase has key {}

    /// Staked Aṣẹ resource (linear type - can't be copied)
    struct StakedAse has key, store {
        amount: u64,
        staked_at: u64,
        unlock_time: u64,
    }

    /// Tithe vault for quadrinity distribution
    struct TitheVault has key {
        shrine: Coin<Ase>,       // 50% - TechGnØŞ.EXE
        inheritance: Coin<Ase>,  // 25% - UBC
        hospital: Coin<Ase>,     // 15% - SimaaS
        market: Coin<Ase>,       // 10% - DAO
    }

    /// Initialize Aṣẹ coin and tithe vault
    public entry fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);
        
        // Initialize coin
        coin::initialize<Ase>(
            account,
            b"Ase",
            b"ASE",
            6,  // 6 decimals
            true,  // Monitoring enabled
        );

        // Create tithe vault
        move_to(account, TitheVault {
            shrine: coin::zero<Ase>(),
            inheritance: coin::zero<Ase>(),
            hospital: coin::zero<Ase>(),
            market: coin::zero<Ase>(),
        });
    }

    /// Mint Aṣẹ from verified work (with automatic tithe)
    public fun mint_from_work(
        account: &signer,
        amount: u64,
    ) acquires TitheVault {
        let total_minted = coin::mint<Ase>(amount);
        
        // Calculate 3.69% tithe
        let tithe_amount = (amount * 369) / 10000;
        let citizen_amount = amount - tithe_amount;
        
        // Extract tithe
        let tithe = coin::extract(&mut total_minted, tithe_amount);
        
        // Split tithe across quadrinity (50/25/15/10)
        let vault = borrow_global_mut<TitheVault>(@OsoVM);
        let shrine_share = (tithe_amount * 50) / 100;
        let inheritance_share = (tithe_amount * 25) / 100;
        let hospital_share = (tithe_amount * 15) / 100;
        let market_share = (tithe_amount * 10) / 100;
        
        coin::merge(&mut vault.shrine, coin::extract(&mut tithe, shrine_share));
        coin::merge(&mut vault.inheritance, coin::extract(&mut tithe, inheritance_share));
        coin::merge(&mut vault.hospital, coin::extract(&mut tithe, hospital_share));
        coin::merge(&mut vault.market, tithe);  // Remaining goes to market
        
        // Deposit citizen's net Aṣẹ
        let account_addr = signer::address_of(account);
        coin::deposit(account_addr, total_minted);
    }

    /// Stake Aṣẹ for governance (linear type prevents duplication)
    public entry fun stake(
        account: &signer,
        amount: u64,
        lock_duration: u64,
    ) acquires StakedAse {
        let account_addr = signer::address_of(account);
        let coins = coin::withdraw<Ase>(account, amount);
        
        let current_time = timestamp::now_seconds();
        let unlock_time = current_time + lock_duration;
        
        // If staked resource exists, add to it
        if (exists<StakedAse>(account_addr)) {
            let staked = borrow_global_mut<StakedAse>(account_addr);
            coin::merge(&mut staked.amount, amount);
            
            // Extend lock time if longer
            if (unlock_time > staked.unlock_time) {
                staked.unlock_time = unlock_time;
            };
        } else {
            // Create new staked resource
            move_to(account, StakedAse {
                amount,
                staked_at: current_time,
                unlock_time,
            });
        };
    }

    /// Unstake Aṣẹ after lock period
    public entry fun unstake(
        account: &signer,
        amount: u64,
    ) acquires StakedAse {
        let account_addr = signer::address_of(account);
        let staked = borrow_global_mut<StakedAse>(account_addr);
        
        // Verify unlock time passed
        let current_time = timestamp::now_seconds();
        assert!(current_time >= staked.unlock_time, 1);
        
        // Verify sufficient staked balance
        assert!(staked.amount >= amount, 2);
        
        // Unstake (resource safety prevents double-spend)
        staked.amount = staked.amount - amount;
        
        let coins = coin::mint<Ase>(amount);
        coin::deposit(account_addr, coins);
    }

    /// Transfer Aṣẹ (guaranteed atomic by Move)
    public entry fun transfer(
        from: &signer,
        to: address,
        amount: u64,
    ) {
        coin::transfer<Ase>(from, to, amount);
    }

    /// Get staked balance (view function)
    #[view]
    public fun get_staked_balance(account: address): u64 acquires StakedAse {
        if (exists<StakedAse>(account)) {
            borrow_global<StakedAse>(account).amount
        } else {
            0
        }
    }

    /// Get unlock time (view function)
    #[view]
    public fun get_unlock_time(account: address): u64 acquires StakedAse {
        if (exists<StakedAse>(account)) {
            borrow_global<StakedAse>(account).unlock_time
        } else {
            0
        }
    }

    /// Withdraw from tithe vault (governance only)
    public entry fun withdraw_tithe(
        governance: &signer,
        vault_type: u8,  // 0=shrine, 1=inheritance, 2=hospital, 3=market
        amount: u64,
        recipient: address,
    ) acquires TitheVault {
        // Only governance can withdraw
        assert!(signer::address_of(governance) == @OsoVM, 3);
        
        let vault = borrow_global_mut<TitheVault>(@OsoVM);
        
        let coins = if (vault_type == 0) {
            coin::extract(&mut vault.shrine, amount)
        } else if (vault_type == 1) {
            coin::extract(&mut vault.inheritance, amount)
        } else if (vault_type == 2) {
            coin::extract(&mut vault.hospital, amount)
        } else {
            coin::extract(&mut vault.market, amount)
        };
        
        coin::deposit(recipient, coins);
    }
}
