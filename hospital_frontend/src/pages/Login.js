import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { authService } from '../services/api';
import '../styles/auth.css';
const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
        const loginData = { username: formData.username, password: formData.password };
        const response = await authService.login(loginData);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            
            // Redirect based on role
            const role = response.data.user.role;
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else if (role === 'doctor') {
                navigate('/doctor/dashboard');
            } else if (role === 'patient') {
                // Patient role: verify email/phone, OTP, and set password
                try {
                    await api.post('/patient-login/', {
                        emailOrPhone: emailOrPhone,
                        otp: otp,
                        password: newPassword,
                    });
                    // After successful verification, navigate to patient dashboard
                    navigate('/patient/dashboard');
                } catch (patientErr) {
                    const patientErrorMsg = patientErr.response?.data?.detail || 'Patient verification failed.';
                    setError(patientErrorMsg);
                }
            } else {
                navigate('/patient/dashboard');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Login failed. Please try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>🏥 CHOLAN HOSPITAL</h1>
                    <p>Welcome back! Please enter your details.</p>
                </div>
                
                {error && <div className="alert alert-error">{error}</div>}
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="e.g. johndoe"
                            autoComplete="username"
                        />
                    </div>
                    
                <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                autoComplete="current-password"
            />
        </div>
        <div className="form-group">
            <label htmlFor="emailOrPhone">Email or Phone</label>
            <input
                type="text"
                id="emailOrPhone"
                name="emailOrPhone"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
                placeholder="e.g. email@example.com or 1234567890"
            />
        </div>
        <div className="form-group">
            <label htmlFor="otp">OTP</label>
            <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter OTP"
            />
        </div>
        <div className="form-group">
            <label htmlFor="newPassword">Create Password</label>
            <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Set your password"
            />
        </div>
                    
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>New here? <Link to="/register">Create an account</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
