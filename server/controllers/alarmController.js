const Alarm = require('../models/Alarm');

// Create a new alarm
exports.createAlarm = async (req, res) => {
    const { time, gps_lat, gps_lng } = req.body;

    // Basic validation
    if (!time || gps_lat === undefined || gps_lng === undefined) {
        return res.status(400).json({ message: 'Time, GPS latitude, and GPS longitude are required.' });
    }

    try {
        const newAlarm = new Alarm({
            time,
            gpsLat: gps_lat,
            gpsLng: gps_lng,
            user: req.user._id,
        });

        await newAlarm.save();

        // Optionally, add alarm to user's alarms array
        req.user.alarms.push(newAlarm._id);
        await req.user.save();

        res.status(201).json({ message: 'Alarm created successfully.', alarm_id: newAlarm._id });
    } catch (err) {
        console.error('Create Alarm Error:', err.message);
        res.status(500).json({ message: 'Server error while creating alarm.' });
    }
};

// Get all alarms for the authenticated user
exports.getAlarms = async (req, res) => {
    try {
        const alarms = await Alarm.find({ user: req.user._id }).sort({ createdAt: -1 });

        const alarmsList = alarms.map(alarm => ({
            id: alarm._id,
            time: alarm.time,
            is_active: alarm.isActive,
            gps_lat: alarm.gpsLat,
            gps_lng: alarm.gpsLng,
            created_at: alarm.createdAt,
        }));

        res.status(200).json({ alarms: alarmsList });
    } catch (err) {
        console.error('Get Alarms Error:', err.message);
        res.status(500).json({ message: 'Server error while fetching alarms.' });
    }
};

// Kill (deactivate) an alarm
exports.killAlarm = async (req, res) => {
    const { alarmId } = req.params;

    try {
        const alarm = await Alarm.findOne({ _id: alarmId, user: req.user._id });

        if (!alarm) {
            return res.status(404).json({ message: 'Alarm not found.' });
        }

        alarm.isActive = false;
        await alarm.save();

        res.status(200).json({ message: 'Alarm killed successfully.' });
    } catch (err) {
        console.error('Kill Alarm Error:', err.message);
        res.status(500).json({ message: 'Server error while killing alarm.' });
    }
};
