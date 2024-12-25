const db = require('../db');

// Add a new user
const enquiryRegister = async (req, res) => {
 

  const {
    name,
    email,
    phone,
    loan_type,
    description,
    postcode,
    agree,
  } = req.body;

  try {
    const created_on = getFormattedDate();

    const [result] = await db.query(
      `INSERT INTO enquiry 
        (name, email, phone, loan_type, description, postcode, agree,created_on) 
       VALUES (?, ?, ?, ?, ?, ?, ?,?)`,
      [
        name,
        email,
        phone,
        loan_type,
        description,
        postcode,
        agree,
        created_on
      ]
    );

    res.status(201).json({ id: result.insertId, message: 'Enquiry Register successfully.' });
  } catch (error) {
    console.error('Error inserting enquiry:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const feedbackRegister = async (req, res) => {
 

    const {
      name,
      email,
      phone,
      postcode,
      branch,
      description,
    } = req.body;
  
    try {
      const created_on = getFormattedDate();
  
      const [result] = await db.query(
        `INSERT INTO feedback 
          (name, email, phone, postcode, branch, description,created_on) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          email,
          phone,
          postcode,
          branch,
          description,
          created_on
        ]
      );
  
      res.status(201).json({ id: result.insertId, message: 'Feedback Register successfully.' });
    } catch (error) {
      console.error('Error inserting Feedback:', error.message);
      res.status(500).json({ error: error.message });
    }
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

const getenquiry = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; 

    const offset = (page - 1) * limit;

    const [users] = await db.query(
      'SELECT * FROM enquiry ORDER BY created_on DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) AS total FROM enquiry'
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
    console.error('Error fetching enquiry with pagination:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const getfeedback = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; 

    const offset = (page - 1) * limit;

    const [users] = await db.query(
      'SELECT * FROM feedback ORDER BY created_on DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) AS total FROM feedback'
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
    console.error('Error fetching feedback with pagination:', error.message);
    res.status(500).json({ error: error.message });
  }
};



  module.exports = { enquiryRegister ,feedbackRegister,getfeedback,getenquiry};
