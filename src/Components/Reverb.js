function ReverbControl({ reverbEnabled, toggleReverb, reverbDecay, setReverbDecay, reverbPreDelay, setReverbPreDelay, reverbWetLevel, setReverbWetLevel }) {
    return (
      <div>
        <h3>Reverb Control</h3>
        <button onClick={() => toggleReverb(!reverbEnabled)}>
        {reverbEnabled ? 'Turn Off Reverb' : 'Turn On Reverb'}
      </button>
        {/* Decay Time Control */}
        <div>
          <label>Decay Time:</label>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={reverbDecay}
            onChange={(e) => setReverbDecay(Number(e.target.value))}
          />
        </div>
        {/* Pre-Delay Control */}
        <div>
          <label>Pre-Delay:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={reverbPreDelay}
            onChange={(e) => setReverbPreDelay(Number(e.target.value))}
          />
        </div>
        <div>
        <label>Wet Mix:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={reverbWetLevel}
          onChange={(e) => setReverbWetLevel(Number(e.target.value))}
        />
        <span>{Math.round(reverbWetLevel * 100)}%</span>
      </div>
      </div>
    );
  }

  
  export default ReverbControl