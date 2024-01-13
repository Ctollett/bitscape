import React, { useEffect, useState } from 'react';

function MIDIController({ onMIDIMessage, onMIDIConnection }) {
  useEffect(() => {
    // Function to handle new MIDI messages
    const handleMIDIMessage = (event) => {
      if (onMIDIMessage) {
        onMIDIMessage(event);
      }
    };

    // Function to handle MIDI connection changes
    const handleMIDIConnection = (event) => {
      if (onMIDIConnection) {
        onMIDIConnection(event);
      }
    };

    // Function to set up MIDI access
    const setupMIDI = async () => {
      if (navigator.requestMIDIAccess) {
        try {
          const midiAccess = await navigator.requestMIDIAccess();
          midiAccess.onstatechange = handleMIDIConnection;

          for (let input of midiAccess.inputs.values()) {
            input.onmidimessage = handleMIDIMessage;
          }
        } catch (error) {
          console.error('Error accessing MIDI devices:', error);
        }
      } else {
        console.log('Web MIDI API not supported.');
      }
    };

    setupMIDI();

    // Clean up
    return () => {
      // Implement cleanup for MIDI connections if needed
    };
  }, []);

  return null; // This component does not render anything
}

export default MIDIController;

