#!/usr/bin/env python3
"""
Veil Catalog Query Tool
Query and filter the 777 veils by various criteria
"""

import json
import sys
import argparse
from collections import defaultdict

def load_catalog(filepath='out/veils_777.json'):
    """Load veil catalog from JSON."""
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: {filepath} not found")
        print("Run: python3 tools/complete_veils_777.py")
        sys.exit(1)

def search_veils(catalog, query):
    """Search veils by name or description."""
    query_lower = query.lower()
    results = [v for v in catalog['veils'] 
               if query_lower in v['name'].lower() 
               or query_lower in v['description'].lower()]
    return results

def filter_by_tier(catalog, tier):
    """Get all veils in a tier."""
    return [v for v in catalog['veils'] if v['tier'] == tier]

def filter_by_language(catalog, language):
    """Get all veils implemented in a language."""
    return [v for v in catalog['veils'] if v['ffi_language'] == language]

def filter_by_tag(catalog, tag):
    """Get all veils with a specific tag."""
    tag_lower = tag.lower()
    return [v for v in catalog['veils'] 
            if any(t.lower() == tag_lower for t in v.get('tags', []))]

def get_statistics(catalog):
    """Compute catalog statistics."""
    veils = catalog['veils']
    
    stats = {
        'total': len(veils),
        'by_tier': defaultdict(int),
        'by_language': defaultdict(int),
        'by_category': defaultdict(int),
    }
    
    for v in veils:
        stats['by_tier'][v['tier']] += 1
        stats['by_language'][v['ffi_language']] += 1
        stats['by_category'][v['category']] += 1
    
    return stats

def print_veils(veils, limit=None):
    """Pretty-print veils."""
    if not veils:
        print("No veils found")
        return
    
    if limit:
        veils = veils[:limit]
    
    print(f"\n{'ID':>4} {'Name':<30} {'Tier':<25} {'Language':<10}")
    print("─" * 75)
    
    for v in veils:
        veil_id = v['id']
        name = v['name'][:28]
        tier = v['tier'][:23]
        lang = v['ffi_language'][:8]
        print(f"{veil_id:4d} {name:<30} {tier:<25} {lang:<10}")
    
    print(f"\nTotal: {len(veils)} veils")

def print_statistics(stats):
    """Pretty-print statistics."""
    print(f"\n{'=' * 70}")
    print("777 VEILS SYSTEM — STATISTICS")
    print(f"{'=' * 70}")
    
    print(f"\nTotal Veils: {stats['total']}")
    
    print(f"\nBy Tier ({len(stats['by_tier'])} tiers):")
    for tier, count in sorted(stats['by_tier'].items()):
        pct = (count / stats['total']) * 100
        print(f"  {tier:30s}: {count:3d}  ({pct:5.1f}%)")
    
    print(f"\nBy Language ({len(stats['by_language'])} languages):")
    for lang, count in sorted(stats['by_language'].items()):
        pct = (count / stats['total']) * 100
        print(f"  {lang:20s}: {count:3d}  ({pct:5.1f}%)")
    
    print(f"\nBy Category ({len(stats['by_category'])} categories):")
    for cat, count in sorted(stats['by_category'].items()):
        pct = (count / stats['total']) * 100
        print(f"  {cat:30s}: {count:3d}  ({pct:5.1f}%)")
    
    print(f"\n{'=' * 70}\n")

def get_veil_by_id(catalog, veil_id):
    """Get a specific veil by ID."""
    for v in catalog['veils']:
        if v['id'] == veil_id:
            return v
    return None

def print_veil_details(veil):
    """Print detailed veil information."""
    print(f"\n{'=' * 70}")
    print(f"VEIL {veil['id']:3d}: {veil['name']}")
    print(f"{'=' * 70}")
    print(f"  Tier:          {veil['tier']}")
    print(f"  Category:      {veil['category']}")
    print(f"  Opcode:        {veil['opcode']}")
    print(f"  FFI Language:  {veil['ffi_language']}")
    print(f"  Description:   {veil['description']}")
    print(f"  Equation:      {veil['equation']}")
    
    if veil.get('tags'):
        print(f"  Tags:          {', '.join(veil['tags'])}")
    
    if veil.get('parameters'):
        print(f"  Parameters:    {veil['parameters']}")
    
    if veil.get('references'):
        print(f"  References:    {', '.join(veil['references'])}")
    
    print(f"{'=' * 70}\n")

def main():
    parser = argparse.ArgumentParser(
        description='Query the 777 Veils catalog',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 tools/query_veils.py --search quantum
  python3 tools/query_veils.py --tier quantum
  python3 tools/query_veils.py --language Julia
  python3 tools/query_veils.py --tag control
  python3 tools/query_veils.py --id 1
  python3 tools/query_veils.py --stats
  python3 tools/query_veils.py --list-tiers
        """
    )
    
    parser.add_argument('--search', '-s', help='Search by name or description')
    parser.add_argument('--tier', '-t', help='Filter by tier')
    parser.add_argument('--language', '-l', help='Filter by FFI language')
    parser.add_argument('--tag', help='Filter by tag')
    parser.add_argument('--id', type=int, help='Get specific veil by ID')
    parser.add_argument('--stats', action='store_true', help='Show statistics')
    parser.add_argument('--list-tiers', action='store_true', help='List all tiers')
    parser.add_argument('--list-languages', action='store_true', help='List all languages')
    parser.add_argument('--limit', type=int, default=20, help='Limit results (default: 20)')
    parser.add_argument('--all', action='store_true', help='Show all results (no limit)')
    
    args = parser.parse_args()
    
    # Load catalog
    catalog = load_catalog()
    
    # Handle specific commands
    if args.stats:
        stats = get_statistics(catalog)
        print_statistics(stats)
        return
    
    if args.list_tiers:
        stats = get_statistics(catalog)
        print("\nAvailable Tiers:")
        for tier in sorted(stats['by_tier'].keys()):
            count = stats['by_tier'][tier]
            print(f"  {tier} ({count})")
        print()
        return
    
    if args.list_languages:
        stats = get_statistics(catalog)
        print("\nAvailable Languages:")
        for lang in sorted(stats['by_language'].keys()):
            count = stats['by_language'][lang]
            print(f"  {lang} ({count})")
        print()
        return
    
    if args.id:
        veil = get_veil_by_id(catalog, args.id)
        if veil:
            print_veil_details(veil)
        else:
            print(f"Veil {args.id} not found")
        return
    
    # Query operations
    results = []
    
    if args.search:
        results = search_veils(catalog, args.search)
        print(f"\n📚 Search results for '{args.search}':")
    elif args.tier:
        results = filter_by_tier(catalog, args.tier)
        print(f"\n📚 Veils in tier '{args.tier}':")
    elif args.language:
        results = filter_by_language(catalog, args.language)
        print(f"\n📚 Veils in language '{args.language}':")
    elif args.tag:
        results = filter_by_tag(catalog, args.tag)
        print(f"\n📚 Veils with tag '{args.tag}':")
    else:
        # Show first N veils
        results = catalog['veils']
        print(f"\n📚 First {args.limit} veils:")
    
    limit = None if args.all else args.limit
    print_veils(results, limit=limit)

if __name__ == '__main__':
    main()
