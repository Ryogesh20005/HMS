# Hospital Management System - Quick Start Guide

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn
- Git (optional)
- **MySQL 8.0+ (IMPORTANT!)**

### Option 1: Run Both Servers with Terminal

**Step 0: Setup MySQL Database (First Time Only)**

Open Command Prompt/PowerShell and run:

```bash
mysql -u root -p
```

Enter password: `yosh_46`

Then paste in MySQL prompt:
```sql
CREATE DATABASE IF NOT EXISTS hmsdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Terminal 1 - Backend:**
```bash
cd hospital_backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd hospital_frontend
npm install
npm start
```

Then open your browser to: **http://localhost:3000**

## 🎯 First Steps After Installation

### 1. Register as a Patient or Doctor
- Click "Register" on the login page
- Select your role (Patient/Doctor)
- Fill in all required information
- Click "Register"

### 2. Login
- Enter your username and password
- Click "Login"

### 3. Explore Your Dashboard
- **Admin:** Visit `http://localhost:3000/admin/dashboard`
- **Doctor:** Visit `http://localhost:3000/doctor/dashboard`
- **Patient:** Visit `http://localhost:3000/patient/dashboard`

## 📋 User Roles

### 👤 Admin
- Manage all patients and doctors
- View all appointments and billings
- CRUD operations on all resources
- System statistics

### 👨‍⚕️ Doctor
- View assigned appointments
- Mark appointments as completed
- Update profile and availability
- View patient information

### 👥 Patient
- Browse and search doctors
- Book appointments
- View appointment history
- Track billing and payments

## 🔧 Configuration

### Change API URL
Edit `hospital_frontend/src/services/api.js`:
```javascript
const API_URL = 'http://your-backend-url/api';
```

### Change Backend Port
```bash
python manage.py runserver 8001
```
Then update API URL in frontend accordingly.

## 📱 Key Features

✅ **Patient Registration & Login**
✅ **Doctor Registration & Login**
✅ **Admin Dashboard**
✅ **Doctor Dashboard with Appointments**
✅ **Patient Dashboard with Booking**
✅ **Billing Management**
✅ **Appointment Management**
✅ **Role-Based Access Control**
✅ **JWT Authentication**
✅ **Responsive Design**

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 8000 in use | Run: `python manage.py runserver 8001` |
| Port 3000 in use | React will prompt to use another port |
| CORS error | Ensure backend is running on localhost:8000 |
| DB errors | Run: `python manage.py migrate` |
| Module not found | Run: `pip install -r requirements.txt` (backend) or `npm install` (frontend) |
| API not responding | Check both servers are running in different terminals |

## 📚 Project Structure

```
original/
├── hospital_backend/          # Django REST API
│   ├── hospital_project/      # Django project settings
│   ├── hospital_app/          # Django app with models/views
│   ├── requirements.txt        # Python dependencies
│   ├── manage.py              # Django management
│   └── BACKEND_README.md      # Backend documentation
│
├── hospital_frontend/         # React application
│   ├── src/
│   │   ├── pages/            # Login/Register pages
│   │   ├── dashboards/       # Role-based dashboards
│   │   ├── services/         # API client
│   │   ├── styles/           # CSS styles
│   │   └── App.jsx           # Main app component
│   ├── public/               # Static files
│   ├── package.json          # NPM dependencies
│   └── FRONTEND_README.md    # Frontend documentation
│
└── README.md                 # Main documentation
```

## 🔐 Default Test Account

You can create any account by registering, but here's a test flow:

1. **Register as Admin** (if needed)
2. **Register as Doctor** with specialization
3. **Register as Patient**
4. **Login and explore each dashboard**

## 📖 Full Documentation

For detailed information, see:
- [Main README](README.md) - Complete documentation
- [Backend README](hospital_backend/BACKEND_README.md) - Backend setup
- [Frontend README](hospital_frontend/FRONTEND_README.md) - Frontend setup

## 🎓 Learning the Code

### Backend Structure
- `models.py` - Database models (User, Patient, Doctor, Appointment, Billing)
- `views.py` - API endpoints and business logic
- `serializers.py` - Data serialization for API
- `urls.py` - URL routing configuration

### Frontend Structure
- `App.jsx` - Main routing and layout
- `pages/` - Login and Register pages
- `dashboards/` - Dashboard components for each role
- `services/api.js` - API calls and configuration
- `styles/` - All styling

## 🚀 Next Steps

1. ✅ Install dependencies
2. ✅ Run database migrations
3. ✅ Start both servers
4. ✅ Register and login
5. ✅ Explore dashboards
6. ✅ Test features
7. ✅ Review code
8. ✅ Customize as needed

## 💡 Tips

- **Use browser DevTools** to inspect API calls
- **Check console logs** for any errors
- **Keep both terminals open** while developing
- **Use VS Code** for better development experience
- **Read the models.py** to understand data structure

## 🆘 Need Help?

1. Check error messages in terminal
2. Review console in browser (F12)
3. Ensure all dependencies are installed
4. Verify both servers are running
5. Check API URL configuration
6. Review documentation files

---

**Happy coding! 🎉**
