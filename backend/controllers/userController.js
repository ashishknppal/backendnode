const db = require('../db');
const getCounts = async (req, res) => {
  try {
    // Single query to fetch counts from all tables
    const [[counts]] = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM enquiry) AS enquiryCount,
        (SELECT COUNT(*) FROM news) AS newsCount,
        (SELECT COUNT(*) FROM feedback) AS feedbackCount,
        (SELECT COUNT(*) FROM account_open) AS applyForAccountCount
    `);

    // Structure the response
    const response = {
      success: true,
      message: "Counts fetched successfully",
      data: {
        enquiry: counts.enquiryCount,
        news: counts.newsCount,
        feedback: counts.feedbackCount,
        applyForAccount: counts.applyForAccountCount,
      },
    };

    // Send the response
    res.status(200).json(response);
  } catch (error) {
    // Handle errors
    console.error("Error fetching counts:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch counts",
      error: error.message,
    });
  }
};
// Fetch all users
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; 

    const offset = (page - 1) * limit;

    const [users] = await db.query(
      'SELECT * FROM account_open ORDER BY created_on DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) AS total FROM account_open'
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
    console.error('Error fetching users with pagination:', error.message);
    res.status(500).json({ error: error.message });
  }
};


// Add a new user
const addUser = async (req, res) => {
 

  const {
    salutation,
    fname,
    lname,
    email,
    phone,
    account_type,
    branch,
    postcode,
    prefered_language,
    agree,
  } = req.body;

  try {
    const created_on = getFormattedDate();

    const [result] = await db.query(
      `INSERT INTO account_open 
        (salutation, fname, lname, email, phone, account_type, branch, postcode, prefered_language, agree,created_on) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
      [
        salutation,
        fname,
        lname,
        email,
        phone,
        account_type,
        branch,
        postcode,
        prefered_language,
        agree,
        created_on
      ]
    );

    res.status(201).json({ id: result.insertId, message: 'User added successfully.' });
  } catch (error) {
    console.error('Error inserting user:', error.message);
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
// Fetch a user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = await db.query('SELECT * FROM account_open WHERE id = ?', [id]);
    if (user.length === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(user[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user
const updateUser = async (req, res) => {
  const {
    salutation,
    fname,
    lname,
    email,
    phone,
    account_type,
    branch,
    postcode,
    prefered_language,
    agree,
  } = req.body;
  
  const { id } = req.params; 
  
  try {
  
    const [result] = await db.query(
      `UPDATE account_open 
       SET 
         salutation = ?, 
         fname = ?, 
         lname = ?, 
         email = ?, 
         phone = ?, 
         account_type = ?, 
         branch = ?, 
         postcode = ?, 
         prefered_language = ?, 
         agree = ?
       WHERE id = ?`, 
      [
        salutation,
        fname,
        lname,
        email,
        phone,
        account_type,
        branch,
        postcode,
        prefered_language,
        agree,
        id 
      ]
    );
  
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    res.json({ message: 'User updated successfully.' });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: error.message });
  }
  
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM account_open WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json({ message: 'User deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {getCounts, getUsers, addUser, getUserById, updateUser, deleteUser };
