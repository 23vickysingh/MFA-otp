// Import necessary packages
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Loads environment variables from a .env file
const connectDB = require('./config/db');

// Initialize the Express app
const app = express();

// Connect to Database
connectDB();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors());
// Enable the Express app to parse JSON formatted request bodies
app.use(express.json());

// --- API Routes ---
// Define auth routes
app.use('/api/auth', require('./Routes/auth'));

// --- Server Initialization ---
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});