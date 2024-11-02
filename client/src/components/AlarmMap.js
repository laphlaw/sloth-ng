// client/src/components/AlarmMap.js
import React, { useState } from 'react';
import { Button, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import authService from '../services/authService';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fixing the default icon issue with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const AlarmMap = ({ alarm, onAlarmKilled }) => {
    const [error, setError] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

    const handleKillAlarm = async () => {
        setError('');
        try {
            const response = await axios.post(`/api/alarms/${alarm.id}/kill`, {}, {
                headers: {
                    Authorization: `Bearer ${authService.getToken()}`,
                },
            });
            if (response.status === 200) {
                onAlarmKilled();
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError('Failed to kill alarm.');
            }
        }
    };

    return (
        <>
            <h3>Your Alarm Location</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <MapContainer
                center={[alarm.gps_lat, alarm.gps_lng]}
                zoom={13}
                style={{ height: '400px', width: '100%', marginTop: '20px' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[alarm.gps_lat, alarm.gps_lng]}>
                    <Popup>
                        Alarm Location: ({alarm.gps_lat}, {alarm.gps_lng})
                    </Popup>
                </Marker>
            </MapContainer>
            <Button
                variant="danger"
                className="mt-3"
                onClick={() => setShowConfirm(true)}
            >
                Kill Alarm
            </Button>

            {/* Confirmation Modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Kill Alarm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to kill this alarm?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleKillAlarm}>
                        Kill Alarm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AlarmMap;
