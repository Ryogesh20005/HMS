import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './dashboards/AdminDashboard';
import DoctorDashboard from './dashboards/DoctorDashboard';
import PatientDashboard from './dashboards/PatientDashboard';
import './styles/auth.css';
//  import './styles/dashboard.css';
//  import './styles/glassmorphism.css';
//  import './styles/animations.css';
//  import './styles/buttons.css';
//  import './styles/gradients.css';
//  import './styles/dashboardlayout.css';
// import './styles/forms.css';
const PrivateRoute = ({ children, requiredRole }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (token && user) {
            setIsAuthenticated(true);
            setUserRole(user.role);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    if (isAuthenticated === null) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/login" />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/admin/dashboard/*"
                    element={
                        <PrivateRoute requiredRole="admin">
                            <AdminDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/doctor/dashboard/*"
                    element={
                        <PrivateRoute requiredRole="doctor">
                            <DoctorDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/patient/dashboard/*"
                    element={
                        <PrivateRoute requiredRole="patient">
                            <PatientDashboard />
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
