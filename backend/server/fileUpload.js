// server/fileUpload.js

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });




router.post('/upload-audio', upload.single('audioFile'), (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, `./uploads/${req.file.originalname}`);

    fs.rename(tempPath, targetPath, err => {
        if (err) return res.status(500).send(err);
        res.status(200).send('Audio file uploaded and moved!');
    });
});


module.exports = router;
