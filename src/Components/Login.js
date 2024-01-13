import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null); // Define loggedInUser state

  const loginUser = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to login');
  
      localStorage.setItem('token', data.token);
      const decoded = jwtDecode(data.token);
      const loggedInUserId = decoded.user.id;
      
      // Move the onLogin call here
      onLogin(loggedInUserId); // Call the onLogin prop function with the user ID  
    } catch (error) {
      console.error('Login Error:', error);
      // Handle the error (e.g., show an error message)
      throw error; // Rethrow the error for the Home component to handle
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call loginUser with the provided username and password.
      // loginUser will handle calling onLogin with the correct user ID.
      await loginUser(username, password);
    } catch (error) {
      // Handle the error (e.g., show an error message)
      console.error('Login Error:', error);
    }
  };
  

  return (
    <div>
      {loggedInUser ? (
        <div>Hello, user {loggedInUser}</div>  
      ) : (
        <form onSubmit={handleSubmit}>  
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
}

export default Login;




