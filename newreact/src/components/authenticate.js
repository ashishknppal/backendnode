import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
    console.log(isAuthenticated);
    console.log(children);
    if (!isAuthenticated) {
        return <Navigate to="/" replace />; 
    }
    return children; 
    console.log("ashish");
};

export default ProtectedRoute;
