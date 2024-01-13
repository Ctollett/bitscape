const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const presetSchema = require('../models/Preset')
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ msg: 'User created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  } 
});

// Login Route
const JWT_SECRET = process.env.JWT_SECRET || 'my_test_jwt_secret';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {  
    // Find the user by username
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // User is authenticated, create and send JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token, msg: 'Logged in successfully' }); // Send token to client
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
// Assuming this is in your 'userRoutes.js' or similar file

router.post('/savePreset', auth, async (req, res) => {
    const { userId, presetName, settings } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    
      const newPreset = { name: presetName, settings };
      user.presets.push(newPreset);
      await user.save();
  
      res.status(201).json({ message: 'Preset saved', preset: newPreset });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error saving preset' });
    }
  });

  router.post('/uploadRecording', auth, async (req, res) => {
    const { userId, recordingData } = req.body;
  
    try {
      // Find the user by their user ID  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Add the recording data to the user's recordings array
      user.recordings.push(recordingData);
  
      // Save the updated user object
      await user.save();
  
      res.status(201).json({ message: 'Recording uploaded successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error uploading recording' });
    }
  });

  // Retrieve all presets for a specific user
router.get('/getPresets', auth, async (req, res) => {
    const { userId } = req.query;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the presets array as the response
        res.json(user.presets);
    } catch (error) {
        console.error(error);  
        res.status(500).json({ message: 'Error fetching presets' });
    }
});

  
  
  module.exports = router;
    

module.exports = router;

