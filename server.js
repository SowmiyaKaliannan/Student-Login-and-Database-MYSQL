const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json()); // Use express.json() for parsing JSON bodies

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'studentdb',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit if the database connection fails
  }
  console.log('Connected to the database.');
});

// User Signup
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const checkUserSql = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUserSql, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const insertSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(insertSql, [username, password], (err) => {
      if (err) {
        console.error('Error creating user:', err);
        return res.status(500).json({ error: 'Error creating user' });
      }
      res.status(200).json({ message: 'Signup successful!' });
    });
  });
});

// User Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0 || results[0].password !== password) {
      return res.status(401).json({ authorized: false, error: 'Invalid credentials' });
    }

    res.status(200).json({ authorized: true });
  });
});

// Fetch Students
app.get('/students', (req, res) => {
  const sql = 'SELECT * FROM studentinfo';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching students:', err);
      return res.status(500).json({ error: 'Error fetching students' });
    }
    res.status(200).json(results);
  });
});

// Add Student
app.post('/students', (req, res) => {
  const { name, rollNumber, department, phoneNumber, address } = req.body;

  if (!name || !rollNumber || !department || !phoneNumber || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'INSERT INTO studentinfo (name, rollNumber, department, phoneNumber, address) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, rollNumber, department, phoneNumber, address], (err) => {
    if (err) {
      console.error('Error adding student:', err);
      return res.status(500).json({ error: 'Error adding student' });
    }
    res.status(201).json({ message: 'Student added successfully' });
  });
});
app.put('/students/:id', (req, res) => {
  const { id } = req.params;
  const { name, rollNumber, department, phoneNumber, address } = req.body;

  // Validate inputs
  if (!name || !rollNumber || !department || !phoneNumber || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `
    UPDATE studentinfo 
    SET name = ?, rollNumber = ?, department = ?, phoneNumber = ?, address = ? 
    WHERE id = ?
  `;

  db.query(sql, [name, rollNumber, department, phoneNumber, address, id], (err, result) => {
    if (err) {
      console.error('Error updating student:', err);
      return res.status(500).json({ error: 'Error updating student' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ message: 'Student updated successfully' });
  });
});


// Delete Student
app.delete('/students/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM studentinfo WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Error deleting student:', err);
      return res.status(500).json({ error: 'Error deleting student' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  });
});

// Server Listener
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});