import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    patientService,
    doctorService,
    appointmentService,
    billingService,
} from '../services/api';


const PatientDashboard = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('overview');
    const [patientProfile, setPatientProfile] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [billings, setBillings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [specializationFilter, setSpecializationFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [profileRes, appointmentsRes, doctorsRes, billingsRes] = await Promise.all([
                patientService.getMyProfile(),
                appointmentService.getAppointments(),
                doctorService.getDoctors(),
                billingService.getBillings(),
            ]);
            setPatientProfile(profileRes.data);
            setAppointments(appointmentsRes.data.results || appointmentsRes.data);
            setDoctors(doctorsRes.data.results || doctorsRes.data);
            setBillings(billingsRes.data.results || billingsRes.data);
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

    const handleBookAppointment = async (formData) => {
        try {
            const appointmentData = {
                doctor: selectedDoctor.id,
                appointment_date: formData.date,
                appointment_time: formData.time,
                reason: formData.reason,
            };
            await appointmentService.createAppointment(appointmentData);
            loadDashboardData();
            setShowBookingForm(false);
            setSelectedDoctor(null);
            alert('Appointment booked successfully');
        } catch (error) {
            const message =
                error.response?.data?.detail ||
                error.response?.data?.error ||
                error.response?.data ||
                error.message ||
                'Failed to book appointment';
            alert(message);
        }
    };

    const loadDoctors = async (filters = {}) => {
        try {
            const doctorParams = {};
            const currentSearch = filters.hasOwnProperty('search') ? filters.search : searchQuery;
            const currentSpecialization = filters.hasOwnProperty('specialization') ? filters.specialization : specializationFilter;

            if (currentSearch) doctorParams.search = currentSearch;
            if (currentSpecialization) doctorParams.specialization = currentSpecialization;

            const doctorsRes = await doctorService.getDoctors(doctorParams);
            setDoctors(doctorsRes.data.results || doctorsRes.data);
        } catch (error) {
            alert('Failed to load doctors');
        }
    };

    const handleSearchDoctors = async (e) => {
        if (e) e.preventDefault();
        await loadDoctors();
    };

    const handleClearDoctorSearch = () => {
        setSearchQuery('');
        setSpecializationFilter('');
        loadDoctors({ search: '', specialization: '' });
    };

    const handleCancelAppointment = async (appointmentId) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await appointmentService.cancelAppointment(appointmentId);
                loadDashboardData();
                alert('Appointment cancelled');
            } catch (error) {
                alert('Failed to cancel appointment');
            }
        }
    };

    const stats = [
        { label: 'Upcoming Appointments', value: appointments.filter(a => a.status === 'scheduled').length, icon: '📅' },
        { label: 'Completed Appointments', value: appointments.filter(a => a.status === 'completed').length, icon: '✓' },
        { label: 'Pending Payments', value: billings.filter(b => b.payment_status === 'pending').length, icon: '💰' },
    ];

    return (
        <div className="dashboard-layout">
            <div className="sidebar">
                <div className="sidebar-header">🏥 Patient Panel</div>
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
                            className={`sidebar-link ${activeMenu === 'doctors' ? 'active' : ''}`}
                            onClick={() => setActiveMenu('doctors')}
                        >
                            👨‍⚕️ Find Doctors
                        </button>
                    </li>
                    <li>
                        <button
                            className={`sidebar-link ${activeMenu === 'appointments' ? 'active' : ''}`}
                            onClick={() => setActiveMenu('appointments')}
                        >
                            📅 My Appointments
                        </button>
                    </li>
                    <li>
                        <button
                            className={`sidebar-link ${activeMenu === 'billings' ? 'active' : ''}`}
                            onClick={() => setActiveMenu('billings')}
                        >
                            💰 Billings
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
                    <h1>Patient Dashboard</h1>
                    <div className="header-actions">
                        <button className="btn btn-danger" onClick={handleLogout}>
                            🚪 Logout
                        </button>
                    </div>
                </div>

                {activeMenu === 'overview' && (
                    <div>
                        <div className="grid grid-3">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="stats-card">
                                    <div className="stats-info">
                                        <h3>{stat.label}</h3>
                                        <div className="stats-value">{stat.value}</div>
                                    </div>
                                    <div className="stats-icon">{stat.icon}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '30px' }}>
                            <div className="card">
                                <div className="card-header">
                                    <h2>Upcoming Appointments</h2>
                                </div>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Doctor</th>
                                                <th>Specialization</th>
                                                <th>Date & Time</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments
                                                .filter(a => a.status === 'scheduled')
                                                .map((apt) => (
                                                    <tr key={apt.id}>
                                                        <td>{apt.doctor_name}</td>
                                                        <td>{apt.doctor_specialization}</td>
                                                        <td>{apt.appointment_date} {apt.appointment_time}</td>
                                                        <td>
                                                            <span className="badge badge-pending">
                                                                {apt.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => handleCancelAppointment(apt.id)}
                                                            >
                                                                Cancel
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

                {activeMenu === 'doctors' && (
                    <div>
                        <div className="card" style={{ marginBottom: '20px' }}>
                            <div className="card-header">
                                <h2>Available Doctors</h2>
                            </div>
                            <div className="grid grid-2">
                                <form className="search-bar" onSubmit={handleSearchDoctors} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                            <input
                                type="text"
                                placeholder="Search by doctor name or specialty"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input"
                                style={{ flex: '1 1 220px' }}
                            />
                            <select
                                value={specializationFilter}
                                onChange={(e) => setSpecializationFilter(e.target.value)}
                                className="input"
                                style={{ flex: '0 0 200px' }}
                            >
                                <option value="">All Specializations</option>
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
                            <button type="submit" className="btn btn-secondary" style={{ flex: '0 0 auto' }}>
                                Search
                            </button>
                            <button type="button" className="btn btn-light" style={{ flex: '0 0 auto' }} onClick={handleClearDoctorSearch}>
                                Clear
                            </button>
                        </form>
                        {doctors.length === 0 ? (
                            <div className="card">
                                <p>No doctors found. Try another search term or select a different specialization.</p>
                            </div>
                        ) : (
                            <div className="grid grid-2">
                                {doctors.map((doctor) => (
                                    <div key={doctor.id} className="card" style={{ cursor: 'pointer' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h3>Dr. {doctor.user?.first_name} {doctor.user?.last_name}</h3>
                                                <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                                                    {doctor.specialization}
                                                </p>
                                            </div>
                                            <span className={`badge badge-${doctor.is_available ? 'success' : 'danger'}`}>
                                                {doctor.is_available ? 'Available' : 'Unavailable'}
                                            </span>
                                        </div>
                                        <p style={{ marginTop: '8px' }}>
                                            <strong>Qualification:</strong> {doctor.qualification}
                                        </p>
                                        <p>
                                            <strong>Experience:</strong> {doctor.years_of_experience} years
                                        </p>
                                        {doctor.clinic_address && (
                                            <p>
                                                <strong>Clinic:</strong> {doctor.clinic_address}
                                            </p>
                                        )}
                                        <p>
                                            <strong>Fee:</strong> ${doctor.consultation_fee}
                                        </p>
                                        <p>
                                            <strong>Hours:</strong> {doctor.available_time_start} - {doctor.available_time_end}
                                        </p>
                                        <button
                                            className="btn btn-primary"
                                            style={{ marginTop: '15px' }}
                                            onClick={() => {
                                                setSelectedDoctor(doctor);
                                                setShowBookingForm(true);
                                            }}
                                        >
                                            Book Appointment
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                            </div>
                        </div>

                        {showBookingForm && selectedDoctor && (
                            <div className="modal-overlay">
                                <div className="modal">
                                    <div className="modal-header">
                                        <h2>Book Appointment</h2>
                                        <button
                                            className="modal-close"
                                            onClick={() => {
                                                setShowBookingForm(false);
                                                setSelectedDoctor(null);
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <BookingForm
                                        doctor={selectedDoctor}
                                        onSubmit={handleBookAppointment}
                                        onCancel={() => {
                                            setShowBookingForm(false);
                                            setSelectedDoctor(null);
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeMenu === 'appointments' && (
                    <div className="card">
                        <div className="card-header">
                            <h2>My Appointments</h2>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Doctor</th>
                                        <th>Specialization</th>
                                        <th>Date & Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((apt) => (
                                        <tr key={apt.id}>
                                            <td>{apt.doctor_name}</td>
                                            <td>{apt.doctor_specialization}</td>
                                            <td>{apt.appointment_date} {apt.appointment_time}</td>
                                            <td>
                                                <span className={`badge badge-${apt.status}`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td>
                                                {apt.status === 'scheduled' && (
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleCancelAppointment(apt.id)}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeMenu === 'billings' && (
                    <div className="card">
                        <div className="card-header">
                            <h2>My Billings</h2>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Appointment</th>
                                        <th>Total Amount</th>
                                        <th>Paid Amount</th>
                                        <th>Balance</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {billings.map((bill) => (
                                        <tr key={bill.id}>
                                            <td>
                                                {bill.appointment_details?.doctor_name} ({bill.appointment_details?.appointment_date})
                                            </td>
                                            <td>${bill.total_amount}</td>
                                            <td>${bill.paid_amount}</td>
                                            <td>${bill.balance}</td>
                                            <td>
                                                <span className={`badge badge-${bill.payment_status}`}>
                                                    {bill.payment_status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeMenu === 'profile' && patientProfile && (
                    <div className="card">
                        <div className="card-header">
                            <h2>My Medical Profile</h2>
                        </div>
                        <div style={{ display: 'grid', gap: '15px' }}>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Name</p>
                                <p><strong>{patientProfile.user?.first_name} {patientProfile.user?.last_name}</strong></p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Email</p>
                                <p><strong>{patientProfile.user?.email}</strong></p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Phone</p>
                                <p><strong>{patientProfile.user?.phone}</strong></p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Blood Group</p>
                                <p><strong>{patientProfile.blood_group}</strong></p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Allergies</p>
                                <p><strong>{patientProfile.allergies || 'None'}</strong></p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Medical History</p>
                                <p><strong>{patientProfile.medical_history || 'None'}</strong></p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const BookingForm = ({ doctor, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        reason: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.date && formData.time && formData.reason) {
            onSubmit(formData);
        } else {
            alert('Please fill all fields');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <p style={{ marginBottom: '20px' }}>
                Booking appointment with <strong>Dr. {doctor.user?.first_name} {doctor.user?.last_name}</strong>
            </p>

            <div className="form-group">
                <label>Appointment Date</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Appointment Time</label>
                <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Reason for Appointment</label>
                <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Describe your symptoms or reason..."
                    required
                />
            </div>

            <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Book Appointment</button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default PatientDashboard;
