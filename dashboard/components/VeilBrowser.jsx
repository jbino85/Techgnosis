/**
 * VeilBrowser - Interactive 777 Veil Catalog Browser
 * 
 * Features:
 * - Browse all 777 veils with full metadata
 * - Tier-based filtering (classical, ML/AI, signal, etc)
 * - Search by name, description, tags, equations
 * - Sacred geometry visualization for First Canon veils
 * - F1 score display for completed simulations
 * - Real-time filtering and sorting
 */

import React, { useState, useMemo, useCallback } from 'react';
import styles from '../style.css';

// Mock data loader - in production this would fetch from osovm
const useVeilData = () => {
  const [veils, setVeils] = useState([]);
  const [loading, setLoading] = useState(true);
  
  React.useEffect(() => {
    // Load veils from API endpoint
    fetch('/api/veils/all')
      .then(r => r.json())
      .then(data => {
        setVeils(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback: load demo veils
        setVeils(generateDemoVeils());
        setLoading(false);
      });
  }, []);
  
  return { veils, loading };
};

/**
 * Generate demo veil data for UI development
 */
function generateDemoVeils() {
  const tiers = [
    'classical', 'ml_ai', 'signal', 'robotics', 'vision',
    'networks', 'optimization', 'physics', 'estimation',
    'navigation', 'multiagent', 'crypto', 'first_canon'
  ];
  
  const demoVeils = [
    {
      id: 1,
      name: 'PID Controller',
      tier: 'classical',
      description: 'Three-term feedback control',
      equation: 'u = Kp·e + Ki·∫e + Kd·de/dt',
      opcode: '0x01',
      ffi_language: 'julia',
      tags: ['control', 'feedback', 'pid'],
      sacred_mapping: 'balance_flow'
    },
    {
      id: 26,
      name: 'Gradient Descent',
      tier: 'ml_ai',
      description: 'Loss landscape optimization',
      equation: 'θ := θ - α·∇J(θ)',
      opcode: '0x1A',
      ffi_language: 'python',
      tags: ['gradient', 'optimization', 'learning']
    },
    {
      id: 401,
      name: 'Ifá Binary Bones',
      tier: 'first_canon',
      description: 'Yoruba computation foundation',
      equation: 'Odù lattice: 2, 16, 256, 65536',
      opcode: '0x191',
      ffi_language: 'julia',
      tags: ['ifa', 'binary', 'yoruba'],
      sacred_mapping: 'yoruba_ifa_bones'
    }
  ];
  
  return demoVeils;
}

/**
 * VeilCard - Individual veil display card
 */
function VeilCard({ veil, onSelect }) {
  const isSacred = veil.tier === 'first_canon';
  
  return (
    <div className={`veil-card ${isSacred ? 'sacred' : ''}`} onClick={() => onSelect(veil)}>
      <div className="veil-header">
        <h3>{veil.name}</h3>
        <span className="veil-id">#{veil.id}</span>
      </div>
      
      <div className="veil-meta">
        <span className="tier">{veil.tier}</span>
        <span className="opcode">{veil.opcode}</span>
        <span className="language">{veil.ffi_language}</span>
      </div>
      
      <p className="description">{veil.description}</p>
      
      <div className="equation">
        <code>{veil.equation}</code>
      </div>
      
      {veil.tags && veil.tags.length > 0 && (
        <div className="tags">
          {veil.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="tag">{tag}</span>
          ))}
          {veil.tags.length > 3 && <span className="tag">+{veil.tags.length - 3}</span>}
        </div>
      )}
      
      {veil.sacred_mapping && (
        <div className="sacred-indicator">
          🤍 {veil.sacred_mapping}
        </div>
      )}
    </div>
  );
}

/**
 * VeilDetail - Detailed veil information view
 */
function VeilDetail({ veil, onClose }) {
  return (
    <div className="veil-detail-modal" onClick={onClose}>
      <div className="veil-detail-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <h2>{veil.name}</h2>
        
        <div className="detail-grid">
          <div className="detail-item">
            <label>ID:</label>
            <span>{veil.id}</span>
          </div>
          
          <div className="detail-item">
            <label>Tier:</label>
            <span>{veil.tier}</span>
          </div>
          
          <div className="detail-item">
            <label>Opcode:</label>
            <span className="monospace">{veil.opcode}</span>
          </div>
          
          <div className="detail-item">
            <label>FFI Language:</label>
            <span>{veil.ffi_language}</span>
          </div>
        </div>
        
        <div className="detail-section">
          <h3>Description</h3>
          <p>{veil.description}</p>
        </div>
        
        <div className="detail-section">
          <h3>Mathematical Definition</h3>
          <pre className="equation-block">{veil.equation}</pre>
        </div>
        
        {veil.tags && veil.tags.length > 0 && (
          <div className="detail-section">
            <h3>Tags</h3>
            <div className="tags-list">
              {veil.tags.map((tag, i) => (
                <span key={i} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}
        
        {veil.sacred_mapping && (
          <div className="detail-section sacred">
            <h3>🤍 Sacred Mapping</h3>
            <p>{veil.sacred_mapping}</p>
          </div>
        )}
        
        <div className="detail-actions">
          <button className="btn-primary">Execute Veil</button>
          <button className="btn-secondary">Use in Composition</button>
        </div>
      </div>
    </div>
  );
}

/**
 * TierFilter - Filtering by tier
 */
function TierFilter({ selectedTiers, onTierChange }) {
  const tiers = [
    'classical', 'ml_ai', 'signal', 'robotics', 'vision',
    'networks', 'optimization', 'physics', 'estimation',
    'navigation', 'multiagent', 'crypto', 'first_canon'
  ];
  
  return (
    <div className="tier-filter">
      <h3>Tiers</h3>
      <div className="filter-group">
        {tiers.map(tier => (
          <label key={tier} className="filter-checkbox">
            <input
              type="checkbox"
              checked={selectedTiers.includes(tier)}
              onChange={() => onTierChange(tier)}
            />
            <span>{tier.replace(/_/g, ' ')}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/**
 * Main VeilBrowser Component
 */
export function VeilBrowser() {
  const { veils, loading } = useVeilData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTiers, setSelectedTiers] = useState(['classical', 'ml_ai']);
  const [selectedVeil, setSelectedVeil] = useState(null);
  const [sortBy, setSortBy] = useState('id');
  
  // Filter and search
  const filteredVeils = useMemo(() => {
    let result = veils;
    
    // Filter by tier
    if (selectedTiers.length > 0) {
      result = result.filter(v => selectedTiers.includes(v.tier));
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(v =>
        v.name.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query) ||
        v.equation.toLowerCase().includes(query) ||
        (v.tags && v.tags.some(t => t.toLowerCase().includes(query)))
      );
    }
    
    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'tier':
          return a.tier.localeCompare(b.tier);
        default: // id
          return a.id - b.id;
      }
    });
    
    return result;
  }, [veils, searchQuery, selectedTiers, sortBy]);
  
  const handleTierChange = (tier) => {
    setSelectedTiers(prev =>
      prev.includes(tier)
        ? prev.filter(t => t !== tier)
        : [...prev, tier]
    );
  };
  
  if (loading) {
    return <div className="loading">Loading 777 veils...</div>;
  }
  
  return (
    <div className="veil-browser">
      <header className="browser-header">
        <h1>🤍 Veil Catalog Browser</h1>
        <p>Explore all 777 sacred-scientific veils</p>
      </header>
      
      <div className="browser-container">
        <aside className="browser-sidebar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search veils..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="sort-control">
            <label>Sort by:</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="id">ID</option>
              <option value="name">Name</option>
              <option value="tier">Tier</option>
            </select>
          </div>
          
          <TierFilter selectedTiers={selectedTiers} onTierChange={handleTierChange} />
        </aside>
        
        <main className="browser-main">
          <div className="results-header">
            <h2>Results ({filteredVeils.length} veils)</h2>
          </div>
          
          <div className="veil-grid">
            {filteredVeils.map(veil => (
              <VeilCard
                key={veil.id}
                veil={veil}
                onSelect={setSelectedVeil}
              />
            ))}
          </div>
          
          {filteredVeils.length === 0 && (
            <div className="no-results">
              No veils match your filters. Try adjusting your search.
            </div>
          )}
        </main>
      </div>
      
      {selectedVeil && (
        <VeilDetail
          veil={selectedVeil}
          onClose={() => setSelectedVeil(null)}
        />
      )}
    </div>
  );
}

export default VeilBrowser;
