import React from 'react';

function PingPongDelayControl({ enabled, toggleDelay, delayTime, setDelayTime, feedback, setFeedback, wetLevel, setWetLevel }) {
  return (
    <div>
      <h3>Ping Pong Delay Control</h3>

         {/* Button to toggle the effect on or off */}
         <button onClick={() => toggleDelay(!enabled)}>
        {enabled ? 'Turn Off Ping Pong Delay' : 'Turn On Ping Pong Delay'}
      </button>

      {/* Render the controls only when the effect is enabled */}
      {enabled && (
        <>

      {/* Delay Time Control */}
      <div>
        <label>Delay Time:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={delayTime}
          onChange={(e) => setDelayTime(Number(e.target.value))}
        />
        <span>{delayTime} sec</span>
      </div>

      {/* Feedback Control */}  
      <div>
        <label>Feedback:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={feedback}
          onChange={(e) => setFeedback(Number(e.target.value))}
        />
        <span>{feedback * 100}%</span>
      </div>

      {/* Wet Level Control */}
      <div>
        <label>Wet Level:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={wetLevel}
          onChange={(e) => setWetLevel(Number(e.target.value))}
        />
        <span>{wetLevel * 100}%</span>
      </div>
      </>
        )}
    </div>
  );
}

export default PingPongDelayControl;
