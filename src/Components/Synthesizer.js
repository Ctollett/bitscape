import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import FilterControl from './Filter';
import ReverbControl from './Reverb';
import PingPongDelayControl from './Delay';
import AIGenerator from './AIGenerator';
import * as mm from '@magenta/music';
import KeyboardMIDIHandler, { noteMapping as keyboardNoteMapping } from './KeyboardMIDIHandler';
import Visualizer from './Waveform';
import "./styles.css";
import RecorderControl from './RecorderControl'; 
import Recording from './RecordingControl'; 
import PresetMenu from './PresetMenu';


function Synthesizer({isUserLoggedIn, userId}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [synth, setSynth] = useState(null);
  const [octave, setOctave] = useState(4);
  const [harmonicity, setHarmonicity] = useState(1);
  const [filter, setFilter] = useState(null);
  const [filterType, setFilterType] = useState('lowpass');
  const [detune, setDetune] = useState(0); 
  const [filterFrequency, setFilterFrequency] = useState(440); 
  const [filterGain, setFilterGain] = useState(0);
  const [filterRolloff, setFilterRolloff] = useState(-12);
  const [filterQ, setFilterQ] = useState(1);
  const [modulationIndex, setModulationIndex] = useState(10);
  const [carrierWaveform, setCarrierWaveform] = useState('sine');
  const [modulatorWaveform, setModulatorWaveform] = useState('sine');
  const [reverb, setReverb] = useState(null);
  const [reverbDecay, setReverbDecay] = useState(1.5); 
  const [reverbPreDelay, setReverbPreDelay] = useState(0.01);
  const [reverbWetLevel, setReverbWetLevel] = useState(0.5); 
  const [pingPongDelay, setPingPongDelay] = useState(null);
  const [delayTime, setDelayTime] = useState(0.25); 
  const [feedback, setFeedback] = useState(0.5);
  const [wetLevel, setWetLevel] = useState(0.5); 
  const [generatedSequence, setGeneratedSequence] = useState(null);
  const [delayEnabled, setDelayEnabled] = useState(true);
  const [reverbEnabled, setReverbEnabled] = useState(true);
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [analyser, setAnalyser] = useState(null);

  const [ampEnv, setAmpEnv] = useState({
    attack: 0.01,
    decay: 0.2,
    sustain: 0.5,
    release: 1
  });
  const [modEnv, setModEnv] = useState({
    attack: 0.01,
    decay: 0.2,
    sustain: 0.5,
    release: 1
  });
 


  const synthRef = useRef(null);
  const filterRef = useRef(null);
  const pingPongDelayRef = useRef(null);
  const reverbRef = useRef(null);
  const analyserRef = useRef(null);

  // Initialize synth and effects on component mount
  useEffect(() => {
    // Create the synth and effects
    const newSynth = new Tone.PolySynth(Tone.FMSynth, { maxPolyphony: 8 });
    const newFilter = new Tone.Filter();
    const newPingPongDelay = new Tone.PingPongDelay();
    const newReverb = new Tone.Reverb();
    const newAnalyzer = new Tone.Analyser("waveform", 1024);
  
    // Connect the synth to the effects
    newSynth.connect(newPingPongDelay);
    newPingPongDelay.connect(newReverb);
  
    // Finally, connect the last effect to the filter, and the filter to the destination
    newReverb.connect(newFilter);
    newFilter.toDestination();
  
    // Assign the nodes to the refs for later use
    synthRef.current = newSynth;
    filterRef.current = newFilter;
    pingPongDelayRef.current = newPingPongDelay;
    reverbRef.current = newReverb;
    analyserRef.current = newAnalyzer;
    
    setIsInitialized(true);
  
    // Clean up the nodes when the component unmounts
    return () => {
      newSynth.dispose();
      newFilter.dispose();
      newPingPongDelay.dispose();
      newReverb.dispose();
      newAnalyzer.dispose();
    };
  }, []);

  // Update synth parameters based on state changes
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.set({ detune, harmonicity: harmonicity, modulationIndex: modulationIndex, envelope: ampEnv, modulationEnvelope: modEnv,  oscillator: { type: carrierWaveform },
        modulation: { type: modulatorWaveform }});
     
    }
}, [detune, harmonicity, modulationIndex, ampEnv, modEnv, carrierWaveform, modulatorWaveform]);


  useEffect(() => {
    if (pingPongDelayRef.current) {
      pingPongDelayRef.current.delayTime.value = delayTime;
      pingPongDelayRef.current.feedback.value = feedback;
      pingPongDelayRef.current.wet.value = delayEnabled ? wetLevel : 0;
    }
  }, [delayTime, feedback, wetLevel, delayEnabled]);
  
  // Update reverb parameters based on state changes
  useEffect(() => {
    if (reverbRef.current) {
      reverbRef.current.decay = reverbDecay;
      reverbRef.current.preDelay = reverbPreDelay;
      reverbRef.current.wet.value = reverbEnabled ? reverbWetLevel : 0;
    }
  }, [reverbDecay, reverbPreDelay, reverbWetLevel, reverbEnabled]);

  useEffect(() => {
    if (filterRef.current) {
      filterRef.current.type = filterType;
      filterRef.current.frequency.value = filterFrequency;
      filterRef.current.Q.value = filterQ;
      filterRef.current.gain.value = filterGain;
      filterRef.current.rolloff = filterRolloff;
    }
  }, [filterType, filterFrequency, filterQ, filterGain, filterRolloff]);

  // Function to play a note
  const noteMapping = keyboardNoteMapping;
  const playNote = (noteName, isNoteOn) => {
    if (!synthRef.current) return;

    if (isNoteOn) {
      synthRef.current.triggerAttack(noteName);
    } else {
      synthRef.current.triggerRelease(noteName);
    }
  };


  // Function to toggle delay effect
  const toggleDelay = () => {
    setDelayEnabled(!delayEnabled);
    // Additional logic to enable/disable delay effect
    if (pingPongDelayRef.current) {
      pingPongDelayRef.current.wet.value = delayEnabled ? 0 : wetLevel;
    }
  };

  // Function to toggle reverb effect
  const toggleReverb = () => {
    setReverbEnabled(!reverbEnabled);
    // Additional logic to enable/disable reverb effect
    if (reverbRef.current) {
      reverbRef.current.wet.value = reverbEnabled ? 0 : reverbWetLevel;
    }
  };

  // Function to toggle filter effect
  const toggleFilter = () => {
    setFilterEnabled(!filterEnabled);
    // Additional logic to enable/disable filter effect
    if (filterRef.current) {
      filterRef.current.frequency.value = filterEnabled ? 20000 : filterFrequency; // 20,000 Hz is generally above human hearing range
    }
  };



  
  const [playableSequence, setPlayableSequence] = useState([]);

  // Callback function to receive and handle the generated sequence from AIGenerator
  const handleSequenceGenerated = (sequence) => {
    const bpm = 80; // Adjust this as needed
    const stepsPerBeat = 4; // For sixteenth notes
    const secondsPerBeat = 60 / bpm;
    const secondsPerStep = secondsPerBeat / stepsPerBeat;
  
    const convertedSequence = sequence.notes.map((note, index) => {
      return {
        noteName: Tone.Frequency(note.pitch, "midi").toNote(),
        startTime: note.quantizedStartStep * secondsPerStep,
        duration: secondsPerStep // Each note has the duration of one step
      };
    });
  
    setPlayableSequence(convertedSequence);
  };

  const playGeneratedSequence = () => {
    if (!playableSequence.length || !synthRef.current) return;
  
    // Clear the current transport schedule
    Tone.Transport.cancel();
  
    // Calculate the end time of the last note in the sequence for looping
    const loopEndTime = playableSequence[playableSequence.length - 1].startTime + 
                        playableSequence[playableSequence.length - 1].duration;
    
    // Set up looping in Tone.Transport
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = loopEndTime;
  
    // Schedule the notes for playback
    playableSequence.forEach(({ noteName, startTime, duration }) => {
      Tone.Transport.schedule((time) => {
        synthRef.current.triggerAttackRelease(noteName, duration, time);
      }, `+${startTime}`);
    });
  
    // Start Tone.js Transport if it's not already started
    Tone.Transport.start();
  };
  

  const [presetName, setPresetName] = useState('');

  const applyPreset = (presetSettings) => {
    if (presetSettings.harmonicity !== undefined) {
      setHarmonicity(presetSettings.harmonicity);
      if (synthRef.current) {
        synthRef.current.set({ harmonicity: presetSettings.harmonicity });
      }
    }
}

  // Function to save the preset
  const savePreset = async () => {
    if (!isUserLoggedIn) {
      console.error('User must be logged in to save presets');  
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3001/api/users/savePreset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: userId,
          presetName: presetName, // Ensure this is set by the user
          settings: { harmonicity } // Only saving harmonicity for now
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save preset');
      }
  
      console.log('Preset saved successfully');
      // Additional logic after successful save
    } catch (error) {
      console.error('Error saving preset:', error);
    }
  };


  if (!isInitialized) {
    return <div>Loading synthesizer...</div>;
  } 

  return (
    <div>
      <h2>Polyphonic FM Synthesizer</h2>
      <KeyboardMIDIHandler onNotePlayed={playNote} noteMapping={noteMapping}/>
      <Visualizer analyser={analyserRef.current} />
      <RecorderControl synthRef={synthRef} userId={userId}/>
      <Recording userId={userId} nRecordingFinished={handleRecordingFinished}/>
    <PresetMenu userId={userId} isUserLoggedIn={isUserLoggedIn}  onPresetSelected={applyPreset} />
      <div>
        <button onClick={() => playGeneratedSequence(generatedSequence)}>
          Play Generated Sequence
        </button>

         {/* Save Preset Button */}
         <div>
          <input 
            type="text" 
            placeholder="Enter preset name" 
            value={presetName} 
            onChange={(e) => setPresetName(e.target.value)} 
          />
          <button onClick={savePreset}>Save Preset</button>
        </div>

        {/* Include the AIGenerator component to generate the AI sequence */}
        <AIGenerator onSequenceGenerated={handleSequenceGenerated} />
      <button onClick={playGeneratedSequence}>Play Generated Sequence</button>

      {/* Rest of your Synthesizer UI */}
    </div>

    <PingPongDelayControl
        enabled={delayEnabled}
        toggleDelay={toggleDelay}
        delayTime={delayTime}
        setDelayTime={setDelayTime}
        feedback={feedback}
        setFeedback={setFeedback}
        wetLevel={wetLevel}
        setWetLevel={setWetLevel}
      />

      <ReverbControl
        reverbEnabled={reverbEnabled}
        toggleReverb={toggleReverb}
        reverbWetLevel={reverbWetLevel}
        setReverbWetLevel={setReverbWetLevel}
        reverbDecay={reverbDecay}
        setReverbDecay={setReverbDecay}
        reverbPreDelay={reverbPreDelay}
        setReverbPreDelay={setReverbPreDelay}
      />


      <FilterControl     
      filterType={filterType}
      onTypeChange={setFilterType}
      filterFrequency={filterFrequency}
      filterEnabled={setFilterEnabled}
      toggleFilter={toggleFilter}
      onFrequencyChange={setFilterFrequency}
      detune={detune}
      onDetuneChange={setDetune}
      filterGain={filterGain}
      onGainChange={setFilterGain}
      filterRolloff={filterRolloff}
      onRolloffChange={setFilterRolloff}
      filterQ={filterQ}
      onQChange={setFilterQ}/>
  
      {/* Harmonicity Control */}
      <div>
        <label>Harmonicity Ratio: </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={harmonicity}
          onChange={(e) => setHarmonicity(Number(e.target.value))}
        />
      </div>
  
      {/* Modulation Index Control */}
      <div>
        <label>Modulation Index: </label>
        <input
          type="range"
          min="0"
          max="20"
          value={modulationIndex}
          onChange={(e) => setModulationIndex(Number(e.target.value))}
        />
      </div>
  
      {/* Carrier Waveform Selection */}
      <div>
        <label>Carrier Waveform: </label>
        <select
          value={carrierWaveform}
          onChange={(e) => setCarrierWaveform(e.target.value)}
        >
          <option value="sine">Sine</option>
          <option value="square">Square</option>
          <option value="triangle">Triangle</option>
          <option value="sawtooth">Sawtooth</option>
        </select>
      </div>
  
      {/* Modulator Waveform Selection */}
      <div>
        <label>Modulator Waveform: </label>
        <select
          value={modulatorWaveform}
          onChange={(e) => setModulatorWaveform(e.target.value)}
        >
          <option value="sine">Sine</option>
          <option value="square">Square</option>
          <option value="triangle">Triangle</option>
          <option value="sawtooth">Sawtooth</option>
        </select>
      </div>
  
      <div className="envelope-controls">
        <h3>Amplitude Envelope</h3>
        <div>
          <label>Attack: {ampEnv.attack.toFixed(2)}</label>
          <input type="range" min="0" max="1" step="0.01" value={ampEnv.attack} onChange={e => setAmpEnv({...ampEnv, attack: Number(e.target.value)})} />
        </div>
        <div>
          <label>Decay: {ampEnv.decay.toFixed(2)}</label>
          <input type="range" min="0" max="1" step="0.01" value={ampEnv.decay} onChange={e => setAmpEnv({...ampEnv, decay: Number(e.target.value)})} />
        </div>
        <div>
          <label>Sustain: {ampEnv.sustain.toFixed(2)}</label>
          <input type="range" min="0" max="1" step="0.01" value={ampEnv.sustain} onChange={e => setAmpEnv({...ampEnv, sustain: Number(e.target.value)})} />
        </div>
        <div>
          <label>Release: {ampEnv.release.toFixed(2)}</label>
          <input type="range" min="0" max="2" step="0.01" value={ampEnv.release} onChange={e => setAmpEnv({...ampEnv, release: Number(e.target.value)})} />
        </div>
      </div>
  
      <div className="envelope-controls">
        <h3>Modulation Envelope</h3>
        <div>
          <label>Attack: {modEnv.attack.toFixed(2) }</label>
          <input type="range" min="0" max="1" step="0.01" value={modEnv.attack} onChange={e => setModEnv({...modEnv, attack: Number(e.target.value)})} />
        </div>
        <div>
          <label>Decay: {modEnv.decay.toFixed(2)}</label>
          <input type="range" min="0" max="1" step="0.01" value={modEnv.decay} onChange={e => setModEnv({...modEnv, decay: Number(e.target.value)})} />
        </div>
        <div>
          <label>Sustain: {modEnv.sustain.toFixed(2)}</label>
          <input type="range" min="0" max="1" step="0.01" value={modEnv.sustain} onChange={e => setModEnv({...modEnv, sustain: Number(e.target.value)})} />
        </div>
        <div>
          <label>Release: {modEnv.release.toFixed(2)}</label>
          <input type="range" min="0" max="2" step="0.01" value={modEnv.release} onChange={e => setModEnv({...modEnv, release: Number(e.target.value)})} />
        </div>
      </div>
  
      <p>Use your keyboard to play notes! Change octaves with the Up and Down arrows.</p>
      <p>Current Octave: {octave}</p>
    </div>
  );

}

export default Synthesizer;

