// src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./utils/db');
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);

module.exports = { app, sequelize };
