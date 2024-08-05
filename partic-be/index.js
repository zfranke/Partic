const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Configure CORS options using FRONTEND_URL from .env
// const corsOptions = {
//   origin: process.env.FRONTEND_URL,
//   methods: 'GET,POST,PUT,DELETE',
//   allowedHeaders: 'Content-Type,Authorization',
// };

// Enable CORS with configured options
app.use(cors());
app.use(bodyParser.json());

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10, // Adjust this based on your requirements
  queueLimit: 0,
});

// API Endpoint to Register User
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  console.log("Register request received:", username);

  // Check if the username is already taken
  const checkUsernameSql = 'SELECT * FROM users WHERE username = ?';
  pool.query(checkUsernameSql, [username], (err, rows) => {
    if (err) {
      console.error('Error checking username:', err);
      res.status(500).json({ error: 'Error checking username' });
      return;
    }

    // If username already exists, return an error
    if (rows.length > 0) {
      console.log('Username already taken:', username);
      res.status(400).json({ error: 'Username already taken' });
      return;
    }

    // Hash the password using bcryptjs
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, passwordHash) => {
      if (err) {
        console.error('Error hashing password:', err);
        res.status(500).json({ error: 'Error registering user' });
        return;
      }

      // Insert user into the database
      const insertUserSql = 'INSERT INTO users (username, passwordHash) VALUES (?, ?)';
      pool.query(insertUserSql, [username, passwordHash], (err, result) => {
        if (err) {
          console.error('Error registering user:', err);
          res.status(500).json({ error: 'Error registering user' });
        } else {
          console.log('User registered successfully:', username);
          
          // User registered; generate and send JWT
          const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Set token expiration
          });

          res.status(200).json({ token });
        }
      });
    });
  });
});


// API Endpoint to Authenticate and Get JWT
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  console.log("Login recorded" );

  // Retrieve user from the database based on username
  const getUserQuery = 'SELECT * FROM users WHERE username = ?';

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting database connection:', err);
      res.status(500).json({ error: 'Error getting database connection' });
      return;
    }

    connection.query(getUserQuery, [username], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error retrieving user:', err);
        res.status(500).json({ error: 'Error retrieving user' });
        return;
      }

      // Check if user exists and password matches
      const user = results[0];
      if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }

      // User authenticated; generate and send JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Set token expiration
      });

      res.status(200).json({ token });
    });
  });
});

// Middleware to check if the token is valid
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  console.log("Token: " + token);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

//Basic GET request to validate the server is online
app.get('/api/online', (req, res) => {
  res.status(200).json({ message: 'Backend Server is online' });
});

//Basic Get to check if the database is online
app.get('/api/db-online', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting database connection:', err);
      res.status(500).json({ error: 'Error getting database connection' });
      return;
    }
    res.status(200).json({ message: 'Database is online' });
    connection.release();
  });
});


/**
 * Application Middleware
 *
 * 1. Get a parking ticket
 * 2. Exit a parking ticket
 * 3. Pay for a parking ticket
 * 4. Get all parking tickets (Protected with authentication)
 * 5. Delete a parking ticket (Protected with authentication)
 */

// API Endpoint to Get a Parking Ticket and send it to the user and db
app.get('/api/get-parkingTicket', (req, res) => {
  const ticketNumber = Math.floor(Math.random() * 1000000);
  const entryTime = new Date().toLocaleString();

  console.log("Ticket Number: " + ticketNumber);
  console.log("Entry Time: " + entryTime);

  // Insert the ticket into the database
  const sql = 'INSERT INTO parkingtickets (ticketNumber, entryTime) VALUES (?, ?)';
  pool.query(sql, [ticketNumber, entryTime], (err, result) => {
    if (err) {
      console.error('Error inserting parking ticket:', err);
      res.status(500).json({ error: 'Error inserting parking ticket' });
    } else {
      console.log('Parking ticket inserted:', result);
      res.status(200).json({ ticketNumber, entryTime });
    }
  });
});


// API Endpoint to Exit a Parking Ticket and calculate the cost
app.post('/api/exit-parkingTicket', (req, res) => {
  const { ticketNumber } = req.body;
  const exitTime = new Date();

  // Retrieve the ticket from the database
  const sql = 'SELECT * FROM parkingtickets WHERE ticketNumber = ?';
  pool.query(sql, [ticketNumber], (err, results) => {
    if (err) {
      console.error('Error retrieving parking ticket:', err);
      return res.status(500).json({ error: 'Error retrieving parking ticket' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Parking ticket not found' });
    }

    const ticket = results[0];

    if (ticket.isExited) {
      // If the ticket has already exited, return the existing data
      return res.status(200).json({
        ticketNumber: ticket.ticketNumber,
        entryTime: ticket.entryTime,
        exitTime: ticket.exitTime,
        cost: ticket.cost,
        paymentStatus: ticket.paymentStatus,
        isExited: ticket.isExited,
      });
    }

    const entryTime = new Date(ticket.entryTime);

    // Calculate the cost based on entry time and exit time
    const diff = exitTime - entryTime;
    const hours = Math.ceil(diff / (1000 * 60 * 60)); // Ensure at least 1 hour is charged
    const cost = hours * parseFloat(process.env.REACT_APP_HOURLY_RATE);

    // Update the ticket with the exit time, cost, and set isExited to true
    const updateSql = 'UPDATE parkingtickets SET exitTime = ?, cost = ?, paymentStatus = ?, isExited = ? WHERE ticketNumber = ?';
    pool.query(updateSql, [exitTime.toISOString(), cost, false, true, ticketNumber], (updateErr) => {
      if (updateErr) {
        console.error('Error updating parking ticket:', updateErr);
        return res.status(500).json({ error: 'Error updating parking ticket' });
      }

      res.status(200).json({
        ticketNumber,
        entryTime: ticket.entryTime,
        exitTime: exitTime.toISOString(),
        cost,
        paymentStatus: false,
        isExited: true,
      });
    });
  });
});

// API Endpoint to Pay for a Parking Ticket
app.post('/api/pay-parkingTicket', (req, res) => {
  const { amount, ticketNumber } = req.body;

  // Retrieve the ticket from the database
  const sql = 'SELECT * FROM parkingtickets WHERE ticketNumber = ?';
  pool.query(sql, [ticketNumber], (err, results) => {
    if (err) {
      console.error('Error retrieving parking ticket:', err);
      return res.status(500).json({ error: 'Error retrieving parking ticket' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Parking ticket not found' });
    }

    const ticket = results[0];

    // Calculate the new balance
    let newBalance = ticket.cost - amount;

    if (newBalance < 0) {
      newBalance = 0;
    }

    // Update the ticket with the new balance and payment status
    const updateSql = 'UPDATE parkingtickets SET balance = ?, paymentStatus = ? WHERE ticketNumber = ?';
    pool.query(updateSql, [newBalance, newBalance === 0, ticketNumber], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating parking ticket:', updateErr);
        return res.status(500).json({ error: 'Error updating parking ticket' });
      }

      res.status(200).json({ ticketNumber, balance: newBalance });
    });
  });
});

// API Endpoint to Get All Parking Tickets (Protected with authentication)
app.get('/api/get-tickets', authenticateToken, (req, res) => {
  const sql = 'SELECT * FROM parkingtickets';

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting database connection:', err);
      res.status(500).json({ error: 'Error getting database connection' });
      return;
    }

    // Execute the query
    connection.query(sql, (err, results) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error fetching parking tickets:', err);
        res.status(500).json({ error: 'Error fetching parking tickets' });
      } else {
        console.log('Parking tickets fetched:', results);
        res.status(200).json(results);
      }
    });
  });
});

// API Endpoint to Delete Parking Ticket (Protected with authentication)
app.delete('/api/delete-ticket/:ticketNumber', authenticateToken, (req, res) => {
  const ticketId = req.params.id;
  const sql = 'DELETE FROM parkingtickets WHERE ticketNumber = ?';

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting database connection:', err);
      res.status(500).json({ error: 'Error getting database connection' });
      return;
    }

    // Execute the query
    connection.query(sql, [ticketId], (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error deleting parking ticket:', err);
        res.status(500).json({ error: 'Error deleting parking ticket' });
      } else {
        console.log('Parking ticket deleted:', result);
        res.status(200).json({ message: 'Parking ticket deleted successfully' });
      }
    });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
