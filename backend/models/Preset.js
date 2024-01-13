const mongoose = require('mongoose');

const PresetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parameters: {
    octave: Number,
    harmonicity: Number,
    filterType: String,
    filterFrequency: Number,
    filterGain: Number,
    // ... include all other parameters as per your frontend
  },
  // Include any other fields you might need (e.g., userId for user-specific presets)
});

module.exports = PresetSchema;
  