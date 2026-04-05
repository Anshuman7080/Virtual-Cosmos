// server.js
const mongoose = require("mongoose");

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { initSocket } = require('./socket/index');
const apiRoutes = require('./routes/api');
const database = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Create HTTP server
const server = http.createServer(app);

// Initialize socket.io
initSocket(server);

// Connect to database

database();


    // Start server only after DB connection
    server.listen(PORT, () => {
      console.log(`[Server] Running on http://localhost:${PORT}`);
    });