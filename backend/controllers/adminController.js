const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const tokenBlacklist = new Set();
// Admin login logic
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if admin exists
    const [admins] = await db.query('SELECT * FROM admin WHERE email = ?', [email]);
    if (admins.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = admins[0];

    // Compare passwords
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Original Password:', password);
    console.log('Hashed Password:', hashedPassword);
    const isMatch = await bcrypt.compare(password, admin.admin_password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful',response:{
      token:token,
      user:admin
     } });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
const getAdminDetails = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { email } = decoded ; // Extract admin ID from the token

    // Fetch admin details from the database
    const [admins] = await db.query('SELECT admin_id,admin_username,email,admin_status FROM admin WHERE email = ?', [email]);

    if (admins.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admins[0]); 
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


const logout = (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(400).json({ message: 'Token not provided' });
    }

    const jwtPayload = jwt.decode(token);

    if (!jwtPayload || !jwtPayload.exp) {
      return res.status(401).json({ message: 'Invalid or malformed token' });
    }

    const isExpired = Date.now() >= jwtPayload.exp * 1000;
    if (isExpired) {
      return res.status(401).json({ message: 'Token already expired' });
    }

    tokenBlacklist.add(token);

    setTimeout(() => tokenBlacklist.delete(token), jwtPayload.exp * 1000 - Date.now());

    return res.json({ message: 'Logout successful' });
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token or already expired',
      error: error.message,
    });
  }
};




module.exports = { adminLogin ,logout,getAdminDetails};
