require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const { protect } = require('./middleware/authMiddleware');




app.use(express.json());


connectDB();

// Routes
// Test protected route
app.get('/api/protected', protect, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, you are authorized!` });
});

app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('VaultDesk backend is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});