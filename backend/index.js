const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes'); 
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Link user routes
app.use('/api', userRoutes);

// Example base route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
