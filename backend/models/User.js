const mongoose = require('mongoose');

const PresetSchema = new mongoose.Schema({
  name: String,
  settings: {
    harmonicity: Number, // Add other parameters as you expand
    // ...
  }
});

const RecordingSchema = new mongoose.Schema({
  filename: String,  // Store the filename or unique identifier of the recording
  data: Buffer,       // Store the binary audio data as a Buffer
  mimeType: String,  // Store the MIME type of the audio (e.g., 'audio/wav')
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  presets: [PresetSchema],
  recordings: [RecordingSchema]
});

module.exports = mongoose.model('User', userSchema);

     