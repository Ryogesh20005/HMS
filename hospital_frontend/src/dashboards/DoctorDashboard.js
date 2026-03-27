import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    doctorService,
    appointmentService,
    patientService,
} from '../services/api';
import '../styles/auth.css';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('overview');
    const [doctorProfile, setDoctorProfile] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingProfile, setEditingProfile] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [profileRes, appointmentsRes] = await Promise.all([
                doctorService.getMyProfile(),
                appointmentService.getAppointments(),
            ]);
            setDoctorProfile(profileRes.data);
            setAppointments(appointmentsRes.data.results || appointmentsRes.data);
            
            // Load patients
            const patientsRes = await patientService.getPatients();
            setPatients(patientsRes.data.results || patientsRes.data);
        } catch (error) {
            alert('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleCompleteAppointment = async (appointmentId) => {
        try {
            await appointmentService.completeAppointment(appointmentId);
            loadDashboardData();
            alert('Appointment marked as completed');
        } catch (error) {
            alert('Failed to complete appointment');
        }
    };

    const handleUpdateAvailability = async (isAvailable) => {
        try {
            await doctorService.updateAvailability(isAvailable);
            setDoctorProfile({ ...doctorProfile, is_available: isAvailable });
            alert('Availability updated');
        } catch (error) {
            alert('Failed to update availability');
        }
    };

    const handleSaveProfile = async (updatedProfile) => {
        try {
            await doctorService.updateDoctor(doctorProfile.id, updatedProfile);
            setDoctorProfile({ ...doctorProfile, ...updatedProfile });
            setEditingProfile(false);
            alert('Profile updated successfully');
        } catch (error) {
            alert('Failed to update profile');
        }
    };

    const upcomingAppointments = appointments.filter(apt => apt.status === 'scheduled');
    const completedAppointments = appointments.filter(apt => apt.status === 'completed');

    return (
        <div className="dashboard-layout">
            <div className="sidebar">
                <div className="sidebar-header">🏥 Doctor Panel</div>
                <ul className="sidebar-menu">
                    <li>
                        <button
                            className={`sidebar-link ${activeMenu === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveMenu('overview')}
                        >
                            📊 Overview
                        </button>
                    </li>
                    <li>
                        <button
                            className={`sidebar-link ${activeMenu === 'appointments' ? 'active' : ''}`}
                            onClick={() => setActiveMenu('appointments')}
                        >
                            📅 Appointments
                        </button>
                    </li>
                    <li>
                        <button
                            className={`sidebar-link ${activeMenu === 'patients' ? 'active' : ''}`}
                            onClick={() => setActiveMenu('patients')}
                        >
                            👥 Patients
                        </button>
                    </li>
                    <li>
                        <button
                            className={`sidebar-link ${activeMenu === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveMenu('profile')}
                        >
                            👤 Profile
                        </button>
                    </li>
                </ul>
            </div>

            <div className="main-content">
                <div className="header">
                    <h1>Doctor Dashboard</h1>
                    <div className="header-actions">
                        <button className="btn btn-danger" onClick={handleLogout}>
                            🚪 Logout
                        </button>
                    </div>
                </div>

                {activeMenu === 'overview' && doctorProfile && (
                    <div>
                        <div className="grid grid-2">
                            <div className="stats-card">
                                <div className="stats-info">
                                    <h3>Upcoming Appointments</h3>
                                    <div className="stats-value">{upcomingAppointments.length}</div>
                                </div>
                                <div className="stats-icon">📅</div>
                            </div>
                            <div className="stats-card">
                                <div className="stats-info">
                                    <h3>Completed Appointments</h3>
                                    <div className="stats-value">{completedAppointments.length}</div>
                                </div>
                                <div className="stats-icon">✓</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '30px' }}>
                            <div className="card">
                                <div className="card-header">
                                    <h2>Upcoming Appointments</h2>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <input
                                            type="checkbox"
                                            checked={doctorProfile.is_available}
                                            onChange={(e) => handleUpdateAvailability(e.target.checked)}
                                        />
                                        Available for appointments
                                    </label>
                                </div>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Patient</th>
                                                <th>Date & Time</th>
                                                <th>Reason</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {upcomingAppointments.map((apt) => (
                                                <tr key={apt.id}>
                                                    <td>{apt.patient_name}</td>
                                                    <td>{apt.appointment_date} {apt.appointment_time}</td>
                                                    <td>{apt.reason}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            onClick={() => handleCompleteAppointment(apt.id)}
                                                        >
                                                            Complete
                                                        </button>
                                            </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeMenu === 'appointments' && (
                    <div className="card">
                        <div className="card-header">
                            <h2>All Appointments</h2>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Patient</th>
                                        <th>Date & Time</th>
                                        <th>Status</th>
                                        <th>Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((apt) => (
                                        <tr key={apt.id}>
                                            <td>{apt.patient_name}</td>
                                            <td>{apt.appointment_date} {apt.appointment_time}</td>
                                            <td>
                                                <span className={`badge badge-${apt.status}`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td>{apt.reason}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeMenu === 'patients' && (
                    <div className="card">
                        <div className="card-header">
                            <h2>My Patients</h2>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Blood Group</th>
                                        <th>Medical History</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients.map((patient) => (
                                        <tr key={patient.id}>
                                            <td>{patient.user?.first_name} {patient.user?.last_name}</td>
                                            <td>{patient.user?.email}</td>
                                            <td>{patient.user?.phone}</td>
                                            <td>{patient.blood_group}</td>
                                            <td>{patient.medical_history?.substring(0, 50)}...</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeMenu === 'profile' && doctorProfile && (
                    <div className="card">
                        <div className="card-header">
                            <h2>My Profile</h2>
                            {!editingProfile && (
                                <button className="btn btn-sm btn-primary" onClick={() => setEditingProfile(true)}>
                                    Edit
                                </button>
                            )}
                        </div>
                        {!editingProfile ? (
                            <div style={{ display: 'grid', gap: '15px' }}>
                                <div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Name</p>
                                    <p><strong>Dr. {doctorProfile.user?.first_name} {doctorProfile.user?.last_name}</strong></p>
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Email</p>
                                    <p><strong>{doctorProfile.user?.email}</strong></p>
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Specialization</p>
                                    <p><strong>{doctorProfile.specialization}</strong></p>
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Consultation Fee</p>
                                    <p><strong>${doctorProfile.consultation_fee}</strong></p>
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Years of Experience</p>
                                    <p><strong>{doctorProfile.years_of_experience}</strong></p>
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Qualification</p>
                                    <p><strong>{doctorProfile.qualification}</strong></p>
                                </div>
                            </div>
                        ) : (
                            <EditProfileForm
                                doctor={doctorProfile}
                                onSave={handleSaveProfile}
                                onCancel={() => setEditingProfile(false)}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const EditProfileForm = ({ doctor, onSave, onCancel }) => {
    const [formData, setFormData] = useState(doctor);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
                <label>Clinic Address</label>
                <textarea
                    name="clinic_address"
                    value={formData.clinic_address || ''}
                    onChange={handleChange}
                />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Available From</label>
                    <input
                        type="time"
                        name="available_time_start"
                        value={formData.available_time_start}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Available Till</label>
                    <input
                        type="time"
                        name="available_time_end"
                        value={formData.available_time_end}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default DoctorDashboard;
