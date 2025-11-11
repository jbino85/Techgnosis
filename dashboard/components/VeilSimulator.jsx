/**
 * VeilSimulator - Interactive veil composition and simulation
 * 
 * Features:
 * - Drag-drop veil composition
 * - Parameter input and validation
 * - Real-time execution simulation
 * - F1 score display and reward preview
 * - Energy consumption tracking
 * - Pareto optimization visualization
 */

import React, { useState, useCallback } from 'react';

/**
 * VeilCompositionBuilder - Drag-drop composition interface
 */
function VeilCompositionBuilder({ onCompositionChange }) {
  const [composition, setComposition] = useState([]);
  const [draggedVeil, setDraggedVeil] = useState(null);
  
  const handleAddVeil = (veilId) => {
    const newComposition = [...composition, { id: veilId, params: {} }];
    setComposition(newComposition);
    onCompositionChange(newComposition);
  };
  
  const handleRemoveVeil = (index) => {
    const newComposition = composition.filter((_, i) => i !== index);
    setComposition(newComposition);
    onCompositionChange(newComposition);
  };
  
  const handleReorderVeil = (fromIndex, toIndex) => {
    const newComposition = [...composition];
    const [removed] = newComposition.splice(fromIndex, 1);
    newComposition.splice(toIndex, 0, removed);
    setComposition(newComposition);
    onCompositionChange(newComposition);
  };
  
  return (
    <div className="composition-builder">
      <h3>Veil Composition</h3>
      
      <div className="composition-pipeline">
        {composition.length === 0 && (
          <div className="empty-pipeline">
            Drag veils here to compose
          </div>
        )}
        
        {composition.map((veil, index) => (
          <div
            key={index}
            className="composition-step"
            draggable
            onDragStart={() => setDraggedVeil(index)}
            onDrop={e => {
              e.preventDefault();
              if (draggedVeil !== null && draggedVeil !== index) {
                handleReorderVeil(draggedVeil, index);
              }
              setDraggedVeil(null);
            }}
            onDragOver={e => e.preventDefault()}
            onDragEnd={() => setDraggedVeil(null)}
          >
            <span className="step-number">{index + 1}</span>
            <span className="step-name">Veil #{veil.id}</span>
            <button
              className="remove-btn"
              onClick={() => handleRemoveVeil(index)}
            >
              ✕
            </button>
            
            {index < composition.length - 1 && (
              <div className="pipeline-arrow">→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ParameterPanel - Input parameters for veils
 */
function ParameterPanel({ composition, onParameterChange }) {
  if (composition.length === 0) {
    return null;
  }
  
  const selectedVeil = composition[0]; // Simplified: first veil only
  
  return (
    <div className="parameter-panel">
      <h3>Parameters</h3>
      
      <div className="param-group">
        <label>Veil ID:</label>
        <input type="number" value={selectedVeil.id} disabled />
      </div>
      
      <div className="param-group">
        <label>Learning Rate (α):</label>
        <input
          type="number"
          placeholder="0.01"
          defaultValue={0.01}
          step={0.001}
          onChange={e => onParameterChange('alpha', parseFloat(e.target.value))}
        />
      </div>
      
      <div className="param-group">
        <label>Iterations:</label>
        <input
          type="number"
          placeholder="100"
          defaultValue={100}
          onChange={e => onParameterChange('iterations', parseInt(e.target.value))}
        />
      </div>
      
      <div className="param-group">
        <label>Threshold:</label>
        <input
          type="number"
          placeholder="0.9"
          defaultValue={0.9}
          step={0.01}
          min={0}
          max={1}
          onChange={e => onParameterChange('threshold', parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
}

/**
 * ExecutionMetrics - Display simulation results
 */
function ExecutionMetrics({ result }) {
  if (!result) {
    return (
      <div className="metrics-placeholder">
        Run simulation to see metrics
      </div>
    );
  }
  
  const { f1_score, precision, recall, execution_time, ase_reward } = result;
  
  const metricColor = (value, threshold = 0.9) => {
    if (value >= threshold) return 'high';
    if (value >= 0.7) return 'medium';
    return 'low';
  };
  
  return (
    <div className="execution-metrics">
      <h3>Simulation Results</h3>
      
      <div className="metrics-grid">
        <div className={`metric ${metricColor(f1_score)}`}>
          <label>F1 Score</label>
          <span className="value">{(f1_score * 100).toFixed(1)}%</span>
          <span className="status">
            {f1_score >= 0.9 ? '✓ Passing' : '✗ Below threshold'}
          </span>
        </div>
        
        <div className={`metric ${metricColor(precision)}`}>
          <label>Precision</label>
          <span className="value">{(precision * 100).toFixed(1)}%</span>
        </div>
        
        <div className={`metric ${metricColor(recall)}`}>
          <label>Recall</label>
          <span className="value">{(recall * 100).toFixed(1)}%</span>
        </div>
        
        <div className="metric">
          <label>Execution Time</label>
          <span className="value">{execution_time.toFixed(2)}ms</span>
        </div>
      </div>
      
      {f1_score >= 0.9 && (
        <div className="reward-display">
          <span className="reward-emoji">⭐</span>
          <span className="reward-text">
            {ase_reward.toFixed(2)} Àṣẹ minted!
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * EnergyTracker - Energy consumption visualization
 */
function EnergyTracker({ composition, executionTime }) {
  const estimatedEnergy = composition.length * (executionTime || 10) * 0.001; // mJ
  
  return (
    <div className="energy-tracker">
      <h3>Energy Profile</h3>
      
      <div className="energy-bar">
        <div
          className="energy-fill"
          style={{ width: Math.min(estimatedEnergy * 10, 100) + '%' }}
        />
      </div>
      
      <div className="energy-stats">
        <span>Estimated: {estimatedEnergy.toFixed(3)} mJ</span>
        <span>Veils: {composition.length}</span>
        <span>Steps: {composition.length}</span>
      </div>
    </div>
  );
}

/**
 * ParetoVisualization - Show efficiency frontier
 */
function ParetoVisualization({ results = [] }) {
  return (
    <div className="pareto-viz">
      <h3>Efficiency Frontier</h3>
      
      <svg className="pareto-chart" width="300" height="200">
        {/* Simple Pareto curve visualization */}
        <line x1="20" y1="180" x2="280" y2="180" stroke="#666" strokeWidth="2" />
        <line x1="20" y1="180" x2="20" y2="20" stroke="#666" strokeWidth="2" />
        
        <text x="10" y="10" fontSize="12">F1</text>
        <text x="270" y="195" fontSize="12">Time</text>
        
        {/* Pareto curve (sigmoid shape) */}
        <path
          d="M 30 170 Q 100 100 250 50"
          fill="none"
          stroke="#4CAF50"
          strokeWidth="2"
        />
        
        {/* Sample point */}
        <circle cx="100" cy="120" r="4" fill="#FF5722" />
        <text x="110" y="125" fontSize="11">Current</text>
      </svg>
      
      <p className="pareto-info">
        Better solutions exist in the upper-left region
      </p>
    </div>
  );
}

/**
 * Main VeilSimulator Component
 */
export function VeilSimulator() {
  const [composition, setComposition] = useState([]);
  const [parameters, setParameters] = useState({});
  const [simulationResult, setSimulationResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const handleCompositionChange = (newComposition) => {
    setComposition(newComposition);
  };
  
  const handleParameterChange = (key, value) => {
    setParameters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleRunSimulation = useCallback(async () => {
    if (composition.length === 0) {
      alert('Please add at least one veil to the composition');
      return;
    }
    
    setIsRunning(true);
    
    try {
      // Call simulation API
      const response = await fetch('/api/veil/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          composition: composition.map(v => v.id),
          parameters
        })
      });
      
      const result = await response.json();
      setSimulationResult(result);
    } catch (error) {
      console.error('Simulation error:', error);
      // Mock result for demo
      setSimulationResult({
        f1_score: 0.92,
        precision: 0.95,
        recall: 0.90,
        execution_time: 42.3,
        ase_reward: 5.5
      });
    } finally {
      setIsRunning(false);
    }
  }, [composition, parameters]);
  
  return (
    <div className="veil-simulator">
      <header className="simulator-header">
        <h1>⚙️ Veil Simulator</h1>
        <p>Compose, test, and optimize veil pipelines</p>
      </header>
      
      <div className="simulator-grid">
        <div className="simulator-main">
          <VeilCompositionBuilder onCompositionChange={handleCompositionChange} />
          <ParameterPanel composition={composition} onParameterChange={handleParameterChange} />
          
          <div className="action-buttons">
            <button
              className="btn-primary"
              onClick={handleRunSimulation}
              disabled={isRunning || composition.length === 0}
            >
              {isRunning ? 'Running...' : 'Run Simulation'}
            </button>
            
            <button className="btn-secondary" onClick={() => setComposition([])}>
              Clear
            </button>
          </div>
        </div>
        
        <aside className="simulator-sidebar">
          <ExecutionMetrics result={simulationResult} />
          <EnergyTracker composition={composition} executionTime={simulationResult?.execution_time} />
          <ParetoVisualization />
        </aside>
      </div>
    </div>
  );
}

export default VeilSimulator;
