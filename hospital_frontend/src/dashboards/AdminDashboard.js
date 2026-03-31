import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    patientService,
    doctorService,
    appointmentService,
    billingService,
} from '../services/api';
import '../styles/auth.css';


const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('overview');
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [billings, setBillings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [patientsRes, doctorsRes, appointmentsRes, billingsRes] = await Promise.all([
                patientService.getPatients(),
                doctorService.getDoctors(),
                appointmentService.getAppointments(),
                billingService.getBillings(),
            ]);
            setPatients(patientsRes.data.results || patientsRes.data);
            setDoctors(doctorsRes.data.results || doctorsRes.data);
            setAppointments(appointmentsRes.data.results || appointmentsRes.data);
            setBillings(billingsRes.data.results || billingsRes.data);
        } catch (error) {
            alert('Failed to load data: ' + (error.response?.data?.detail || error.message));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const deletePatient = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await patientService.deletePatient(id);
                loadDashboardData();
                alert('Patient deleted successfully');
            } catch (error) {
                alert('Failed to delete patient: ' + (error.response?.data?.detail || error.message));
            }
        }
    };

    const deleteDoctor = async (id) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                await doctorService.deleteDoctor(id);
                loadDashboardData();
                alert('Doctor deleted successfully');
            } catch (error) {
                alert('Failed to delete doctor: ' + (error.response?.data?.detail || error.message));
            }
        }
    };

    const deleteAppointment = async (id) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            try {
                await appointmentService.deleteAppointment(id);
                loadDashboardData();
                alert('Appointment deleted successfully');
            } catch (error) {
                alert('Failed to delete appointment: ' + (error.response?.data?.detail || error.message));
            }
        }
    };

    const completAppointment = async (id) => {
        try {
            await appointmentService.completeAppointment(id);
            loadDashboardData();
            alert('Appointment marked as completed');
        } catch (error) {
            alert('Failed to complete appointment: ' + (error.response?.data?.detail || error.message));
        }
    };

    const deleteBilling = async (id) => {
        if (window.confirm('Are you sure you want to delete this billing record?')) {
            try {
                await billingService.deleteBilling(id);
                loadDashboardData();
                alert('Billing deleted successfully');
            } catch (error) {
                alert('Failed to delete billing: ' + (error.response?.data?.detail || error.message));
            }
        }
    };

    const recordPayment = async (id, paymentData) => {
        try {
            await billingService.recordPayment(id, paymentData);
            loadDashboardData();
            alert('Payment recorded successfully');
        } catch (error) {
            alert('Failed to record payment: ' + (error.response?.data?.detail || error.message));
        }
    };

    const handleOpenForm = (type, item = null) => {
        setFormType(type);
        if (item) {
            setEditingId(item.id);
            setFormData(item);
        } else {
            setEditingId(null);
            setFormData({});
        }
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setFormType('');
        setEditingId(null);
        setFormData({});
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formType === 'patient') {
                if (editingId) {
                    await patientService.updatePatient(editingId, formData);
                    alert('Patient updated successfully');
                } else {
                    await patientService.createPatient(formData);
                    alert('Patient created successfully');
                }
            } else if (formType === 'doctor') {
                if (editingId) {
                    const updatePayload = {
                        specialization: formData.specialization,
                        license_number: formData.license_number,
                        qualification: formData.qualification,
                        years_of_experience: formData.years_of_experience,
                        consultation_fee: formData.consultation_fee,
                        is_available: formData.is_available,
                    };
                    await doctorService.updateDoctor(editingId, updatePayload);
                    alert('Doctor updated successfully');
                } else {
                    const payload = {
                        username: formData.username,
                        email: formData.email,
                        password: formData.password,
                        first_name: formData.first_name,
                        last_name: formData.last_name,
                        phone: formData.phone,
                        specialization: formData.specialization,
                        license_number: formData.license_number,
                        qualification: formData.qualification,
                        years_of_experience: formData.years_of_experience,
                        consultation_fee: formData.consultation_fee,
                        is_available: formData.is_available,
                    };
                    await doctorService.createDoctor(payload);
                    alert('Doctor created successfully');
                }
            } else if (formType === 'appointment') {
                if (editingId) {
                    await appointmentService.updateAppointment(editingId, formData);
                    alert('Appointment updated successfully');
                } else {
                    await appointmentService.createAppointment(formData);
                    alert('Appointment created successfully');
                }
            } else if (formType === 'billing') {
                if (editingId) {
                    // If editing billing, treat it as recording a payment
                    const paymentData = {
                        paid_amount: formData.paid_amount || 0,
                        payment_method: formData.payment_method || 'cash',
                    };
                    await recordPayment(editingId, paymentData);
                } else {
                    await billingService.createBilling(formData);
                    alert('Billing created successfully');
                }
            }
            loadDashboardData();
            handleCloseForm();
        } catch (error) {
            alert('Failed to save: ' + (error.response?.data?.detail || error.message));
        }
    };

    const stats = [
        { label: 'Total Patients', value: patients.length, icon: '👥' },
        { label: 'Total Doctors', value: doctors.length, icon: '👨‍⚕️' },
        { label: 'Appointments', value: appointments.length, icon: '📅' },
        { label: 'Billings', value: billings.length, icon: '💰' },
    ];

    return (
        <div className="dashboard-layout">
            <div className="sidebar">
                <div className="sidebar-header">🏥 Admin Panel</div>
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
                            className={`sidebar-link ${activeMenu === 'patients' ? 'active' : ''}`}
                            onClick={() => setActiveMenu('patients')}
                        >
                            👥 Patients
                        </button>
                    </li>
                    <li>
                        <button
                            className={`sidebar-link ${activeMenu === 'doctors' ? 'active' : ''}`}
                            onClick={() => setActiveMenu('doctors')}
                        >
                            👨‍⚕️ Doctors
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
                            className={`sidebar-link ${activeMenu === 'billings' ? 'active' : ''}`}
                            onClick={() => setActiveMenu('billings')}
                        >
                            💰 Billings
                        </button>
                    </li>
                </ul>
            </div>

            <div className="main-content">
                <div className="header">
                    <h1>Admin Dashboard</h1>
                    <div className="header-actions">
                        <button className="btn btn-danger" onClick={handleLogout}>
                            🚪 Logout
                        </button>
                    </div>
                </div>

                {activeMenu === 'overview' && (
                    <div>
                        <div className="grid grid-4">
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
                                    <h2>Recent Appointments</h2>
                                </div>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Patient</th>
                                                <th>Doctor</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.slice(0, 5).map((apt) => (
                                                <tr key={apt.id}>
                                                    <td>{apt.patient_name}</td>
                                                    <td>{apt.doctor_name}</td>
                                                    <td>{apt.appointment_date}</td>
                                                    <td>
                                                        <span className={`badge badge-${apt.status}`}>
                                                            {apt.status}
                                                        </span>
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

                {activeMenu === 'patients' && (
                    <div className="card">
                        <div className="card-header">
                            <h2>Patients Management</h2>
                            <button className="btn btn-primary" onClick={() => handleOpenForm('patient')}>
                                + Add Patient
                            </button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Blood Group</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients.map((patient) => (
                                        <tr key={patient.id}>
                                            <td>{patient.user?.first_name} {patient.user?.last_name}</td>
                                            <td>{patient.user?.email}</td>
                                            <td>{patient.user?.phone}</td>
                                            <td>{patient.blood_group}</td>
                                            <td>
                                                <button className="btn btn-sm btn-warning" onClick={() => handleOpenForm('patient', patient)}>
                                                    Edit
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={() => deletePatient(patient.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeMenu === 'doctors' && (
                    <div className="card">
                        <div className="card-header">
                            <h2>Doctors Management</h2>
                            <button className="btn btn-primary" onClick={() => handleOpenForm('doctor')}>
                                + Add Doctor
                            </button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Specialization</th>
                                        <th>Email</th>
                                        <th>Fee</th>
                                        <th>Available</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doctors.map((doctor) => (
                                        <tr key={doctor.id}>
                                            <td>Dr. {doctor.user?.first_name} {doctor.user?.last_name}</td>
                                            <td>{doctor.specialization}</td>
                                            <td>{doctor.user?.email}</td>
                                            <td>${doctor.consultation_fee}</td>
                                            <td>{doctor.is_available ? '✓' : '✗'}</td>
                                            <td>
                                                <button className="btn btn-sm btn-warning" onClick={() => handleOpenForm('doctor', doctor)}>
                                                    Edit
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={() => deleteDoctor(doctor.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeMenu === 'appointments' && (
                    <div className="card">
                        <div className="card-header">
                            <h2>Appointments Management</h2>
                            <button className="btn btn-primary" onClick={() => handleOpenForm('appointment')}>
                                + Add Appointment
                            </button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Patient</th>
                                        <th>Doctor</th>
                                        <th>Date & Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((apt) => (
                                        <tr key={apt.id}>
                                            <td>{apt.patient_name}</td>
                                            <td>{apt.doctor_name}</td>
                                            <td>{apt.appointment_date} {apt.appointment_time}</td>
                                            <td>
                                                <span className={`badge badge-${apt.status}`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td>
                                                {apt.status === 'scheduled' && (
                                                    <button className="btn btn-sm btn-success" onClick={() => completAppointment(apt.id)}>
                                                        Complete
                                                    </button>
                                                )}
                                                <button className="btn btn-sm btn-danger" onClick={() => deleteAppointment(apt.id)}>
                                                    Delete
                                                </button>
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
                            <h2>Billings Management</h2>
                            <button className="btn btn-primary" onClick={() => handleOpenForm('billing')}>
                                + Add Billing
                            </button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Patient</th>
                                        <th>Total Amount</th>
                                        <th>Paid Amount</th>
                                        <th>Balance</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {billings.map((bill) => (
                                        <tr key={bill.id}>
                                            <td>{bill.appointment_details?.patient_name}</td>
                                            <td>${bill.total_amount}</td>
                                            <td>${bill.paid_amount}</td>
                                            <td>${bill.balance}</td>
                                            <td>
                                                <span className={`badge badge-${bill.payment_status}`}>
                                                    {bill.payment_status}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-warning" onClick={() => handleOpenForm('billing', bill)}>
                                                    Record Payment
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={() => deleteBilling(bill.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {showForm && (
                    <div className="modal-overlay" onClick={handleCloseForm}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{editingId ? `Edit ${formType}` : `Add New ${formType}`}</h3>
                                <button className="close-btn" onClick={handleCloseForm}>✕</button>
                            </div>
                            <form onSubmit={handleFormSubmit}>
                                {formType === 'patient' && (
                                    <>
                                        <div className="form-group">
                                            <label>Blood Group</label>
                                            <select name="blood_group" value={formData.blood_group || ''} onChange={handleFormChange}>
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
                                            <label>Allergies</label>
                                            <textarea name="allergies" value={formData.allergies || ''} onChange={handleFormChange} placeholder="Enter allergies"></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>Medical History</label>
                                            <textarea name="medical_history" value={formData.medical_history || ''} onChange={handleFormChange} placeholder="Enter medical history"></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>Emergency Contact</label>
                                            <input type="text" name="emergency_contact" value={formData.emergency_contact || ''} onChange={handleFormChange} placeholder="Phone number" />
                                        </div>
                                        <div className="form-group">
                                            <label>Emergency Contact Name</label>
                                            <input type="text" name="emergency_contact_name" value={formData.emergency_contact_name || ''} onChange={handleFormChange} placeholder="Contact name" />
                                        </div>
                                    </>
                                )}
                                {formType === 'doctor' && (
                                    <>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Username</label>
                                                <input type="text" name="username" value={formData.username || ''} onChange={handleFormChange} placeholder="Username" required />
                                            </div>
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input type="email" name="email" value={formData.email || ''} onChange={handleFormChange} placeholder="Email" required />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>First Name</label>
                                                <input type="text" name="first_name" value={formData.first_name || ''} onChange={handleFormChange} placeholder="First name" required />
                                            </div>
                                            <div className="form-group">
                                                <label>Last Name</label>
                                                <input type="text" name="last_name" value={formData.last_name || ''} onChange={handleFormChange} placeholder="Last name" required />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Password</label>
                                            <input type="password" name="password" value={formData.password || ''} onChange={handleFormChange} placeholder="Password" required />
                                        </div>
                                        <div className="form-group">
                                            <label>Phone</label>
                                            <input type="tel" name="phone" value={formData.phone || ''} onChange={handleFormChange} placeholder="Phone number" />
                                        </div>
                                        <div className="form-group">
                                            <label>Specialization</label>
                                            <select name="specialization" value={formData.specialization || ''} onChange={handleFormChange}>
                                                <option value="">Select Specialization</option>
                                                <option value="cardiology">Cardiology</option>
                                                <option value="dermatology">Dermatology</option>
                                                <option value="neurology">Neurology</option>
                                                <option value="orthopedics">Orthopedics</option>
                                                <option value="pediatrics">Pediatrics</option>
                                                <option value="psychiatry">Psychiatry</option>
                                                <option value="surgery">Surgery</option>
                                                <option value="gynecology">Gynecology</option>
                                                <option value="general">General Medicine</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>License Number</label>
                                            <input type="text" name="license_number" value={formData.license_number || ''} onChange={handleFormChange} placeholder="License number" />
                                        </div>
                                        <div className="form-group">
                                            <label>Qualification</label>
                                            <input type="text" name="qualification" value={formData.qualification || ''} onChange={handleFormChange} placeholder="Qualification" />
                                        </div>
                                        <div className="form-group">
                                            <label>Years of Experience</label>
                                            <input type="number" name="years_of_experience" value={formData.years_of_experience || ''} onChange={handleFormChange} placeholder="Years" />
                                        </div>
                                        <div className="form-group">
                                            <label>Consultation Fee</label>
                                            <input type="number" name="consultation_fee" value={formData.consultation_fee || ''} onChange={handleFormChange} placeholder="Fee" step="0.01" />
                                        </div>
                                        <div className="form-group">
                                            <label>Available</label>
                                            <input type="checkbox" name="is_available" checked={formData.is_available || false} onChange={(e) => setFormData({...formData, is_available: e.target.checked})} />
                                        </div>
                                    </>
                                )}
                                {formType === 'appointment' && (
                                    <>
                                        <div className="form-group">
                                            <label>Patient</label>
                                            <select name="patient" value={formData.patient || ''} onChange={handleFormChange} required>
                                                <option value="">Select Patient</option>
                                                {patients.map(patient => (
                                                    <option key={patient.id} value={patient.id}>
                                                        {patient.user?.first_name} {patient.user?.last_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Doctor</label>
                                            <select name="doctor" value={formData.doctor || ''} onChange={handleFormChange} required>
                                                <option value="">Select Doctor</option>
                                                {doctors.map(doctor => (
                                                    <option key={doctor.id} value={doctor.id}>
                                                        Dr. {doctor.user?.first_name} {doctor.user?.last_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Date</label>
                                            <input type="date" name="appointment_date" value={formData.appointment_date || ''} onChange={handleFormChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Time</label>
                                            <input type="time" name="appointment_time" value={formData.appointment_time || ''} onChange={handleFormChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Reason</label>
                                            <textarea name="reason" value={formData.reason || ''} onChange={handleFormChange} placeholder="Reason for appointment"></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>Notes</label>
                                            <textarea name="notes" value={formData.notes || ''} onChange={handleFormChange} placeholder="Additional notes"></textarea>
                                        </div>
                                    </>
                                )}
                                {formType === 'billing' && (
                                    <>
                                        <div className="form-group">
                                            <label>Appointment</label>
                                            <select name="appointment" value={formData.appointment || ''} onChange={handleFormChange} required>
                                                <option value="">Select Appointment</option>
                                                {appointments.map(apt => (
                                                    <option key={apt.id} value={apt.id}>
                                                        {apt.patient_name} - Dr. {apt.doctor_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Consultation Fee</label>
                                            <input type="number" name="consultation_fee" value={formData.consultation_fee || ''} onChange={handleFormChange} placeholder="Consultation fee" step="0.01" required />
                                        </div>
                                        <div className="form-group">
                                            <label>Medicine Cost</label>
                                            <input type="number" name="medicine_cost" value={formData.medicine_cost || ''} onChange={handleFormChange} placeholder="Medicine cost" step="0.01" />
                                        </div>
                                        <div className="form-group">
                                            <label>Test Cost</label>
                                            <input type="number" name="test_cost" value={formData.test_cost || ''} onChange={handleFormChange} placeholder="Test cost" step="0.01" />
                                        </div>
                                        <div className="form-group">
                                            <label>Paid Amount</label>
                                            <input type="number" name="paid_amount" value={formData.paid_amount || ''} onChange={handleFormChange} placeholder="Amount paid" step="0.01" />
                                        </div>
                                        <div className="form-group">
                                            <label>Payment Method</label>
                                            <select name="payment_method" value={formData.payment_method || ''} onChange={handleFormChange}>
                                                <option value="">Select Payment Method</option>
                                                <option value="cash">Cash</option>
                                                <option value="credit_card">Credit Card</option>
                                                <option value="debit_card">Debit Card</option>
                                                <option value="online">Online Payment</option>
                                                <option value="insurance">Insurance</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">Save</button>
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseForm}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
