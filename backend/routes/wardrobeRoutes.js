const express = require('express');
const router = express.Router();
const { askStylistWithImage, upload } = require("../controllers/visionController");

router.post('/ask', upload.single("image"), askStylistWithImage);

module.exports = router;