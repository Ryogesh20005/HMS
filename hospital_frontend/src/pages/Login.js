import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { authService } from '../services/api';
import '../styles/auth.css';
const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
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
            const response = await authService.login(formData);
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
