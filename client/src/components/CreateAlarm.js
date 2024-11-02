// client/src/components/CreateAlarm.js
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import authService from '../services/authService';

const CreateAlarm = ({ onAlarmCreated }) => {
    const [time, setTime] = useState('');
    const [gpsLat, setGpsLat] = useState('');
    const [gpsLng, setGpsLng] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleCreateAlarm = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await axios.post(
                '/api/alarms',
                {
                    time,
                    gps_lat: parseFloat(gpsLat),
                    gps_lng: parseFloat(gpsLng),
                },
                {
                    headers: {
                        Authorization: `Bearer ${authService.getToken()}`,
                    },
                }
            );
            if (response.status === 201) {
                setSuccess('Alarm created successfully.');
                onAlarmCreated({
                    id: response.data.alarm_id,
                    time,
                    gps_lat: parseFloat(gpsLat),
                    gps_lng: parseFloat(gpsLng),
                });
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError('Failed to create alarm.');
            }
        }
    };

    return (
        <>
            <h3>Create a New Alarm</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleCreateAlarm}>
                <Form.Group controlId="formAlarmTime">
                    <Form.Label>Alarm Time</Form.Label>
                    <Form.Control
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formGpsLat" className="mt-3">
                    <Form.Label>GPS Latitude</Form.Label>
                    <Form.Control
                        type="number"
                        step="any"
                        placeholder="Enter latitude"
                        value={gpsLat}
                        onChange={(e) => setGpsLat(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formGpsLng" className="mt-3">
                    <Form.Label>GPS Longitude</Form.Label>
                    <Form.Control
                        type="number"
                        step="any"
                        placeholder="Enter longitude"
                        value={gpsLng}
                        onChange={(e) => setGpsLng(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-4">
                    Create Alarm
                </Button>
            </Form>
        </>
    );
};

export default CreateAlarm;
