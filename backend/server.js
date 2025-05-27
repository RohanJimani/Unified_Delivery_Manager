const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRegister = require("./routes/auth"); // Ensure this is correct
const deliveryRoutes = require('./routes/deliveries');
// const authRoute = require("./routes/authLogin");
const historyRoutes = require('./routes/history');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRegister); // Ensure authRoutes is a valid router
app.use("/uploads", express.static("uploads"));
app.use('/api/deliveries', deliveryRoutes); // Register delivery routes here
app.use('/api/history', historyRoutes);

// app.use("/api/authLogin", authRoute);

// Health check
app.get('/', (req, res) => res.send('API running'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));