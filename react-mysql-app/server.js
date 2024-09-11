// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');

// const app = express();
// const PORT = 5000;

// // ใช้ CORS เพื่อให้ API ใช้งานได้กับ Frontend
// app.use(cors());

// // สร้างการเชื่อมต่อกับฐานข้อมูล MySQL
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '', // ใส่รหัสผ่านของ MySQL
//   database: 'menudb'
// });

// // เช็คการเชื่อมต่อกับฐานข้อมูล
// db.connect((err) => {
//   if (err) {
//     console.log('Error connecting to MySQL:', err);
//   } else {
//     console.log('Connected to MySQL');
//   }
// });

// // สุ่มเมนูจากตาราง menus
// app.get('/api/menus/random', (req, res) => {
//   const sql = 'SELECT * FROM menus ';
//   db.query(sql, (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.json(result[0]); // ส่งเมนูที่สุ่มได้กลับไปที่ frontend
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// const app = express();

// app.use(cors());
// app.use(express.json()); // To parse JSON requests

// // Create MySQL connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'menuDB' // Use your database name here
// });

// // Connect to MySQL
// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     return;
//   }
//   console.log('Connected to MySQL');
// });

// // Fetch all menu items
// app.get('/api/menus', (req, res) => {
//   const sql = 'SELECT * FROM menus';
//   db.query(sql, (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.json(result);
//   });
// });

// // Add a new menu item
// app.post('/api/menus', (req, res) => {
//   const { name } = req.body;
//   const sql = 'INSERT INTO menus (name) VALUES (?)';
//   db.query(sql, [name], (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.status(201).json({ id: result.insertId, name }); // Return the inserted item
//   });
// });

// // Delete a menu item by id
// app.delete('/api/menus/:id', (req, res) => {
//   const { id } = req.params;
//   const sql = 'DELETE FROM menus WHERE id = ?';
//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.json({ message: 'Menu item deleted' });
//   });
// });

// // Start the server
// app.listen(5000, () => {
//   console.log('Server running on port 5000');
// });

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});
const upload = multer({ storage: storage });

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'menudb'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// API route to get all menu items
app.get('/api/menus', (req, res) => {
  const query = 'SELECT * FROM menus';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// API route to add a new menu item with image
app.post('/api/menus', upload.single('image'), (req, res) => {
  const { name } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Save image URL
  const query = 'INSERT INTO menus (name, image_url) VALUES (?, ?)';
  
  db.query(query, [name, imageUrl], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ id: result.insertId, name, image_url: imageUrl });
  });
});

// API route to delete a menu item by ID
app.delete('/api/menus/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM menus WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ message: 'Menu item deleted' });
  });
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
