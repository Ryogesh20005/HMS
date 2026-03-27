# Frontend Setup and Running Instructions

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

## Running the Frontend

### Development Mode
```bash
npm start
```

This will:
- Start the development server
- Open your browser at `http://localhost:3000`
- Enable hot reload on code changes

### Production Build
```bash
npm build
```

This will create an optimized production build in the `build/` directory.

## Environment Configuration

**API Base URL:**
The frontend is configured to use `http://localhost:8000/api` as the base URL.

To change this, modify the `API_URL` in `src/services/api.js`

## Frontend Architecture

### Pages
- **Login** (`src/pages/Login.jsx`) - User authentication
- **Register** (`src/pages/Register.jsx`) - User registration with role selection

### Dashboards
- **AdminDashboard** (`src/dashboards/AdminDashboard.jsx`) - Admin panel
- **DoctorDashboard** (`src/dashboards/DoctorDashboard.jsx`) - Doctor panel
- **PatientDashboard** (`src/dashboards/PatientDashboard.jsx`) - Patient panel

### Services
- **API Client** (`src/services/api.js`) - Axios configuration and API calls

### Styles
- **Global Styles** (`src/styles/auth.css`) - All CSS for the application

## Features

### Authentication
- JWT-based authentication
- Automatic token refresh
- Token storage in localStorage
- Protected routes

### Dashboards

**Admin Dashboard:**
- Overview with statistics
- Manage patients
- Manage doctors
- Manage appointments
- Manage billings

**Doctor Dashboard:**
- View appointments
- Mark appointments as completed
- View patient list
- Update availability
- Edit profile

**Patient Dashboard:**
- Browse available doctors
- Book appointments
- View appointment history
- Cancel appointments
- View billings
- View medical profile

## Troubleshooting

### Port 3000 Already in Use
The development server will ask if you want to use another port. Press `Y` to use a different port.

### API Connection Error
Ensure the backend server is running at `http://localhost:8000`. Check the API URL in `src/services/api.js`

### CORS Errors
The backend must have CORS enabled. Check the `CORS_ALLOWED_ORIGINS` in Django settings.

### White Screen
Check the browser console for errors. Ensure all dependencies are installed with `npm install`

## Development Tips

1. **Use React DevTools Extension** for better debugging
2. **Check Console Errors** for API or component issues
3. **Verify API Responses** using Network tab in browser DevTools
4. **Hot Reload** works automatically - just save your changes

## Building for Production

```bash
npm run build
```

The optimized build will be in the `build/` folder, ready for deployment.

## Available Scripts

```bash
npm start     # Start development server
npm build     # Create production build
npm test      # Run tests
npm eject     # Eject from create-react-app (one-way operation)
```

## Deployment

For production deployment, you can use services like:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- NGINX

Remember to update the `API_URL` to point to your production backend.
