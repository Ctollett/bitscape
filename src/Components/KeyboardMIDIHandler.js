import React, { useState, useEffect, useRef } from 'react';

export const noteMapping = {
    'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#', 'd': 'E',
    'f': 'F', 't': 'F#', 'g': 'G', 'y': 'G#', 'h': 'A',
    'u': 'A#', 'j': 'B', 'k': 'C' // Add more mappings as needed
};

function getNoteName(midiNumber) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNumber / 12) - 1;
    const noteIndex = midiNumber % 12;
    return notes[noteIndex] + octave;
}

function KeyboardMIDIHandler({ onNotePlayed, noteMapping }) {
    const [octave, setOctave] = useState(4); // Default octave
    const activeKeys = useRef(new Set()); // Ref to track active keys for keyboard events
    const activeMidiNotes = useRef(new Set()); // Ref to track active MIDI notes

    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase();
            console.log(`Key down: ${key}`);
            if (activeKeys.current.has(key)) return; // Ignore if key is already active
            activeKeys.current.add(key);

            if (key === 'arrowup') {
                setOctave(oct => Math.min(oct + 1, 8)); 
            } else if (key === 'arrowdown') {
                setOctave(oct => Math.max(oct - 1, 1)); 
            } else {
                const noteBase = noteMapping[key];
                if (noteBase) {
                    const fullNote = `${noteBase}${octave}`;
                    onNotePlayed(fullNote, true); // true for note on
                }
            }
        };

        const handleKeyUp = (event) => {
            const key = event.key.toLowerCase();
            activeKeys.current.delete(key);
            console.log(`Key up: ${key}`);
            const noteBase = noteMapping[key];
            if (noteBase) {
                const fullNote = `${noteBase}${octave}`;
                onNotePlayed(fullNote, false); // false for note off
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // MIDI event handling
        const handleMIDIMessage = (event) => {
            const [command, note, velocity] = event.data;
            const noteName = getNoteName(note);

            if (command === 144 && velocity > 0) { // Note on
                if (!activeMidiNotes.current.has(note)) {
                    activeMidiNotes.current.add(note);
                    onNotePlayed(noteName, true);
                }
            } else if (command === 128 || (command === 144 && velocity === 0)) { // Note off
                if (activeMidiNotes.current.has(note)) {
                    activeMidiNotes.current.delete(note);
                    onNotePlayed(noteName, false);
                }
            }
        };

        // Request MIDI Access  
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(midiAccess => {
                for (let input of midiAccess.inputs.values()) {
                    input.onmidimessage = handleMIDIMessage;
                }
            });
        }

        // Cleanup
        return () => {  
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (navigator.requestMIDIAccess) {
                navigator.requestMIDIAccess().then(midiAccess => {
                    for (let input of midiAccess.inputs.values()) {
                        input.onmidimessage = null;
                    }
                });
            }
        };
    }, [onNotePlayed, octave]);

    return null; // This component does not render anything
}

export default KeyboardMIDIHandler;
