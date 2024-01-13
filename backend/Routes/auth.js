// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import your User model

// Route to handle user signup
// Route to handle user signup
router.post('/api/signup', async (req, res) => {
    try {
      console.log('Received a POST request to /api/signup'); // Log that the route is being called
      // Extract user data from the request body (e.g., username and password)
      const { username, password } = req.body;
  
      // Check if the user already exists (you can use your User model for this)
      const existingUser = await User.findOne({ username });
      console.log('Existing user:', existingUser); // Log the existing user (for debugging)
  
      if (existingUser) {
        console.log('User already exists'); // Log that the user exists
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      // ... (continue logging as needed)
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  

module.exports = router;

  