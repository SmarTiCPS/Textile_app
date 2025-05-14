const express = require('express');
const router = express.Router();
const client = require('./db');

// Create skill
router.post('/', async (req, res) => {
  const { type, description } = req.body;
  
  try {
    const result = await client.query(
      `INSERT INTO skills (type, description)
       VALUES ($1, $2) RETURNING *`,
      [type, description]
    );
    
    res.status(201).json({
      message: "Skill created successfully",
      skill: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating skill" });
  }
});

// Get all skills
router.get('/', async (req, res) => {
  try {
    const result = await client.query(
      'SELECT * FROM skills ORDER BY type'
    );
    
    res.status(200).json({
      message: "Skills fetched successfully",
      skills: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching skills" });
  }
});

// Delete skill
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // First delete from worker_skills
    await client.query('DELETE FROM worker_skills WHERE skill_id = $1', [id]);
    
    // Then delete the skill
    await client.query('DELETE FROM skills WHERE idskill = $1', [id]);
    
    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting skill" });
  }
});

module.exports = router;