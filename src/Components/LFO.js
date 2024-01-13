import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

function LFO({ synth, harmonicity, modulationIndex }) {
  const [waveform, setWaveform] = useState('sine');
  const [speed, setSpeed] = useState(1); // In Hz
  const [depth, setDepth] = useState(1); // Scale of modulation
  const [destination, setDestination] = useState('harmonicity'); // Default to 'harmonicity'

  useEffect(() => {
    let lfos = [];

    const setupLFOs = () => {
      // Check if synth and its voices are available
      if (synth && synth.voices) {
        synth.voices.forEach((voice, index) => {
          const lfo = new Tone.LFO({
            type: waveform,
            frequency: speed,
            depth: depth
          }).start();

          switch (destination) {
            case 'harmonicity':
              lfo.connect(voice.harmonicity);
              console.log(`LFO connected to harmonicity of voice ${index}`);
              break;
            case 'modulationIndex':
              lfo.connect(voice.modulationIndex);
              console.log(`LFO connected to modulationIndex of voice ${index}`);
              break;
            // Add more cases as needed for other controls
          }

          lfos.push(lfo);
        });
      } else {
        console.log("Synth or its voices are not available for LFO connection. Retrying...");
        // Retry after some delay
        setTimeout(setupLFOs, 1000); // Retry after 1 second
      }
    };

    setupLFOs(); // Initial call to setup LFOs

    // Cleanup function
    return () => {
      lfos.forEach(lfo => lfo.dispose());
    };
  }, [synth, waveform, speed, depth, destination, harmonicity, modulationIndex]);

  return (
    <div>
      <h3>LFO Controls</h3>
      {/* Waveform Control */}
      <div>
        <label>Waveform:</label>
        <select value={waveform} onChange={e => setWaveform(e.target.value)}>
          <option value="sine">Sine</option>
          <option value="triangle">Triangle</option>
          <option value="sawtooth">Sawtooth</option>
          <option value="square">Square</option>
        </select>
      </div>
  
      {/* Speed Control */}
      <div>
        <label>Speed (Hz):</label>
        <input
          type="number"
          min="0.1"
          max="20"
          step="0.1"
          value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
        />
      </div>
  
      {/* Depth Control */}
      <div>
        <label>Depth:</label>  
        <input
          type="number"
          min="0"
          max="100"
          step="1"
          value={depth}
          onChange={e => setDepth(Number(e.target.value))}
        />
      </div>
  
      {/* Destination Control */}
      <div>
        <label>Destination:</label>
        <select value={destination} onChange={e => setDestination(e.target.value)}>
          <option value="harmonicity">Harmonicity</option>
          <option value="modulationIndex">Modulation Index</option>
          {/* Add more options if needed */}
        </select>
      </div>
    </div>
  );
}

export default LFO;
