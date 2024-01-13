import React, { useState, useEffect } from 'react';
import Synthesizer from './Components/Synthesizer';
import SignUp from './Components/SignUp';
import Login from './Components/Login';

function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleUserLogin = (loggedInUserId) => {
    console.log('handleUserLogin function called');
    console.log('User logged in with userId:', loggedInUserId);
    setIsUserLoggedIn(true);
    setUserId(loggedInUserId);
  };

  useEffect(() => {
    // This effect will run when isUserLoggedIn or userId changes
    console.log('isUserLoggedIn:', isUserLoggedIn);
    console.log('userId:', userId);
  }, [isUserLoggedIn, userId]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);  
  };

  return (
    <div className="App">
      <h1>Synthesizer App</h1>
      <button onClick={togglePlay}>
        {isPlaying ? 'Stop Synth' : 'Start Synth'}
      </button>
      <Synthesizer isUserLoggedIn={isUserLoggedIn} userId={userId} />
      {<SignUp />}
      {<Login onLogin={handleUserLogin} />}
    </div>
  );
}

export default Home;




   