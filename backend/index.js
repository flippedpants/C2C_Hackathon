const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config();

const stylistRoutes = require('./routes/stylistRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/stylist', stylistRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})