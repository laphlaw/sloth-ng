const express = require('express');
const router = express.Router();
const alarmController = require('../controllers/alarmController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes here are protected
router.use(authMiddleware);

// POST /api/alarms - Create Alarm
router.post('/', alarmController.createAlarm);

// GET /api/alarms - Get All Alarms
router.get('/', alarmController.getAlarms);

// POST /api/alarms/:alarmId/kill - Kill Alarm
router.post('/:alarmId/kill', alarmController.killAlarm);

module.exports = router;
