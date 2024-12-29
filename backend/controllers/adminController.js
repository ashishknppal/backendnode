const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const fs = require('fs');
// const path = require('path');
// const { upload } = require('./uploadConfig');

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

    const { email } = decoded ; 

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

// const uploadFile = async (req, res) => {
//   try {
//     // Middleware to handle the file upload
//     const singleUpload = upload.single('file');
//     singleUpload(req, res, (err) => {
//       if (err) {
//         return res.status(400).send({ error: err.message });
//       }

//       if (!req.file) {
//         return res.status(400).send({ error: 'No file uploaded' });
//       }

//       // Define the target directory and file path
//       const targetDirectory = 'uploads/';
//       const targetPath = path.join(targetDirectory, req.file.filename);

//       // Ensure the target directory exists
//       if (!fs.existsSync(targetDirectory)) {
//         fs.mkdirSync(targetDirectory, { recursive: true });
//       }

//       // Move the file from the temp directory to the target directory
//       const tempPath = req.file.path;
//       fs.rename(tempPath, targetPath, (error) => {
//         if (error) {
//           return res.status(500).send({ error: 'Error moving file' });
//         }

//         // Respond with file details and its new path
//         res.status(200).send({
//           message: 'File uploaded and moved successfully',
//           fileDetails: {
//             originalName: req.file.originalname,
//             storageName: req.file.filename,
//             path: targetPath,
//             size: req.file.size,
//           },
//         });
//       });
//     });
//   } catch (error) {
//     res.status(500).send({ error: 'Internal server error' });
//   }
// };

// module.exports = { adminLogin ,logout,getAdminDetails,uploadFile};
module.exports = { adminLogin ,logout,getAdminDetails};
