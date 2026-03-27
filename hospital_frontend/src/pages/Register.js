import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import '../styles/auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('patient');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
    });
    const [doctorData, setDoctorData] = useState({
        specialization: 'general',
        license_number: '',
        qualification: '',
        years_of_experience: 0,
        consultation_fee: 500,
    });
    const [patientData, setPatientData] = useState({
        date_of_birth: '',
        blood_group: '',
        allergies: '',
        medical_history: '',
        emergency_contact: '',
        emergency_contact_name: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDoctorDataChange = (e) => {
        const { name, value } = e.target;
        setDoctorData({ ...doctorData, [name]: value });
    };

    const handlePatientDataChange = (e) => {
        const { name, value } = e.target;
        setPatientData({ ...patientData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const registrationData = {
                ...formData,
                role,
                ...(role === 'doctor' && doctorData),
                ...(role === 'patient' && patientData),
            };
            
            const response = await authService.register(registrationData);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            navigate(role === 'admin' ? '/admin/dashboard' : role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
        } catch (err) {
            console.error('Registration error:', err);
            const errorMsg = err.response?.data?.detail || 
                           err.response?.data?.message ||
                           JSON.stringify(err.response?.data) || 
                           'Registration failed. Please try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card register-card">
                <div className="auth-header">
                    <h1>🏥 Hospital Management System</h1>
                    <p>Create your account</p>
                </div>
                
                {error && <div className="alert alert-error">{error}</div>}
                
                <div className="role-selector">
                    <label>I am a:</label>
                    <div className="role-buttons">
                        <button
                            type="button"
                            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                            onClick={() => setRole('admin')}
                        >
                            🔐 Admin
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${role === 'patient' ? 'active' : ''}`}
                            onClick={() => setRole('patient')}
                        >
                            👤 Patient
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${role === 'doctor' ? 'active' : ''}`}
                            onClick={() => setRole('doctor')}
                        >
                            👨‍⚕️ Doctor
                        </button>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="first_name">First Name</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                placeholder="First name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="last_name">Last Name</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                placeholder="Last name"
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Choose a username"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your@email.com"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone number"
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
                            placeholder="Enter a strong password"
                        />
                    </div>
                    
                    {role === 'patient' && (
                        <>
                            <hr />
                            <h3>Medical Information (Optional)</h3>
                            
                            <div className="form-group">
                                <label htmlFor="date_of_birth">Date of Birth</label>
                                <input
                                    type="date"
                                    id="date_of_birth"
                                    name="date_of_birth"
                                    value={patientData.date_of_birth}
                                    onChange={handlePatientDataChange}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="blood_group">Blood Group</label>
                                <select
                                    id="blood_group"
                                    name="blood_group"
                                    value={patientData.blood_group}
                                    onChange={handlePatientDataChange}
                                >
                                    <option value="">Select Blood Group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="allergies">Allergies</label>
                                <textarea
                                    id="allergies"
                                    name="allergies"
                                    value={patientData.allergies}
                                    onChange={handlePatientDataChange}
                                    placeholder="List any allergies (optional)"
                                    rows="2"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="medical_history">Medical History</label>
                                <textarea
                                    id="medical_history"
                                    name="medical_history"
                                    value={patientData.medical_history}
                                    onChange={handlePatientDataChange}
                                    placeholder="Brief medical history (optional)"
                                    rows="3"
                                />
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="emergency_contact_name">Emergency Contact Name</label>
                                    <input
                                        type="text"
                                        id="emergency_contact_name"
                                        name="emergency_contact_name"
                                        value={patientData.emergency_contact_name}
                                        onChange={handlePatientDataChange}
                                        placeholder="Emergency contact name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="emergency_contact">Emergency Contact Phone</label>
                                    <input
                                        type="tel"
                                        id="emergency_contact"
                                        name="emergency_contact"
                                        value={patientData.emergency_contact}
                                        onChange={handlePatientDataChange}
                                        placeholder="Emergency contact phone"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    
                    {role === 'doctor' && (
                        <>
                            <hr />
                            <h3>Professional Information</h3>
                            
                            <div className="form-group">
                                <label htmlFor="specialization">Specialization</label>
                                <select
                                    id="specialization"
                                    name="specialization"
                                    value={doctorData.specialization}
                                    onChange={handleDoctorDataChange}
                                >
                                    <option value="general">General Medicine</option>
                                    <option value="cardiology">Cardiology</option>
                                    <option value="dermatology">Dermatology</option>
                                    <option value="neurology">Neurology</option>
                                    <option value="orthopedics">Orthopedics</option>
                                    <option value="pediatrics">Pediatrics</option>
                                    <option value="psychiatry">Psychiatry</option>
                                    <option value="surgery">Surgery</option>
                                    <option value="gynecology">Gynecology</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="license_number">License Number</label>
                                <input
                                    type="text"
                                    id="license_number"
                                    name="license_number"
                                    value={doctorData.license_number}
                                    onChange={handleDoctorDataChange}
                                    required
                                    placeholder="Medical License Number"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="qualification">Qualification</label>
                                <input
                                    type="text"
                                    id="qualification"
                                    name="qualification"
                                    value={doctorData.qualification}
                                    onChange={handleDoctorDataChange}
                                    required
                                    placeholder="e.g., MBBS, MD"
                                />
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="years_of_experience">Years of Experience</label>
                                    <input
                                        type="number"
                                        id="years_of_experience"
                                        name="years_of_experience"
                                        value={doctorData.years_of_experience}
                                        onChange={handleDoctorDataChange}
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="consultation_fee">Consultation Fee ($)</label>
                                    <input
                                        type="number"
                                        id="consultation_fee"
                                        name="consultation_fee"
                                        value={doctorData.consultation_fee}
                                        onChange={handleDoctorDataChange}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
