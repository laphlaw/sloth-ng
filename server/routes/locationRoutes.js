const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes here are protected
router.use(authMiddleware);

// POST /api/locations - Create Location
router.post('/', locationController.createLocation);

// GET /api/locations - Get All Locations
router.get('/', locationController.getLocations);

// DELETE /api/locations/:locationId - Delete Location
router.delete('/:locationId', locationController.deleteLocation);

module.exports = router;
