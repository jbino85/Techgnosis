"""
python_ffi.py — Python FFI for Ọ̀ṢỌ́VM
Handles: Rapid prototyping, data science, ML integration
"""

import json
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
import hashlib


@dataclass
class Job:
    """Work job with Aṣẹ minting"""
    id: str
    title: str
    description: str
    hours: float
    quality_score: float  # 0.0 to 1.0
    completion_rate: float  # 0.0 to 1.0
    sector: str
    worker: str
    

@dataclass
class Project:
    """Project container for jobs"""
    id: str
    name: str
    sector: str
    budget: float
    jobs: List[Job]
    status: str  # active, completed, cancelled


@dataclass
class WorkImpact:
    """Calculated work impact and Aṣẹ minting"""
    job_id: str
    base_ase: float
    quality_multiplier: float
    final_ase: float
    tithe: float
    net_ase: float


def calculate_work_impact(job: Job) -> WorkImpact:
    """
    Calculate Aṣẹ minting from work performance
    Base: 5 Aṣẹ per 8 hours
    Multipliers: quality_score, completion_rate
    Tithe: 3.69%
    """
    # Base rate: 5 Aṣẹ per 8-hour day
    base_rate = 5.0 / 8.0  # 0.625 Aṣẹ per hour
    base_ase = job.hours * base_rate
    
    # Quality multiplier (0.5x to 1.5x)
    quality_multiplier = 0.5 + (job.quality_score * 1.0)
    
    # Completion multiplier
    completion_multiplier = job.completion_rate
    
    # Total Aṣẹ before tithe
    gross_ase = base_ase * quality_multiplier * completion_multiplier
    
    # Calculate tithe (3.69%)
    tithe = gross_ase * 0.0369
    net_ase = gross_ase - tithe
    
    return WorkImpact(
        job_id=job.id,
        base_ase=base_ase,
        quality_multiplier=quality_multiplier,
        final_ase=gross_ase,
        tithe=tithe,
        net_ase=net_ase
    )


def mock_job_execution(job_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Mock job execution for prototyping
    Returns Aṣẹ minted and job status
    """
    job = Job(
        id=job_data.get("id", "job_001"),
        title=job_data.get("title", "Untitled Job"),
        description=job_data.get("description", ""),
        hours=job_data.get("hours", 8.0),
        quality_score=job_data.get("quality", 0.9),
        completion_rate=job_data.get("completion", 1.0),
        sector=job_data.get("sector", "general"),
        worker=job_data.get("worker", "genesis")
    )
    
    impact = calculate_work_impact(job)
    
    return {
        "job_id": job.id,
        "ase_minted": impact.net_ase,
        "tithe_collected": impact.tithe,
        "status": "complete",
        "timestamp": datetime.utcnow().isoformat()
    }


def calculate_tithe_split(total_ase: float) -> Dict[str, float]:
    """
    Calculate quadrinity tithe split (50/25/15/10)
    Total tithe: 3.69% of gross
    """
    tithe = total_ase * 0.0369
    
    return {
        "shrine": tithe * 0.50,        # TechGnØŞ.EXE Church (50%)
        "inheritance": tithe * 0.25,   # UBC (25%)
        "hospital": tithe * 0.15,      # SimaaS (15%)
        "market": tithe * 0.10,        # DAO (10%)
        "total_tithe": tithe,
        "citizen_net": total_ase - tithe
    }


def generate_receipt_hash(data: Dict[str, Any]) -> str:
    """
    Generate SHA-256 receipt hash for immutable record
    """
    # Sort keys for deterministic hash
    sorted_data = json.dumps(data, sort_keys=True)
    hash_obj = hashlib.sha256(sorted_data.encode())
    return "0x" + hash_obj.hexdigest()


def validate_receipt(receipt_hash: str) -> bool:
    """
    Validate receipt hash format (0x + 64 hex chars)
    """
    if not receipt_hash.startswith("0x"):
        return False
    
    hex_part = receipt_hash[2:]
    
    if len(hex_part) != 64:
        return False
    
    try:
        int(hex_part, 16)
        return True
    except ValueError:
        return False


def simulate_veil_training(
    veil_id: int,
    f1_target: float = 0.95,
    iterations: int = 100
) -> Dict[str, Any]:
    """
    Simulate VeilSim robot training with f1-score tracking
    Mints Aṣẽ based on performance
    """
    import random
    
    f1_scores = []
    ase_minted = []
    
    current_f1 = 0.75
    
    for i in range(iterations):
        # Simulate improvement with noise
        improvement = (f1_target - current_f1) * 0.1
        noise = random.gauss(0, 0.02)
        current_f1 = max(0.0, min(1.0, current_f1 + improvement + noise))
        
        f1_scores.append(current_f1)
        
        # Mint Aṣẹ based on performance
        if current_f1 >= 0.95:
            ase = 5.0
        elif current_f1 >= 0.90:
            ase = 3.0
        elif current_f1 >= 0.85:
            ase = 1.0
        else:
            ase = 0.0
        
        ase_minted.append(ase)
    
    return {
        "veil_id": veil_id,
        "iterations": iterations,
        "final_f1": f1_scores[-1],
        "avg_f1": sum(f1_scores) / len(f1_scores),
        "total_ase": sum(ase_minted),
        "f1_scores": f1_scores,
        "ase_minted": ase_minted
    }


def bipon_seed_to_address(seed_phrase: str, index: int = 0) -> str:
    """
    Generate wallet address from BIP39-like seed phrase
    Simplified for prototyping (use real BIP39 in production)
    """
    combined = f"{seed_phrase}:{index}"
    hash_obj = hashlib.sha256(combined.encode())
    address = "0x" + hash_obj.hexdigest()[:40]  # 40 hex chars (20 bytes)
    return address


def economic_simulation(
    citizens: int = 1000,
    days: int = 365
) -> Dict[str, Any]:
    """
    Simulate Aṣẹ economy over time
    Track supply, tithe accumulation, distribution
    """
    import random
    
    daily_supply = []
    tithe_accumulated = []
    
    total_supply = 0.0
    total_tithe = 0.0
    
    for day in range(days):
        # Random work performed by citizens
        daily_work = sum(random.uniform(5.0, 10.0) for _ in range(citizens))
        
        # Calculate tithe
        split = calculate_tithe_split(daily_work)
        
        total_supply += split["citizen_net"]
        total_tithe += split["total_tithe"]
        
        daily_supply.append(total_supply)
        tithe_accumulated.append(total_tithe)
    
    return {
        "citizens": citizens,
        "days": days,
        "final_supply": total_supply,
        "total_tithe": total_tithe,
        "avg_daily_mint": total_supply / days,
        "tithe_rate": total_tithe / (total_supply + total_tithe),
        "supply_curve": daily_supply,
        "tithe_curve": tithe_accumulated
    }


# FFI exports for Julia/VM
def oso_mock_job(job_data_json: str) -> str:
    """C-compatible JSON interface"""
    job_data = json.loads(job_data_json)
    result = mock_job_execution(job_data)
    return json.dumps(result)


def oso_calculate_tithe(amount: float) -> str:
    """C-compatible JSON interface"""
    result = calculate_tithe_split(amount)
    return json.dumps(result)


def oso_validate_receipt(receipt_hash: str) -> int:
    """C-compatible boolean interface (1=true, 0=false)"""
    return 1 if validate_receipt(receipt_hash) else 0


if __name__ == "__main__":
    # Test suite
    print("=== Ọ̀ṢỌ́ Python FFI Tests ===\n")
    
    # Test job execution
    test_job = {
        "id": "job_001",
        "title": "Build Ọ̀ṢỌ́ compiler",
        "hours": 40,
        "quality": 0.95,
        "completion": 1.0,
        "sector": "software",
        "worker": "bino"
    }
    
    result = mock_job_execution(test_job)
    print(f"Job Result: {json.dumps(result, indent=2)}\n")
    
    # Test tithe calculation
    tithe = calculate_tithe_split(100.0)
    print(f"Tithe Split (100 Aṣẹ): {json.dumps(tithe, indent=2)}\n")
    
    # Test receipt generation
    receipt = generate_receipt_hash(result)
    print(f"Receipt Hash: {receipt}")
    print(f"Valid: {validate_receipt(receipt)}\n")
    
    # Test VeilSim
    veil_sim = simulate_veil_training(veil_id=1, iterations=50)
    print(f"VeilSim: Final F1={veil_sim['final_f1']:.3f}, Total Aṣẹ={veil_sim['total_ase']:.1f}\n")
