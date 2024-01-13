import React, { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';

// Define RecorderControl component
const RecorderControl = ({ onRecordingFinished, userId }) => {
    console.log('userId in RecorderControl:', userId);
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);

  // Initialize the recorder
  useEffect(() => {
    recorderRef.current = new Tone.Recorder();
    const synth = new Tone.Synth().toDestination();
    synth.connect(recorderRef.current);

    return () => {
      recorderRef.current.dispose();
      synth.dispose();
    };
  }, []);

  const startRecording = async () => {
    await Tone.start();
    recorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    const recordingBuffer = await recorderRef.current.stop();
    setIsRecording(false);

    const audioBlob = new Blob([recordingBuffer], { type: 'audio/wav' });
    onRecordingFinished(audioBlob);
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop and Save Recording
      </button>
    </div>
  );
};

// Define Recording component
const Recording = ({userId}) => {
  const [recordedAudio, setRecordedAudio] = useState(null);

  const handleRecordingFinished = (audioBlob) => {
    setRecordedAudio(audioBlob);
    console.log(recordedAudio instanceof Blob); // Should output true if it's a Blob


    // Here, you can send the audioBlob to your backend for storage
    // Replace 'YOUR_BACKEND_UPLOAD_ENDPOINT' with the actual URL to your backend endpoint
    const formData = new FormData();
    formData.append('audioFile', audioBlob);

    fetch(`http://localhost:3001/api/users/uploadRecording?userId=${userId}`, {
  method: 'POST',  
  body: formData,
})
      .then((response) => {
        if (response.ok) {
          // Handle success (e.g., show a success message)
          console.log('Audio recording uploaded successfully.');
        } else {
          // Handle errors (e.g., show an error message)
          console.error('Failed to upload audio recording.');
        }
      })
      .catch((error) => {
        // Handle network errors
        console.error('Network error:', error);
      });
  };

  return (
    <div>
      {recordedAudio && (
        <div>
          <p>Recorded Audio:</p>
          <audio controls>
            <source src={URL.createObjectURL(recordedAudio)} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <RecorderControl onRecordingFinished={handleRecordingFinished} />
    </div>
  );
};

export default Recording;

