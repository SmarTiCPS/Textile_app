const client = require('./db');
const express = require('express');
const router = express.Router();


// Create device
router.post('/', async (req, res) => {
  const {attribute , unit} = req.body;
  
  try {
    const result = await client.query(
      `INSERT INTO attributes (attribute , unit)
       VALUES ($1, $2) RETURNING *`,
      [attribute , unit]
    );
    
    res.status(201).json({
      message: "attribute created successfully",
      attribute: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating attribute" });
  }
});

// Get all factories
router.get('/', async (req, res) => {
  try {
    const result = await client.query(
      'SELECT * FROM attributes ORDER BY attribute DESC'
    );
    
    res.status(200).json({
      message: "attribute fetched successfully",
      attributes: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching attribute" });
  }
});

// Delete factory
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await client.query('DELETE FROM device_attributes WHERE iddevice = $1', [id]);
    res.status(200).json({ message: "device attributes deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting device attributes" });
  }
});
// Add these routes to your device backend file

module.exports = router;