import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken });
                    localStorage.setItem('access_token', response.data.access);
                    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

// Auth endpoints
export const authService = {
    register: (userData) => api.post('/register/', userData),
    login: (credentials) => api.post('/login/', credentials),
    logout: () => api.post('/logout/'),
    getCurrentUser: () => api.get('/users/me/'),
};

// User endpoints
export const userService = {
    getUsers: (role) => api.get('/users/', { params: { role } }),
    getUser: (id) => api.get(`/users/${id}/`),
    updateUser: (id, data) => api.patch(`/users/${id}/`, data),
    changePassword: (data) => api.post('/users/change_password/', data),
};

// Patient endpoints
export const patientService = {
    getPatients: () => api.get('/patients/'),
    getPatient: (id) => api.get(`/patients/${id}/`),
    createPatient: (data) => api.post('/patients/', data),
    updatePatient: (id, data) => api.patch(`/patients/${id}/`, data),
    deletePatient: (id) => api.delete(`/patients/${id}/`),
    getMyProfile: () => api.get('/patients/my_profile/'),
};

// Doctor endpoints
export const doctorService = {
    getDoctors: (filters = {}) => api.get('/doctors/', { params: filters }),
    getDoctor: (id) => api.get(`/doctors/${id}/`),
    createDoctor: (data) => api.post('/doctors/', data),
    updateDoctor: (id, data) => api.patch(`/doctors/${id}/`, data),
    deleteDoctor: (id) => api.delete(`/doctors/${id}/`),
    getMyProfile: () => api.get('/doctors/my_profile/'),
    updateAvailability: (isAvailable) => api.post('/doctors/update_availability/', { is_available: isAvailable }),
};

// Appointment endpoints
export const appointmentService = {
    getAppointments: (filters = {}) => api.get('/appointments/', { params: filters }),
    getAppointment: (id) => api.get(`/appointments/${id}/`),
    createAppointment: (data) => api.post('/appointments/', data),
    updateAppointment: (id, data) => api.patch(`/appointments/${id}/`, data),
    deleteAppointment: (id) => api.delete(`/appointments/${id}/`),
    cancelAppointment: (id) => api.post(`/appointments/${id}/cancel/`),
    completeAppointment: (id) => api.post(`/appointments/${id}/complete/`),
};

// Billing endpoints
export const billingService = {
    getBillings: (filters = {}) => api.get('/billings/', { params: filters }),
    getBilling: (id) => api.get(`/billings/${id}/`),
    createBilling: (data) => api.post('/billings/', data),
    updateBilling: (id, data) => api.patch(`/billings/${id}/`, data),
    deleteBilling: (id) => api.delete(`/billings/${id}/`),
    recordPayment: (id, paymentData) => api.post(`/billings/${id}/record_payment/`, paymentData),
};

export default api;
