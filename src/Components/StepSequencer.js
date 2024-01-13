import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

const StepSequencer = ({ synth }) => {
  const [sequence, setSequence] = useState(Array(16).fill(false));
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loop = new Tone.Sequence((time, col) => {
      if (sequence[col]) {
        // Play a note
        synth.triggerAttackRelease("C4", "8n", time);
      }
      // Schedule next note
      Tone.Draw.schedule(() => {
        // Update your UI here if needed
      }, time);
    }, Array.from(sequence.keys()), "16n");

    if (isPlaying) {
      Tone.Transport.start();
      loop.start(0);
    } else {
      Tone.Transport.stop();
      loop.stop();
    }

    return () => loop.dispose();
  }, [isPlaying, sequence, synth]);

  const toggleStep = (index) => {
    setSequence(sequence.map((step, i) => (i === index ? !step : step)));
  };

  return (
    <div>
      <div>
        {sequence.map((step, index) => (
          <button key={index} onClick={() => toggleStep(index)}>
            {step ? 'On' : 'Off'}
          </button>
        ))}
      </div>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Stop' : 'Start'}
      </button>
    </div>
  );
};

export default StepSequencer;
