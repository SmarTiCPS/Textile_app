// backend/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const factoryRoute = require('./routes/factory');
const deviceRoute = require('./routes/device');
const attributeRoute = require('./routes/attribute');
const workerRoute = require('./routes/workers');
const skillRoute = require('./routes/skills');

// Initialize Express app
const app = express();






const client = new Client({
   user: 'postgres',
    password: 'smartiCPS@2025',
    host: 'localhost',
    port: 5432, // Default PostgreSQL port
    database: 'factory2', 
});


// Connect to database
client.connect()
    .then(() => console.log('Connected to TimescaleDB'))
    .catch(err => console.error('Connection error:', err.stack));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
// Add this basic test route in your server.js
app.get('/api', (req, res) => {
  res.json({ status: 'API working', timestamp: new Date() });
});

// Serve static Angular files
const angularDistPath = path.join(__dirname, '../dist/Spike');
app.use(express.static(angularDistPath));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/assets/images/users'); // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ 
        path: '/src/assets/images/users/' + req.file.filename 
    });
});

app.post("/api/signupuser", async (req, res) => {
    try {
        const { firstname, secondname, email, password, addresses, birthday, telnumber, photo } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await client.query(
            "INSERT INTO users (first_name, second_name, email, password, address, birthday, phone, photo,active,type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10) RETURNING *",
            [firstname, secondname, email, hashedPassword, addresses, birthday, telnumber, photo,0,'USER']
        );

        res.status(201).json({
            message: "User created successfully",
            user: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creating user" });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const userQuery = await client.query(
            'SELECT * FROM users WHERE email = $1', 
            [req.body.email]
        );
        
        if (userQuery.rows.length === 0) {
            return res.status(401).json({ message: "Auth failed!" });
        }
        
        const fetchedUser = userQuery.rows[0];
        const passwordMatch = await bcrypt.compare(req.body.password, fetchedUser.password);
        
        if (!passwordMatch) {
            return res.status(401).json({ message: "Auth failed!" });
        }
        
        const token = jwt.sign(
            { email: fetchedUser.email, userId: fetchedUser.id },
            'secret_thisshould_be_longer',
            { expiresIn: "1h" }
        );
        
        res.status(200).json({ token: token });
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Auth failed!" });
    }
});

// Factory routes
// Routes
app.use('/api/factories', factoryRoute);

///device routes // Get all devices
app.use('/api/devices', deviceRoute);
///attribute routes // Get all

app.use('/api/attributes', attributeRoute);

  
// Worker routes
app.use('/api/workers', workerRoute);
// Skill routes
app.use('/api/skills', skillRoute);

app.get('/api/tables', async (req, res) => {
    try {
      // Query to get all table names in the current database
      const result = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      `);
  
      res.status(200).json({
        tables: result.rows.map(row => row.table_name)
      });
    } catch (err) {
      console.error('Error fetching tables:', err);
      res.status(500).json({ error: 'Failed to retrieve table list' });
    }
  });

// All other routes return Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(angularDistPath, 'index.html'));
});
module.exports = app;