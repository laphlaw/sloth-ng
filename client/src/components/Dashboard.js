// client/src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Button, Container, Navbar, Nav, Alert } from 'react-bootstrap';
import axios from 'axios';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import CreateAlarm from './CreateAlarm';
import AlarmMap from './AlarmMap';
import '../App.css'; // Corrected path to App.css

const Dashboard = () => {
    const [alarm, setAlarm] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchAlarms = async () => {
        try {
            const response = await axios.get('/api/alarms', {
                headers: {
                    Authorization: `Bearer ${authService.getToken()}`,
                },
            });
            if (response.status === 200) {
                if (response.data.alarms.length > 0) {
                    // Assuming the latest alarm is the first in the array
                    setAlarm(response.data.alarms[0]);
                } else {
                    setAlarm(null);
                }
            }
        } catch (err) {
            setError('Failed to fetch alarms.');
        }
    };

    useEffect(() => {
        fetchAlarms();
        // eslint-disable-next-line
    }, []);

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const handleAlarmCreated = (newAlarm) => {
        setAlarm(newAlarm);
    };

    const handleAlarmKilled = () => {
        setAlarm(null);
        fetchAlarms();
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand>Sloth Dashboard</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Button variant="outline-light" onClick={handleLogout}>
                                Logout
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container style={{ marginTop: '50px', textAlign: 'center' }}>
                {error && <Alert variant="danger">{error}</Alert>}
                {!alarm ? (
                    <CreateAlarm onAlarmCreated={handleAlarmCreated} />
                ) : (
                    <AlarmMap alarm={alarm} onAlarmKilled={handleAlarmKilled} />
                )}
            </Container>
        </>
    );
};

export default Dashboard;
