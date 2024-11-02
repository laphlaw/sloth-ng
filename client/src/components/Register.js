// client/src/components/Register.js
import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('/auth/register', {
                username,
                password,
            });
            if (response.status === 201) {
                navigate('/');
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <Container style={{ maxWidth: '400px', marginTop: '50px' }}>
            <h2 className="mb-4">Register</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleRegister}>
                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-4" block>
                    Register
                </Button>
            </Form>
            <div className="mt-3 text-center">
                Already have an account? <Link to="/">Login here</Link>
            </div>
        </Container>
    );
};

export default Register;
