const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

// Replace with your MongoDB URI
const mongoURI = "mongodb+srv://coltontollett96:1996alan@bitscape.h2ceska.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());

// User routes
app.use('/api/users', require('../Routes/userRoutes'));

app.listen(port, () => console.log(`Server running on port ${port}`));


