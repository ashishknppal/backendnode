const db = require('../db');
const multer = require('multer');
const path = require('path');
// Fetch all users
const getbod = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; 

    const offset = (page - 1) * limit;

    const [users] = await db.query(
      'SELECT * FROM bod ORDER BY created_on DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) AS total FROM bod'
    );

    // Prepare the response
    const response = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      data: users,
    };

    // Send the paginated response
    res.json(response);
  } catch (error) {
    // Handle errors
    console.error('Error fetching BOD with pagination:', error.message);
    res.status(500).json({ error: error.message });
  }
};
const getallbod = async (req, res) => {
  try {
   
    const [users] = await db.query(
      'SELECT * FROM bod ORDER BY created_on DESC ',
    );
    if (users.length === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json(users);
      }
  } catch (error) {
    // Handle errors
    console.error('Error fetching BOD with pagination:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../upload/bod/");
        cb(null, uploadPath); // Ensure this folder exists
      },
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
      ];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type"));
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  }).single("Image");

const addBOD = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    const {
      name,
      designation,
      Address,
      office_number,
      Residence_Number,
      Background,
      status,
    } = req.body;
  
    try {

      const Image = req.file ? 'upload/bod/'+req.file.filename : '';
      const created_on = new Date().toISOString().slice(0, 19).replace('T', ' '); 
  
      const [result] = await db.query(
        `INSERT INTO bod 
          (name, designation, address, office, residence, background, status, image, created_on) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          designation,
          Address,
          office_number,
          Residence_Number?Residence_Number:'',
          Background?Background:'',
          status,
          Image?Image:'',
          created_on
        ]
      );
  
      res.status(201).json({ id: result.insertId, message: 'BOD member added successfully.' });
    } catch (error) {
      console.error('Error inserting BOD member:', error.message);
      res.status(500).json({ error: error.message });
    }
  });
  };

const getFormattedDate = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
// Fetch a user by ID
const getBODById = async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = await db.query('SELECT * FROM bod WHERE id = ?', [id]);
    if (user.length === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(user[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBOD = async (req, res) => {
  upload(req, res, async (err) => {
   
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    const {
      name,
      designation,
      Address,
      office_number,
      Residence_Number,
      Background,
      status,
    } = req.body;
    try {

      const Image = req.file ? 'upload/bod/'+req.file.filename : null;
      const { id } = req.params;
      const updated_on = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
      const [result] = await db.query(
        `UPDATE bod 
         SET 
           name = ?, 
           designation = ?, 
           address = ?, 
           office = ?, 
           residence = ?, 
           background = ?, 
           status = ?, 
           image = ? 
         WHERE id = ?`,
        [
          name,
          designation,
          Address,
          office_number,
          Residence_Number?Residence_Number:'',
          Background?Background:'',
          status,
          Image?Image:'',
          id
        ]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'BOD member not found.' });
      }
  
      res.status(200).json({ message: 'BOD updated successfully.' });
    } catch (error) {
      console.error('Error updating BOD member:', error.message);
      res.status(500).json({ error: error.message });
    }
  });
  };
  // Delete a BOD
const deleteBOD = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM bod WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'BOD not found' });
    } else {
      res.json({ message: 'BOD deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getbankprocessor = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; 

    const offset = (page - 1) * limit;

    const [users] = await db.query(
      'SELECT * FROM bank_progress ORDER BY created_on DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) AS total FROM bank_progress'
    );

    // Prepare the response
    const response = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      data: users,
    };

    // Send the paginated response
    res.json(response);
  } catch (error) {
    // Handle errors
    console.error('Error fetching Bank Proccess with pagination:', error.message);
    res.status(500).json({ error: error.message });
  }
};
const getallbankprocessor = async (req, res) => {
  try {
   
    const [users] = await db.query(
      'SELECT * FROM bank_progress ORDER BY created_on DESC ',
    );
    if (users.length === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json(users);
      }
  } catch (error) {
    // Handle errors
    console.error('Error fetching bank Progress with pagination:', error.message);
    res.status(500).json({ error: error.message });
  }
};


const addbankprocessor = async (req, res) => {
    const {
      year, share_capital, ro_funds, working_funds, investments, net_pro,total_deposits,current_deposits,saving_deposits,term_deposits,loan_advances, status
    } = req.body;
  
    try {
      const created_on = new Date().toISOString().slice(0, 19).replace('T', ' '); 
  
      const [result] = await db.query(
        `INSERT INTO bank_progress 
          (year, share_capital, ro_funds, working_funds, investments, net_pro,total_deposits,current_deposits,saving_deposits,term_deposits,loan_advances, status, created_on) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          year, share_capital, ro_funds, working_funds, investments, net_pro,total_deposits,current_deposits,saving_deposits,term_deposits,loan_advances, status, created_on
        ]
      );
  
      res.status(201).json({ id: result.insertId, message: 'Bank Proccess added successfully.' });
    } catch (error) {
      console.error('Error inserting BOD member:', error.message);
      res.status(500).json({ error: error.message });
    }
  };

// Fetch a user by ID
const getbankprocessorById = async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = await db.query('SELECT * FROM bank_progress WHERE id = ?', [id]);
    if (user.length === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(user[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatebankprocessor = async (req, res) => {
    const {
      year, share_capital, ro_funds, working_funds, investments, net_pro,total_deposits,current_deposits,saving_deposits,term_deposits,loan_advances, status
    } = req.body;
  
    const { id } = req.params;
  
    try {
      const updated_on = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
      const [result] = await db.query(
        `UPDATE bank_progress 
         SET 
           year = ?, 
           share_capital = ?, 
           ro_funds = ?, 
           working_funds = ?, 
           investments = ?, 
           net_pro = ?, 
           total_deposits = ?, 
           current_deposits = ?, 
           saving_deposits = ?, 
           term_deposits = ?, 
           loan_advances = ?, 
           status = ?
         WHERE id = ?`,
        [
          year,
          share_capital,
          ro_funds, 
          working_funds, 
          investments, 
          net_pro, 
          total_deposits, 
          current_deposits, 
          saving_deposits, 
          term_deposits, 
          loan_advances, 
          status, 
          id
        ]
      );
      
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Bank Proccess not found.' });
      }
  
      res.status(200).json({ message: 'Bank Proccess updated successfully.' });
    } catch (error) {
      console.error('Error updating Bank Proccess:', error.message);
      res.status(500).json({ error: error.message });
    }
  };
  // Delete a BOD
const deletebankprocessor = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM bank_progress WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'BOD not found' });
    } else {
      res.json({ message: 'Bank Proccess deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { getbod,getallbod, addBOD, getBODById, updateBOD, deleteBOD,getbankprocessor,getallbankprocessor, addbankprocessor, getbankprocessorById, updatebankprocessor, deletebankprocessor };
