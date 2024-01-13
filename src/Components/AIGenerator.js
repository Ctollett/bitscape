import React, { useState, useEffect } from 'react';
import * as mm from '@magenta/music';
import * as Tone from 'tone';
import KeyboardMIDIHandler, { noteMapping as keyboardNoteMapping } from './KeyboardMIDIHandler';

function AIGenerator({ onSequenceGenerated }) {
    const [isRecording, setIsRecording] = useState(false);
    const [inputNotes, setInputNotes] = useState([]);
    const [generatedSequence, setGeneratedSequence] = useState(null);
    const maxNotes = 5;

    // Converts note name to MIDI number
    const noteMapping = keyboardNoteMapping;

    const noteToMidi = (note) => {
        const notes = Object.values(noteMapping).map(n => n.slice(0, -1));
        const noteName = note.slice(0, -1);
        const keyIndex = notes.indexOf(noteName);
        const octave = parseInt(note.slice(-1));
        return keyIndex >= 0 ? keyIndex + 12 * (octave + 1) : null;
    };

    // Handles note on event  
    const handleNotePlayed = (note, isNoteOn) => {
        console.log(`Note played: ${note}, On: ${isNoteOn}`);
        if (isRecording && isNoteOn && inputNotes.length < maxNotes) {
            setInputNotes(prevNotes => {
                console.log(`Adding note: ${note}`);
                return [...prevNotes, note];
            });
        }   
    };
    

    // Requests MIDI access and sets up event listeners
    useEffect(() => {
        // This effect can be empty if all MIDI handling is done in KeyboardMIDIHandler
    }, [isRecording, inputNotes]);

    // Loads the Magenta MusicRNN model
    const loadModel = async () => {
        const melodyRNN = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn');
        await melodyRNN.initialize();
        return melodyRNN;
    };

    // Generates a sequence based on the input notes
    const generateAISequence = async () => {
  
        if (inputNotes.length > 0) {
            let currentTime = 0;
            let notesForRNN = [];

            // Adjust these values as needed
            const noteDuration = 0.5; // Duration of each note
            const restProbability = 0.3; // Probability of a rest

            for (let i = 0; i < 32; i++) {
                if (Math.random() < restProbability || i >= inputNotes.length) {
                    currentTime += noteDuration;
                } else {
                    const inputNote = inputNotes[i % inputNotes.length];
                    notesForRNN.push({
                        pitch: noteToMidi(inputNote),
                        startTime: currentTime,
                        endTime: currentTime + noteDuration
                    });
                    currentTime += noteDuration;
                }
            }
  
            const quantizedSequence = mm.sequences.quantizeNoteSequence({
                ticksPerQuarter: 220,
                totalTime: currentTime,
                timeSignatures: [{ time: 0, numerator: 4, denominator: 4 }],
                tempos: [{ time: 0, qpm: 120 }],
                notes: notesForRNN
            }, 1);
  
            const melodyRNN = await loadModel();
            try {
                const generated = await melodyRNN.continueSequence(quantizedSequence, 32, 1.3);
    
                setGeneratedSequence(generated);
                onSequenceGenerated(generated);
            } catch (error) {
                console.error('Error generating sequence:', error);
            }
        }
    };

    // Triggers sequence generation when recording stops
    useEffect(() => {
        if (!isRecording && inputNotes.length === maxNotes) {  
            generateAISequence();
        }
    }, [isRecording, inputNotes, onSequenceGenerated]);

    return (
        <div>
            <KeyboardMIDIHandler onNotePlayed={handleNotePlayed} noteMapping={noteMapping}/>
            <button onClick={() => { setIsRecording(true); setInputNotes([]); }}>
                Start Recording
            </button>
            <button onClick={() => { setIsRecording(false); }}>
                Stop Recording
            </button>
            <div>
                <h2>Input Notes</h2>
                <pre>{JSON.stringify(inputNotes, null, 2)}</pre>
            </div>
            {generatedSequence && (
                <div>
                    <h2>Generated Sequence</h2>
                    {/* Display or use the generated sequence */}
                </div>
            )}
        </div>
    );
}

export default AIGenerator;
