# Hospital Management System

A comprehensive hospital management system built with Django REST Framework and React. The system has three user roles: Admin, Doctors, and Patients, each with dedicated dashboards and features.

## Features

### 👤 Admin Dashboard
- Manage all patients and doctors
- View all appointments
- Manage billing and payments
- CRUD operations on all resources
- System overview with statistics

### 👨‍⚕️ Doctor Dashboard
- View upcoming appointments
- Mark appointments as completed
- View patient history
- Update profile and availability
- Manage consultation fees
- Track completed appointments

### 👥 Patient Dashboard
- Browse available doctors by specialization
- Book appointments
- View appointment history
- Cancel appointments if needed
- Track billing and payments
- View medical profile

## Tech Stack

### Backend
- **Django 4.2.7** - Web framework
- **Django REST Framework** - API development
- **MySQL 8.0+** - Database
- **JWT** - Authentication

### Frontend
- **React 18.2** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling

## Project Structure

```
hospital_backend/
├── hospital_project/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── __init__.py
├── hospital_app/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   ├── admin.py
│   └── migrations/
├── manage.py
└── requirements.txt

hospital_frontend/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── dashboards/
│   │   ├── AdminDashboard.jsx
│   │   ├── DoctorDashboard.jsx
│   │   └── PatientDashboard.jsx
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   └── auth.css
│   ├── App.jsx
│   └── index.js
├── public/
│   └── index.html
└── package.json
```

## Setup Instructions

### Backend Setup

1. **Create MySQL Database (First Time Only):**
   ```bash
   mysql -u root -p
   ```
   Password: `yosh_46`
   
   In MySQL prompt:
   ```sql
   CREATE DATABASE hmsdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   EXIT;
   ```

2. **Navigate to backend directory:**
   ```bash
   cd hospital_backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **Mac/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Create admin user (optional):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run development server:**
   ```bash
   python manage.py runserver
   ```
   
   The backend will be running at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd hospital_frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```
   
   The frontend will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/register/` - Register new user
- `POST /api/login/` - Login user
- `POST /api/logout/` - Logout user

### Users
- `GET /api/users/` - List all users (Admin)
- `GET /api/users/me/` - Get current user
- `POST /api/users/change_password/` - Change password

### Patients
- `GET /api/patients/` - List patients (Admin)
- `GET /api/patients/my_profile/` - Get patient profile
- `PATCH /api/patients/{id}/` - Update patient

### Doctors
- `GET /api/doctors/` - List available doctors
- `GET /api/doctors/my_profile/` - Get doctor profile
- `PATCH /api/doctors/{id}/` - Update doctor
- `POST /api/doctors/update_availability/` - Update availability

### Appointments
- `GET /api/appointments/` - List appointments
- `POST /api/appointments/` - Create appointment
- `POST /api/appointments/{id}/cancel/` - Cancel appointment
- `POST /api/appointments/{id}/complete/` - Complete appointment

### Billings
- `GET /api/billings/` - List billings
- `POST /api/billings/{id}/record_payment/` - Record payment

## User Roles & Permissions

### Admin
- Create, read, update, delete patients, doctors, appointments, and billings
- View system statistics
- Manage all system resources

### Doctor
- View their own appointments
- Mark appointments as completed
- View patients they have appointments with
- Update their profile and availability status
- View consultation fees

### Patient
- Browse available doctors
- Book/cancel appointments
- View appointment history
- View billing and payment status
- Update personal medical information

## Registration & Login

### Registration Flow
1. Navigate to `/register`
2. Select role (Patient or Doctor)
3. Fill in required information
4. Submit form - automatic account creation and login

### Login Flow
1. Click on "Login" or navigate to `/login`
2. Enter username and password
3. Redirected to appropriate dashboard based on role

## Test Credentials

You can register new accounts using the registration page, or use these default test accounts (if created):

- **Admin:** username: `admin` | password: `admin123`
- **Doctor:** username: `doctor1` | password: `doctor123`
- **Patient:** username: `patient1` | password: `patient123`

## Key Models

### User
- Extends Django's AbstractUser
- Stores role: Admin, Patient, or Doctor
- Common fields: first_name, last_name, email, phone, address, profile_picture

### Patient
- Blood group, medical history, allergies
- Emergency contact information
- One-to-one relationship with User

### Doctor
- Specialization, license number, qualifications
- Years of experience, consultation fee
- Availability time slots
- One-to-one relationship with User

### Appointment
- Links Patient and Doctor
- Date, time, and status tracking
- Unique constraint on doctor + date + time
- Statuses: Scheduled, Completed, Cancelled, No Show

### Billing
- Associated with an Appointment
- Tracks consultation fee, medicines, tests, other charges
- Payment status and method tracking
- Calculates totals automatically

## Running Both Servers

**Terminal 1 - Backend:**
```bash
cd hospital_backend
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd hospital_frontend
npm start
```

Both servers will run simultaneously, with the frontend at `http://localhost:3000` and backend at `http://localhost:8000`.

## Troubleshooting

### CORS Issues
If you see CORS errors, ensure both servers are running and the frontend is configured to access `localhost:8000`.

### Database Errors
If you get database errors, run:
```bash
python manage.py migrate
```

### Port Already in Use
- Django default: 8000 (change with `python manage.py runserver 8001`)
- React default: 3000 (will prompt to use another port if 3000 is in use)

## Future Enhancements

- Email notifications for appointments
- Prescription management
- Medical test result tracking
- Admin analytics and reports
- Doctor search filters
- Appointment reschedule
- Multi-language support
- SMS notifications

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please refer to the documentation or check the API endpoints.

---

**Happy Hospital Managing! 🏥**
