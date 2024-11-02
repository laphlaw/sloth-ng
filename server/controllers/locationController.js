const Location = require('../models/Location');

// Create a new location
exports.createLocation = async (req, res) => {
    const { name, gps_lat, gps_lng } = req.body;

    // Basic validation
    if (!name || gps_lat === undefined || gps_lng === undefined) {
        return res.status(400).json({ message: 'Name, GPS latitude, and GPS longitude are required.' });
    }

    try {
        const newLocation = new Location({
            name,
            gpsLat: gps_lat,
            gpsLng: gps_lng,
            user: req.user._id,
        });

        await newLocation.save();

        // Optionally, add location to user's locations array
        req.user.locations.push(newLocation._id);
        await req.user.save();

        res.status(201).json({ message: 'Location saved successfully.', location_id: newLocation._id });
    } catch (err) {
        console.error('Create Location Error:', err.message);
        res.status(500).json({ message: 'Server error while creating location.' });
    }
};

// Get all locations for the authenticated user
exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.find({ user: req.user._id }).sort({ createdAt: -1 });

        const locationsList = locations.map(loc => ({
            id: loc._id,
            name: loc.name,
            gps_lat: loc.gpsLat,
            gps_lng: loc.gpsLng,
            created_at: loc.createdAt,
        }));

        res.status(200).json({ locations: locationsList });
    } catch (err) {
        console.error('Get Locations Error:', err.message);
        res.status(500).json({ message: 'Server error while fetching locations.' });
    }
};

// Delete a location
exports.deleteLocation = async (req, res) => {
    const { locationId } = req.params;

    try {
        const location = await Location.findOne({ _id: locationId, user: req.user._id });

        if (!location) {
            return res.status(404).json({ message: 'Location not found.' });
        }

        await location.remove();

        res.status(200).json({ message: 'Location deleted successfully.' });
    } catch (err) {
        console.error('Delete Location Error:', err.message);
        res.status(500).json({ message: 'Server error while deleting location.' });
    }
};
