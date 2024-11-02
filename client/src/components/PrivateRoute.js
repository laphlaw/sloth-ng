// client/src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const PrivateRoute = ({ children }) => {
    return authService.isAuthenticated() ? children : <Navigate to="/" />;
};

export default PrivateRoute;
