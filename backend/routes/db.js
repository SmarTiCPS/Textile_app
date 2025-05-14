const { Client } = require('pg');

const client = new Client({
   user: 'postgres',
    password: 'smartiCPS@2025',
    host: 'localhost',
    port: 5432, // Default PostgreSQL port
    database: 'factory2', 
});

// Connect to database
client.connect()
  .then(() => console.log('Connected to TimescaleDB for factories'))
  .catch(err => console.error('Connection error:', err));

// Create factories table if not exists
const createFactoriesTable = async () => {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS factories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        model_path VARCHAR(255),
        photo VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('Factories table verified/created');
  } catch (err) {
    console.error('Error creating factories table:', err);
  }
};

createFactoriesTable();

module.exports = client;