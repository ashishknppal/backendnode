const db = require('../db');

// Fetch all users
const getnews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; 

    const offset = (page - 1) * limit;

    const [users] = await db.query(
      'SELECT * FROM news ORDER BY created_on DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) AS total FROM news'
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
    console.error('Error fetching news with pagination:', error.message);
    res.status(500).json({ error: error.message });
  }
};
const getallnews = async (req, res) => {
  try {
   
    const [users] = await db.query(
      'SELECT * FROM news ORDER BY created_on DESC ',
    );
    if (users.length === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json(users);
      }
  } catch (error) {
    // Handle errors
    console.error('Error fetching news with pagination:', error.message);
    res.status(500).json({ error: error.message });
  }
};


const addnews = async (req, res) => {
    const {
      title,
      description,
      doc
    } = req.body;
  
    try {
      const created_on = new Date().toISOString().slice(0, 19).replace('T', ' '); 
  
      const [result] = await db.query(
        `INSERT INTO news 
          (title, description, doc, created_on) 
         VALUES (?, ?, ?, ?)`,
        [
          title,
          description,
          doc,
          created_on
        ]
      );
  
      res.status(201).json({ id: result.insertId, message: 'news added successfully.' });
    } catch (error) {
      console.error('Error inserting news:', error.message);
      res.status(500).json({ error: error.message });
    }
  };

const getFormattedDate = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
// Fetch a user by ID
const getnewsById = async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = await db.query('SELECT * FROM news WHERE id = ?', [id]);
    if (user.length === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(user[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatenews = async (req, res) => {
    const {
      title,
      description,
      doc
    } = req.body;
  
    const { id } = req.params;
  
    try {  
      const [result] = await db.query(
        `UPDATE news 
         SET 
           title = ?, 
           description = ?
           doc = ?
         WHERE id = ?`,
        [
          title,
          description,
          doc,
          id
        ]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'News not found.' });
      }
  
      res.status(200).json({ message: 'News updated successfully.' });
    } catch (error) {
      console.error('Error updating News:', error.message);
      res.status(500).json({ error: error.message });
    }
  };
  // Delete a BOD
const deletenews = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM news WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'news not found' });
    } else {
      res.json({ message: 'news deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// career  code 

const getcareer = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10; 
  
      const offset = (page - 1) * limit;
  
      const [users] = await db.query(
        'SELECT * FROM career ORDER BY created_on DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
  
      const [[{ total }]] = await db.query(
        'SELECT COUNT(*) AS total FROM career'
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
      console.error('Error fetching career with pagination:', error.message);
      res.status(500).json({ error: error.message });
    }
  };
  const getAllcareer = async (req, res) => {
    try {
     
      const [users] = await db.query(
        'SELECT * FROM career ORDER BY created_on DESC ',
      );
      if (users.length === 0) {
          res.status(404).json({ message: 'User not found' });
        } else {
          res.json(users);
        }
    } catch (error) {
      // Handle errors
      console.error('Error fetching career with pagination:', error.message);
      res.status(500).json({ error: error.message });
    }
  };
  
  
  const addcareer = async (req, res) => {
      const {
        title,
        description
      } = req.body;
    
      try {
        const created_on = new Date().toISOString().slice(0, 19).replace('T', ' '); 
    
        const [result] = await db.query(
          `INSERT INTO career 
            (title, description, created_on) 
           VALUES (?, ?, ?)`,
          [
            
            title,
            description,
            created_on
          ]
        );
    
        res.status(201).json({ id: result.insertId, message: 'career added successfully.' });
      } catch (error) {
        console.error('Error inserting career career:', error.message);
        res.status(500).json({ error: error.message });
      }
    };

  // Fetch a user by ID
  const getcareerById = async (req, res) => {
    const { id } = req.params;
    try {
      const [user] = await db.query('SELECT * FROM career WHERE id = ?', [id]);
      if (user.length === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json(user[0]);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const updatecareer = async (req, res) => {
    const {
        
        title,
        description
      } = req.body;
    
      const { id } = req.params;
    
      try {  
        const [result] = await db.query(
          `UPDATE career 
           SET 
             title = ?, 
             description = ?
           WHERE id = ?`,
           [
            
            title,
            description,
            id
          ]
        );
    
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'career not found.' });
        }
    
        res.status(200).json({ message: 'career updated successfully.' });
      } catch (error) {
        console.error('Error updating  career:', error.message);
        res.status(500).json({ error: error.message });
      }
    };
    // Delete a BOD
  const deletecareer = async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await db.query('DELETE FROM career WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ message: ' career not found' });
      } else {
        res.json({ message: 'career deleted successfully' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  
// career  code 

const getinterest = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10; 
  
      const offset = (page - 1) * limit;
  
      const [users] = await db.query(
        'SELECT * FROM rate_interest ORDER BY created_on DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
  
      const [[{ total }]] = await db.query(
        'SELECT COUNT(*) AS total FROM rate_interest'
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
      console.error('Error fetching interest with pagination:', error.message);
      res.status(500).json({ error: error.message });
    }
  };
  const getAllinterest = async (req, res) => {
    try {
     
      const [users] = await db.query(
        'SELECT * FROM rate_interest ORDER BY created_on DESC ',
      );
      if (users.length === 0) {
          res.status(404).json({ message: 'User not found' });
        } else {
          res.json(users);
        }
    } catch (error) {
      // Handle errors
      console.error('Error fetching interest with pagination:', error.message);
      res.status(500).json({ error: error.message });
    }
  };
  
  
  const addinterest = async (req, res) => {
      const {
        title,
        status,
        description
      } = req.body;
    
      try {
        const created_on = new Date().toISOString().slice(0, 19).replace('T', ' '); 
    
        const [result] = await db.query(
          `INSERT INTO rate_interest 
            (title,status, content, created_on) 
           VALUES (?, ?, ?, ?)`,
          [
            
            title,
            status,
            description,
            created_on
          ]
        );
    
        res.status(201).json({ id: result.insertId, message: 'interest added successfully.' });
      } catch (error) {
        console.error('Error inserting interest interest:', error.message);
        res.status(500).json({ error: error.message });
      }
    };

  // Fetch a user by ID
  const getinterestById = async (req, res) => {
    const { id } = req.params;
    try {
      const [user] = await db.query('SELECT * FROM rate_interest WHERE id = ?', [id]);
      if (user.length === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json(user[0]);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const updateinterest = async (req, res) => {
    const {
        
        title,
        description,
        status
      } = req.body;
    
      const { id } = req.params;
    
      try {  
        const [result] = await db.query(
          `UPDATE rate_interest 
           SET 
             title = ?, 
             content = ?, 
             status = ?
           WHERE id = ?`,
           [
             title,
             description,
             status,
             id
           ]
        );
        
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'interest not found.' });
        }
    
        res.status(200).json({ message: 'interest updated successfully.' });
      } catch (error) {
        console.error('Error updating  interest:', error.message);
        res.status(500).json({ error: error.message });
      }
    };
    // Delete a BOD
  const deleteinterest = async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await db.query('DELETE FROM rate_interest WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ message: ' interest not found' });
      } else {
        res.json({ message: 'interest deleted successfully' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
module.exports = { getnews, getallnews, addnews, getnewsById, updatenews, deletenews,getcareer,getAllcareer,getcareerById,addcareer,updatecareer,deletecareer ,getinterest,getAllinterest,getinterestById,addinterest,updateinterest,deleteinterest };
