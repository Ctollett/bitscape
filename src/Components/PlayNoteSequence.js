// Assuming you have a synth set up with Tone.js
import { Synth } from 'tone';

function playNoteSequence(noteSequence) {
  const synth = new Synth().toDestination();

  // Assuming a tempo of 120 BPM and 4 steps per quarter note
  const secondsPerStep = 60 / 120 / 4;

  noteSequence.notes.forEach(note => {
    const noteName = Tone.Frequency(note.pitch, "midi").toNote();
    const startTime = note.quantizedStartStep * secondsPerStep;
    const endTime = note.quantizedEndStep * secondsPerStep;

    // Schedule the note
    synth.triggerAttackRelease(noteName, endTime - startTime, startTime);
  });
}

// Call this function when you want to play the sequence
playNoteSequence(yourNoteSequence);
