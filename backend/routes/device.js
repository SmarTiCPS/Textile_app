const client = require('./db');
const express = require('express');
const router = express.Router();


// Create device
router.post('/', async (req, res) => {
  const { name, location, type, factory_id } = req.body;
  
  try {
    const result = await client.query(
      `INSERT INTO device (name, location, type, factory_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, location, type, factory_id]
    );
    
    res.status(201).json({
      message: "Device created successfully",
      device: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating device" });
  }
});

// Get all factories
router.get('/', async (req, res) => {
  try {
    const result = await client.query(
      'SELECT * FROM device ORDER BY type DESC'
    );
    
    res.status(200).json({
      message: "devices fetched successfully",
      devices: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching devices" });
  }
});

// Delete factory
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await client.query('DELETE FROM device WHERE id = $1', [id]);
    
    res.status(200).json({ message: "Device deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting device" });
  }
});
// Add these routes to your device backend file

// Get all attributes
router.get('/attributes', async (req, res) => {
    try {
      const result = await client.query(
        'SELECT * FROM attributes ORDER BY attribute'
      );
      res.status(200).json({
        message : "devices fetched successfully",
        attributes : result.rows ,
    });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching attributes" });
    }
  });
  
// Add this new route to your device backend file
router.post('/:deviceId/attributes', async (req, res) => {
    const { deviceId } = req.params;
    const { attributeIds } = req.body;
    
    try {
      // First delete any existing attributes for this device
      await client.query('DELETE FROM device_attributes WHERE iddevice = $1', [Number(deviceId)]);
      
      // Then insert the new attributes
      if (attributeIds && attributeIds.length > 0) {
        const values = attributeIds.map((attrId, index) => 
          `($${index * 2 + 1}, $${index * 2 + 2})`
        ).join(', ');
        
        const params = attributeIds.flatMap(attrId => [Number(deviceId), Number(attrId)]);
        
        await client.query(
          `INSERT INTO device_attributes (iddevice, idattribute)
           VALUES ${values}`,
          params
        );
      }
      
      res.status(201).json({
        message: "Device attributes updated successfully"
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating device attributes" });
    }
  });


  router.get("/historicdevicedata/:startDate/:endDate/:idattribute", async (req, res, next) => {
    try {
        const { startDate, endDate , idattribute } = req.params;
       
        // Validate dates
        if (!startDate || !endDate) {
            return res.status(400).json({ error: "Both start and end dates are required" });
        }

        // Convert to Date objects and add 1 day to endDate to include full end day
        const start = new Date(startDate);
        const end = new Date(endDate);
        //end.setDate(end.getDate() + 1);
       // console.log(start , end , idtype) ;
        const result = await client.query(`
            SELECT 
                d.name,
                d.location,
                e.timestamp,
                e.value
            FROM events e
            INNER JOIN device d ON e.iddevice = d.id
            WHERE e.timestamp >= $1 AND e.timestamp < $2 AND $3 = e.idattribute
            ORDER BY e.timestamp
        `, [start, end, idattribute]);
        //console.log(result.rows); // PostgreSQL returns data in .rows

        res.status(200).json({
            message: 'Data fetched successfully',
            sensorData: result.rows
        });
        
    } catch (err) {
        next(err);
    }
});

module.exports = router;