const express = require('express');
const router = express.Router();
const client = require('./db');

// Create worker
router.post('/', async (req, res) => {
  const { first_name, second_name, email, phone_number, address, birthday } = req.body;
  
  try {
    const result = await client.query(
      `INSERT INTO workers (first_name, second_name, email, phone_number, address, birthday)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [first_name, second_name, email, phone_number, address, birthday]
    );
    
    res.status(201).json({
      message: "Worker created successfully",
      worker: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating worker" });
  }
});

// Get all workers with their skills
router.get('/', async (req, res) => {
  try {
    const workersResult = await client.query(
      'SELECT * FROM workers ORDER BY first_name, second_name'
    );
    
    // Get skills for each worker
    const workersWithSkills = await Promise.all(workersResult.rows.map(async (worker) => {
      const skillsResult = await client.query(
        `SELECT s.* FROM skills s
         JOIN worker_skills ws ON s.idskill = ws.skill_id
         WHERE ws.worker_id = $1`,
        [worker.id]
      );
      
      return {
        ...worker,
        skills: skillsResult.rows
      };
    }));
    
    res.status(200).json({
      message: "Workers fetched successfully",
      workers: workersWithSkills
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching workers" });
  }
});

// Update worker
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, second_name, email, phone_number, address, birthday } = req.body;
  
  try {
    const result = await client.query(
      `UPDATE workers 
       SET first_name = $1, second_name = $2, email = $3, 
           phone_number = $4, address = $5, birthday = $6
       WHERE id = $7 RETURNING *`,
      [first_name, second_name, email, phone_number, address, birthday, id]
    );
    
    res.status(200).json({
      message: "Worker updated successfully",
      worker: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating worker" });
  }
});

// Delete worker
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // First delete worker skills
    await client.query('DELETE FROM worker_skills WHERE worker_id = $1', [id]);
    
    // Then delete the worker
    await client.query('DELETE FROM workers WHERE id = $1', [id]);
    
    res.status(200).json({ message: "Worker deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting worker" });
  }
});

// Add/Update worker skills
router.post('/:workerId/skills', async (req, res) => {
  const { workerId } = req.params;
  const { skillIds } = req.body;
  console.log(workerId)
  try {
    // First delete any existing skills for this worker
    await client.query('DELETE FROM worker_skills WHERE worker_id = $1', [workerId]);
    
    // Then insert the new skills
    if (skillIds && skillIds.length > 0) {
      const values = skillIds.map((skillId, index) => 
        `($${index * 2 + 1}, $${index * 2 + 2})`
      ).join(', ');
      
      const params = skillIds.flatMap(skillId => [workerId, skillId]);
      
      await client.query(
        `INSERT INTO worker_skills (worker_id, skill_id)
         VALUES ${values}`,
        params
      );
    }
    
    res.status(201).json({
      message: "Worker skills updated successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating worker skills" });
  }
});

module.exports = router;