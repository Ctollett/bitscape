import React from 'react';

function FilterControl({
  filterType,
  onTypeChange,
  filterFrequency,
  onFrequencyChange,
  detune,
  onDetuneChange,
  filterGain,
  onGainChange,
  filterRolloff,
  onRolloffChange,
  filterQ,
  onQChange,
  filterEnabled, 
  toggleFilter

}) {
  return (
    <div>
      <h3>Filter Control</h3>

      {/* Filter Type */}
      <div>

      <div>
      <h3>Filter Control</h3>
      <button onClick={() => toggleFilter(!filterEnabled)}>
        {filterEnabled ? 'Turn Off Filter' : 'Turn On Filter'}
      </button>

      {/* ... other filter controls ... */}
    </div>
  
        <label>Filter Type:</label>
        <select value={filterType} onChange={(e) => onTypeChange(e.target.value)}>
          <option value="lowpass">Lowpass</option>
          <option value="highpass">Highpass</option>
          <option value="bandpass">Bandpass</option>
          {/* ... other filter types */}
        </select>
      </div>

      {/* Filter Frequency */}
      <div>
        <label>Filter Frequency:</label>
        <input
          type="range"
          min="20"
          max="20000"
          step="1"
          value={filterFrequency}
          onChange={(e) => onFrequencyChange(parseFloat(e.target.value))}
        />
      </div>

      {/* Detune */}
      <div>
        <label>Detune (Cents):</label>
        <input
          type="range"
          min="-100"
          max="100"
          value={detune}
          onChange={(e) => onDetuneChange(parseFloat(e.target.value))}
        />
      </div>

      {/* Filter Gain */}
      <div>
        <label>Filter Gain:</label>
        <input
          type="range"
          min="-40"
          max="40"
          step="0.1"
          value={filterGain}
          onChange={(e) => onGainChange(parseFloat(e.target.value))}
        />
      </div> 

      {/* Filter Rolloff */}
      <div>
        <label>Filter Rolloff:</label>
        <select value={filterRolloff} onChange={(e) => onRolloffChange(parseInt(e.target.value, 10))}>
          <option value="-12">-12</option>
          <option value="-24">-24</option>
          <option value="-48">-48</option>
          <option value="-96">-96</option>
        </select>
      </div>

      {/* Filter Q */}
      <div>
        <label>Filter Q:</label>
        <input
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={filterQ}
          onChange={(e) => onQChange(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
}

export default FilterControl;

  