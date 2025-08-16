const express = require('express');
const cors = require('cors');
const dishRoutes = require('./routes/dishRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/estimate', dishRoutes);
app.use('/estimate/image', imageRoutes);

module.exports = app;