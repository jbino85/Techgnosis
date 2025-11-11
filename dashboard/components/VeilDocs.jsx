/**
 * VeilDocs - Auto-generated documentation with LaTeX rendering
 * 
 * Features:
 * - Auto-generated docs from veil definitions
 * - LaTeX equation rendering (MathJax)
 * - FFI source code viewer
 * - Parameter documentation
 * - Sacred geometry explanations
 * - Cross-references and links
 */

import React, { useState, useEffect } from 'react';

/**
 * LaTeX Equation Renderer
 */
function EquationRenderer({ equation, inline = false }) {
  useEffect(() => {
    // Render with MathJax if available
    if (window.MathJax) {
      window.MathJax.typesetPromise?.([document.currentScript])
        .catch(err => console.log('MathJax error:', err));
    }
  }, [equation]);
  
  const className = inline ? 'equation-inline' : 'equation-block';
  
  return (
    <div className={className}>
      {equation.startsWith('\\') ? (
        <span className="mathjax">{`$$${equation}$$`}</span>
      ) : (
        <code>{equation}</code>
      )}
    </div>
  );
}

/**
 * ParameterDocumentation - Document function parameters
 */
function ParameterDocumentation({ parameters = [] }) {
  if (parameters.length === 0) {
    return null;
  }
  
  return (
    <section className="doc-section">
      <h3>Parameters</h3>
      
      <table className="param-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((param, i) => (
            <tr key={i}>
              <td className="param-name"><code>{param.name}</code></td>
              <td className="param-type"><code>{param.type}</code></td>
              <td>{param.description}</td>
              <td><code>{param.default || '—'}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/**
 * FFISourceViewer - Display FFI implementation source
 */
function FFISourceViewer({ language, implementation }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const languageIcons = {
    julia: '🟠',
    rust: '🦀',
    python: '🐍',
    go: '🐹',
    idris: '🎯'
  };
  
  return (
    <section className="doc-section ffi-viewer">
      <h3>
        <span className="language-icon">{languageIcons[language] || '📄'}</span>
        {language.charAt(0).toUpperCase() + language.slice(1)} Implementation
      </h3>
      
      <button
        className="expand-btn"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '▼' : '▶'} Show source
      </button>
      
      {isExpanded && (
        <pre className="source-code">
          <code>{implementation || `# ${language} implementation placeholder`}</code>
        </pre>
      )}
    </section>
  );
}

/**
 * SacredGeometryInfo - Display sacred mappings
 */
function SacredGeometryInfo({ sacredMapping, veilTier }) {
  if (!sacredMapping || veilTier !== 'first_canon') {
    return null;
  }
  
  const sacredInfo = {
    'yoruba_ifa_bones': {
      title: 'Ifá Binary Bones (Yoruba)',
      description: 'Foundation of Yoruba computation system using binary patterns (Odù). Based on 256 sacred combinations encoding the universe\'s structure.',
      references: ['Yoruba Divination System', 'Mathematical Foundations of Ifá']
    },
    'cultural_cycles': {
      title: 'Cultural Cycles',
      description: 'Unified calendar integrating Yoruba (1440), Kemetic, Kabbalah, Vedic, Mayan, Islamic, and Biblical cycles.',
      references: ['Comparative Cosmology', 'Sacred Calendar Integration']
    },
    'harmonics_resonance': {
      title: 'Harmonics & Resonance',
      description: 'Sacred frequencies including Schumann resonance (7.83 Hz), chakra frequencies, and Solfeggio scales.',
      references: ['Pythagorean Tuning', 'Sacred Acoustics']
    },
    'math_constants': {
      title: 'Mathematical Constants',
      description: 'Universal constants including φ (golden ratio), π (circle), e (growth), and their sacred relationships.',
      references: ['Sacred Geometry', 'Universal Ratios']
    }
  };
  
  const info = sacredInfo[sacredMapping] || {
    title: 'Sacred Mapping',
    description: 'This veil carries sacred geometric significance.',
    references: []
  };
  
  return (
    <section className="doc-section sacred-info">
      <h3>🤍 {info.title}</h3>
      
      <p className="sacred-description">
        {info.description}
      </p>
      
      {info.references && info.references.length > 0 && (
        <div className="references">
          <h4>References</h4>
          <ul>
            {info.references.map((ref, i) => (
              <li key={i}>{ref}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/**
 * VeilDocumentation - Full documentation for a single veil
 */
function VeilDocumentation({ veil }) {
  if (!veil) {
    return (
      <div className="docs-empty">
        Select a veil to view documentation
      </div>
    );
  }
  
  return (
    <article className="veil-documentation">
      <header className="doc-header">
        <h1>{veil.name}</h1>
        <div className="doc-meta">
          <span className="doc-id">Veil #{veil.id}</span>
          <span className="doc-tier">{veil.tier}</span>
          <span className="doc-opcode">{veil.opcode}</span>
        </div>
      </header>
      
      <section className="doc-section">
        <h2>Overview</h2>
        <p>{veil.description}</p>
      </section>
      
      <section className="doc-section">
        <h2>Mathematical Definition</h2>
        <EquationRenderer equation={veil.equation} />
      </section>
      
      <ParameterDocumentation
        parameters={veil.parameters || [
          { name: 'x', type: 'Float64', description: 'Input value' },
          { name: 'threshold', type: 'Float64', description: 'Decision threshold', default: '0.5' }
        ]}
      />
      
      <FFISourceViewer
        language={veil.ffi_language}
        implementation={generateMockSource(veil.ffi_language, veil.name)}
      />
      
      <SacredGeometryInfo
        sacredMapping={veil.sacred_mapping}
        veilTier={veil.tier}
      />
      
      {veil.references && veil.references.length > 0 && (
        <section className="doc-section references">
          <h2>References</h2>
          <ul>
            {veil.references.map((ref, i) => (
              <li key={i}>{ref}</li>
            ))}
          </ul>
        </section>
      )}
      
      <section className="doc-section usage">
        <h2>Usage Example</h2>
        <pre className="code-block">
          <code>{generateUsageExample(veil.name, veil.id)}</code>
        </pre>
      </section>
    </article>
  );
}

/**
 * Generate mock source code
 */
function generateMockSource(language, veilName) {
  const sourceMap = {
    julia: `# ${veilName}\nfunction execute_veil(params::Dict, input::Dict)::Dict\n    result = Dict()\n    # Implementation\n    return result\nend`,
    rust: `// ${veilName}\npub fn execute_veil(params: &Map, input: &Map) -> Map {\n    let mut result = Map::new();\n    // Implementation\n    result\n}`,
    python: `# ${veilName}\ndef execute_veil(params: dict, input: dict) -> dict:\n    result = {}\n    # Implementation\n    return result`,
    go: `// ${veilName}\nfunc ExecuteVeil(params map[string]interface{}, input map[string]interface{}) map[string]interface{} {\n    result := make(map[string]interface{})\n    // Implementation\n    return result\n}`,
    idris: `-- ${veilName}\nexecuteVeil : Veil -> Input -> Output\nexecuteVeil veil input = result\n    where result = compute veil input`
  };
  
  return sourceMap[language] || `// ${language} implementation\n// ...`;
}

/**
 * Generate usage example
 */
function generateUsageExample(veilName, veilId) {
  return `@veil(id: ${veilId}, parameters: {
  alpha: 0.01,
  threshold: 0.9
}) {
  input: training_data,
  iterations: 100
}

// With composition:
@veil(id: ${veilId}) -> @veil(id: ${veilId + 1}) {
  input: initial_state
}

// With F1 scoring:
@veil_score(f1: result.f1, veil_id: ${veilId}) {
  wallet: "0x..."
}`;
}

/**
 * VeilDocsPanel - Full documentation interface
 */
function VeilDocsPanel() {
  const [selectedVeil, setSelectedVeil] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [veilList, setVeilList] = useState([]);
  
  useEffect(() => {
    // Load veil list
    fetch('/api/veils/all')
      .then(r => r.json())
      .then(data => setVeilList(data))
      .catch(() => {
        // Mock data
        setVeilList([
          { id: 1, name: 'PID Controller', tier: 'classical' },
          { id: 26, name: 'Gradient Descent', tier: 'ml_ai' },
          { id: 401, name: 'Ifá Binary Bones', tier: 'first_canon' }
        ]);
      });
  }, []);
  
  const filteredVeils = veilList.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.id.toString().includes(searchQuery)
  );
  
  return (
    <div className="veil-docs-panel">
      <header className="docs-header">
        <h1>📚 Veil Documentation</h1>
        <p>Comprehensive guides for all 777 veils</p>
      </header>
      
      <div className="docs-container">
        <aside className="docs-sidebar">
          <input
            type="text"
            className="docs-search"
            placeholder="Search veils..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          
          <div className="veil-list">
            {filteredVeils.slice(0, 20).map(v => (
              <button
                key={v.id}
                className={`veil-link ${selectedVeil?.id === v.id ? 'active' : ''}`}
                onClick={() => setSelectedVeil(v)}
              >
                <span className="veil-id">#{v.id}</span>
                <span className="veil-name">{v.name}</span>
              </button>
            ))}
          </div>
          
          {filteredVeils.length > 20 && (
            <div className="more-results">
              +{filteredVeils.length - 20} more veils
            </div>
          )}
        </aside>
        
        <main className="docs-main">
          <VeilDocumentation veil={selectedVeil} />
        </main>
      </div>
    </div>
  );
}

export default VeilDocsPanel;
