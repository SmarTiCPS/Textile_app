const express = require('express');
const bcrypt = require('bcrypt');
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { Client } = require('pg');

// Configure your TimescaleDB/PostgreSQL connection
const client = new Client({           
    user: 'smarticps',
    password: 'smartiCPS2025@',
    host: '4.233.148.211',
    port: 64321, // Default PostgreSQL port
    database: 'smartmanufacturer',     
});


const sqlRouter = express.Router();
sqlRouter.post("/signupuser", async (req, res) => {
    try {
        const { firstname,secondname,email,password,telnumber } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user into TimescaleDB
        const result = await client.query(
            "INSERT INTO users (firstname,secondname,email,password,telnumber ) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [firstname,secondname,email,hashedPassword,telnumber ]
        );

        res.status(201).json({
            message: "User created successfully",
            user: result.rows[0] // Returns the inserted user record
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creating user" });
    }
});
sqlRouter.get('/usersql', async (req, res, next) => {
    try {
        // Execute SQL query
        const result = await client.query('SELECT * FROM users');
        
        //console.log(result.rows); // PostgreSQL returns data in .rows
        
        res.status(200).json({
            message: 'event type fetched successfully',
            posts: result.rows
        });
        
    } catch (err) {
        next(err); // Pass errors to error-handling middleware
    }
});

module.exports = sqlRouter;
