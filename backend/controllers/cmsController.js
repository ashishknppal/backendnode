const db = require('../db');

// Fetch all users
const getcms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; 

    const offset = (page - 1) * limit;

    const [users] = await db.query(
      'SELECT * FROM cms ORDER BY created_on DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) AS total FROM cms'
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
    console.error('Error fetching CMS with pagination:', error.message);
    res.status(500).json({ error: error.message });
  }
};
const getallcms = async (req, res) => {
  try {
   
    const [users] = await db.query(
      'SELECT * FROM cms ORDER BY created_on DESC ',
    );
    if (users.length === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json(users);
      }
  } catch (error) {
    // Handle errors
    console.error('Error fetching cms with pagination:', error.message);
    res.status(500).json({ error: error.message });
  }
};


const addcms = async (req, res) => {
    const {
      title,
      getservice,
      status
    } = req.body;
  
    try {
      const created_on = new Date().toISOString().slice(0, 19).replace('T', ' '); 
  
      const [result] = await db.query(
        `INSERT INTO cms 
          (title, service, status, created_on) 
         VALUES (?, ?, ?, ?)`,
        [
          title,
          getservice,
          status,
          created_on
        ]
      );
  
      res.status(201).json({ id: result.insertId, message: 'CMS added successfully.' });
    } catch (error) {
      console.error('Error inserting CMS member:', error.message);
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
const getCMSById = async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = await db.query('SELECT * FROM cms WHERE id = ?', [id]);
    if (user.length === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(user[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCMS = async (req, res) => {
    const {
      title,
      getservice,
      status
    } = req.body;
  
    const { id } = req.params;
  
    try {  
      const [result] = await db.query(
        `UPDATE cms 
         SET 
           title = ?, 
           service = ?, 
           status = ?
         WHERE id = ?`,
        [
          title,
          getservice,
          status,
          id
        ]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'CMS member not found.' });
      }
  
      res.status(200).json({ message: 'CMS member updated successfully.' });
    } catch (error) {
      console.error('Error updating CMS member:', error.message);
      res.status(500).json({ error: error.message });
    }
  };
  // Delete a BOD
const deleteCMS = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM cms WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'CMS not found' });
    } else {
      res.json({ message: 'CMS deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// cms content code 

const getcmsContent = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10; 
  
      const offset = (page - 1) * limit;
  
      const [users] = await db.query(
        'SELECT a.*, b.title AS cms_title FROM content AS a LEFT JOIN cms AS b ON a.content_for = b.id ORDER BY a.created_on DESC LIMIT ? OFFSET ?',[limit, offset]
      );
  
      const [[{ total }]] = await db.query(
        'SELECT COUNT(*) AS total FROM content'
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
      console.error('Error fetching CMS with pagination:', error.message);
      res.status(500).json({ error: error.message });
    }
  };
  const getAllcmsContent = async (req, res) => {
    try {
     
      const [users] = await db.query(
        'SELECT * FROM content ORDER BY created_on DESC ',
      );
      if (users.length === 0) {
          res.status(404).json({ message: 'User not found' });
        } else {
          res.json(users);
        }
    } catch (error) {
      // Handle errors
      console.error('Error fetching content with pagination:', error.message);
      res.status(500).json({ error: error.message });
    }
  };
  
  
  const addcmsContent = async (req, res) => {
      const {
        content_for,
        title,
        status,
        doc,
        description
      } = req.body;
    
      try {
        const created_on = new Date().toISOString().slice(0, 19).replace('T', ' '); 
    
        const [result] = await db.query(
          `INSERT INTO content 
            (content_for,title, status, doc, description, created_on) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            content_for,
            title,
            status,
            doc,
            description,
            created_on
          ]
        );
    
        res.status(201).json({ id: result.insertId, message: 'Content CMS added successfully.' });
      } catch (error) {
        console.error('Error inserting Content CMS:', error.message);
        res.status(500).json({ error: error.message });
      }
    };

  // Fetch a user by ID
  const getcmsContentById = async (req, res) => {
    const { id } = req.params;
    try {
      const [user] = await db.query('SELECT * FROM content WHERE content_for = ?', [id]);
      if (user.length === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json(user);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const updatecmsContent = async (req, res) => {
    const {
        content_for,
        title,
        status,
        doc,
        description
      } = req.body;
    
      const { id } = req.params;
    
      try {  
        const [result] = await db.query(
          `UPDATE content 
           SET 
             content_for = ?,
             title = ?, 
             status = ?,
             doc= ?,
             description = ?
           WHERE id = ?`,
           [
            content_for,
            title,
            status,
            doc,
            description,
            id
          ]
        );
    
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Content CMS not found.' });
        }
    
        res.status(200).json({ message: 'Content CMS updated successfully.' });
      } catch (error) {
        console.error('Error updating Content CMS:', error.message);
        res.status(500).json({ error: error.message });
      }
    };
    // Delete a BOD
  const deletecmsContent = async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await db.query('DELETE FROM content WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Content CMS not found' });
      } else {
        res.json({ message: 'Content CMS deleted successfully' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
module.exports = { getcms, getallcms, addcms, getCMSById, updateCMS, deleteCMS,getcmsContent,getAllcmsContent,getcmsContentById,addcmsContent,updatecmsContent,deletecmsContent };
