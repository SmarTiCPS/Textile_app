const client = require('./db');
const upload = require('./fileUpload');
const express = require('express');
const router = express.Router();

// Photo upload endpoint
router.post('/upload/photo', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ path: `assets/images/factories/photo/${req.file.filename}` });
});

// Model upload endpoint
router.post('/upload/model', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ path: `assets/images/factories/model/${req.file.filename}` });
});

// Create factory
router.post('/', async (req, res) => {
  const { name, address, model_path, photo } = req.body;
  
  try {
    const result = await client.query(
      `INSERT INTO factories (name, address, model_path, photo)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, address, model_path, photo]
    );
    
    res.status(201).json({
      message: "Factory created successfully",
      factory: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating factory" });
  }
});

// Get all factories
router.get('/', async (req, res) => {
  try {
    const result = await client.query(
      'SELECT * FROM factories ORDER BY created_at DESC'
    );
    
    res.status(200).json({
      message: "Factories fetched successfully",
      factories: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching factories" });
  }
});

// Delete factory
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await client.query('DELETE FROM factories WHERE id = $1', [id]);
    res.status(200).json({ message: "Factory deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting factory" });
  }
});

module.exports = router;