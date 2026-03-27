# 🧪 Hospital Management System - Testing Guide

## Comprehensive Testing Checklist

Use this guide to test all features of the Hospital Management System after setup.

---

## 🚀 Setup Status Check

### Before Testing
- [ ] Both servers running (backend on 8000, frontend on 3000)
- [ ] Database migrations completed
- [ ] No error messages in terminal
- [ ] Browser console clean (F12)

---

## 📝 Registration & Authentication Tests

### Patient Registration
1. [ ] Navigate to `/register`
2. [ ] Select "Patient" role
3. [ ] Enter name: `John Patient`
4. [ ] Enter username: `patient_john`
5. [ ] Enter email: `john@hospital.com`
6. [ ] Enter phone: `1234567890`
7. [ ] Enter password: `Test@123`
8. [ ] Click Register
9. [ ] ✅ Should redirect to patient dashboard

### Doctor Registration
1. [ ] Click "Register"
2. [ ] Select "Doctor" role
3. [ ] Enter name: `Dr. Sarah Smith`
4. [ ] Enter username: `doctor_sarah`
5. [ ] Enter email: `sarah@hospital.com`
6. [ ] Enter phone: `9876543210`
7. [ ] Enter password: `Doc@123`
8. [ ] **Professional Info:**
   - [ ] Specialization: `Cardiology`
   - [ ] License Number: `DOC123456`
   - [ ] Qualification: `MBBS, MD Cardiology`
   - [ ] Years of Experience: `5`
   - [ ] Consultation Fee: `500`
9. [ ] Click Register
10. [ ] ✅ Should redirect to doctor dashboard

### Admin Registration (Optional)
1. [ ] You can register as admin if needed
2. [ ] Follow similar process with professional details

### Login Tests
1. [ ] Logout from current account
2. [ ] Login as patient
   - [ ] Enter credentials
   - [ ] ✅ Redirect to patient dashboard
3. [ ] Logout
4. [ ] Login as doctor
   - [ ] Enter credentials
   - [ ] ✅ Redirect to doctor dashboard
5. [ ] Logout
6. [ ] Test invalid credentials
   - [ ] Should show error message

---

## 👤 Patient Dashboard Tests

### Overview Section
1. [ ] Navigate to Patient Dashboard
2. [ ] Check stats display:
   - [ ] Upcoming Appointments count
   - [ ] Completed Appointments count
   - [ ] Pending Payments count
3. [ ] Check recent appointments table
4. [ ] All data should display correctly

### Find Doctors Section
1. [ ] Click "Find Doctors" in sidebar
2. [ ] Should display all available doctors
3. [ ] Each doctor card should show:
   - [ ] Name
   - [ ] Specialization
   - [ ] Qualification
   - [ ] Experience
   - [ ] Fee
   - [ ] Book Appointment button

### Book Appointment
1. [ ] Click "Book Appointment" on a doctor card
2. [ ] Modal should open with:
   - [ ] Doctor name displayed
   - [ ] Date field
   - [ ] Time field
   - [ ] Reason textarea
3. [ ] Fill in appointment details:
   - [ ] Date: Future date
   - [ ] Time: Valid time
   - [ ] Reason: "Checkup"
4. [ ] Click "Book Appointment"
5. [ ] ✅ Should see success message
6. [ ] ✅ Appointment should appear in list

### My Appointments Section
1. [ ] Click "My Appointments" in sidebar
2. [ ] Should show all your appointments
3. [ ] Each appointment should display:
   - [ ] Doctor name
   - [ ] Specialization
   - [ ] Date & Time
   - [ ] Status badge
   - [ ] Cancel button (if scheduled)
4. [ ] Test Cancel button:
   - [ ] Click Cancel
   - [ ] Confirm cancellation
   - [ ] ✅ Status should change to cancelled

### Billing Section
1. [ ] Click "Billings" in sidebar
2. [ ] Should show all your billings
3. [ ] Check billing information:
   - [ ] Appointment doctor
   - [ ] Total Amount
   - [ ] Paid Amount
   - [ ] Balance
   - [ ] Payment Status

### Profile Section
1. [ ] Click "Profile" in sidebar
2. [ ] Should display your medical profile:
   - [ ] Name
   - [ ] Email
   - [ ] Phone
   - [ ] Blood Group
   - [ ] Allergies
   - [ ] Medical History
3. [ ] Information should be correct

---

## 👨‍⚕️ Doctor Dashboard Tests

### Overview Section
1. [ ] Navigate to Doctor Dashboard
2. [ ] Check stats:
   - [ ] Upcoming Appointments count
   - [ ] Completed Appointments count
3. [ ] Check availability toggle:
   - [ ] Should be checked by default
   - [ ] Toggle off and on
   - [ ] ✅ Should update availability
4. [ ] View upcoming appointments table:
   - [ ] Patient name
   - [ ] Date & Time
   - [ ] Reason
   - [ ] Complete button

### Complete Appointment
1. [ ] Click "Complete" on an appointment
2. [ ] ✅ Appointment status should change
3. [ ] Verify completed count increases

### View Appointments
1. [ ] Click "Appointments" in sidebar
2. [ ] Should show all appointments:
   - [ ] Scheduled
   - [ ] Completed
   - [ ] Cancelled
3. [ ] Verify appointment data accuracy

### View Patients
1. [ ] Click "Patients" in sidebar
2. [ ] Should show all patients you have appointments with
3. [ ] Each patient should display:
   - [ ] Name
   - [ ] Email
   - [ ] Phone
   - [ ] Blood Group
   - [ ] Medical History

### Profile Section
1. [ ] Click "Profile" in sidebar
2. [ ] Should display doctor information:
   - [ ] Name
   - [ ] Email
   - [ ] Specialization
   - [ ] Consultation Fee
   - [ ] Years of Experience
   - [ ] Qualification
3. [ ] Click "Edit" button
4. [ ] Edit form should appear with:
   - [ ] Clinic Address field
   - [ ] Available From (time)
   - [ ] Available Till (time)
5. [ ] Update information
6. [ ] Click "Save Changes"
7. [ ] ✅ Profile should update
8. [ ] Click "Cancel" to close form

---

## 👥 Admin Dashboard Tests

### Overview Section
1. [ ] Navigate to Admin Dashboard
2. [ ] Should show 4 stat cards:
   - [ ] Total Patients
   - [ ] Total Doctors
   - [ ] Appointments
   - [ ] Billings
3. [ ] Recent appointments table should display

### Patients Management
1. [ ] Click "Patients" in sidebar
2. [ ] Should show all registered patients:
   - [ ] Name
   - [ ] Email
   - [ ] Phone
   - [ ] Blood Group
   - [ ] Delete button
3. [ ] Test Delete button:
   - [ ] Click Delete on a patient
   - [ ] Confirm deletion
   - [ ] ✅ Patient should be removed

### Doctors Management
1. [ ] Click "Doctors" in sidebar
2. [ ] Should show all registered doctors:
   - [ ] Name
   - [ ] Specialization
   - [ ] Email
   - [ ] Consultation Fee
   - [ ] Availability status
   - [ ] Delete button
3. [ ] Test Delete button (optional)

### Appointments Management
1. [ ] Click "Appointments" in sidebar
2. [ ] Should show all appointments:
   - [ ] Patient name
   - [ ] Doctor name
   - [ ] Date & Time
   - [ ] Status badge
3. [ ] Verify data accuracy

### Billings Management
1. [ ] Click "Billings" in sidebar
2. [ ] Should show all billings:
   - [ ] Patient name
   - [ ] Total Amount
   - [ ] Paid Amount
   - [ ] Balance
   - [ ] Payment Status
3. [ ] Verify calculations

---

## 🔐 Authentication & Security Tests

### Token Persistence
1. [ ] Login to account
2. [ ] Refresh page (F5)
3. [ ] ✅ Should remain logged in
4. [ ] Close and reopen browser
5. [ ] ✅ Should still be logged in (token in localStorage)

### Logout Test
1. [ ] Click Account menu
2. [ ] Click "Logout"
3. [ ] ✅ Should redirect to login page
4. [ ] Refresh page
5. [ ] ✅ Should stay on login (not auto-login)

### Protected Routes
1. [ ] Logout
2. [ ] Try to access `/patient/dashboard` directly in URL
3. [ ] ✅ Should redirect to login
4. [ ] Try `/doctor/dashboard`
5. [ ] ✅ Should redirect to login
6. [ ] Try `/admin/dashboard`
7. [ ] ✅ Should redirect to login

### Role-Based Access
1. [ ] Login as patient
2. [ ] Try to access doctor dashboard URL
3. [ ] ✅ Should redirect to login or deny access
4. [ ] Try to access admin dashboard URL
5. [ ] ✅ Should redirect to login or deny access

---

## 🎨 UI/UX Tests

### Responsiveness
1. [ ] Open on desktop (1920x1080)
   - [ ] Layout looks good
   - [ ] All elements visible
   - [ ] No overflow
2. [ ] Open on tablet (800x600)
   - [ ] Layout adapts
   - [ ] Mobile-friendly
3. [ ] Open on mobile (375x667)
   - [ ] Single column layout
   - [ ] Sidebar visible
   - [ ] Tables scrollable

### Form Validation
1. [ ] Try to submit empty registration form
2. [ ] ✅ Should show validation errors
3. [ ] Try to book appointment without date
4. [ ] ✅ Should show error message
5. [ ] Enter invalid email format
6. [ ] ✅ Should show email validation error

### Error Handling
1. [ ] Try login with wrong password
2. [ ] ✅ Should show "Invalid credentials" error
3. [ ] Try to register with existing username
4. [ ] ✅ Should show error message
5. [ ] Network error simulation
6. [ ] ✅ Should show error toast

---

## 🔄 Data Flow Tests

### Appointment Flow
1. [ ] Patient books appointment
2. [ ] [ ] Admin can see it in appointments list
3. [ ] [ ] Doctor can see it in upcoming appointments
4. [ ] Doctor completes appointment
5. [ ] [ ] Patient sees status as "completed"
6. [ ] [ ] Doctor sees increased completed count

### Billing Flow
1. [ ] Create appointment
2. [ ] [ ] Billing record should be created
3. [ ] [ ] Admin can see billing in billings section
4. [ ] [ ] Patient can see billing with payment status
5. [ ] [ ] Patient can track pending payments

---

## 📊 API Testing (Optional)

### Using Browser DevTools
1. [ ] Open inspection (F12)
2. [ ] Go to Network tab
3. [ ] Perform actions and check API calls:
   - [ ] Login returns tokens
   - [ ] Register returns 201
   - [ ] Appointment creation returns 201
   - [ ] Data fetching returns 200

### Check Token in Storage
1. [ ] Open DevTools
2. [ ] Go to Application > Local Storage
3. [ ] [ ] `access_token` should be present
4. [ ] [ ] `refresh_token` should be present
5. [ ] [ ] `user` object should be present

---

## ✅ Performance Tests

### Load Times
1. [ ] Dashboard page loads < 2 seconds
2. [ ] Data tables render smoothly
3. [ ] No lag when scrolling
4. [ ] Transitions are smooth

### Memory Usage
1. [ ] Open DevTools > Performance
2. [ ] Record page interaction
3. [ ] No memory leaks
4. [ ] Smooth frame rate (60 FPS)

---

## 📋 Final Checklist

### Backend
- [ ] Django server running without errors
- [ ] All models created properly
- [ ] Database migrations successful
- [ ] API endpoints responding correctly
- [ ] Admin panel accessible
- [ ] CORS configured correctly

### Frontend
- [ ] React app running without console errors
- [ ] All pages load correctly
- [ ] All components render properly
- [ ] Styling looks consistent
- [ ] Navigation works smoothly
- [ ] API calls successful

### Features
- [ ] User registration works
- [ ] Login/Logout works
- [ ] All dashboards accessible
- [ ] Data displays correctly
- [ ] CRUD operations work
- [ ] Role-based access works
- [ ] Appointments can be booked
- [ ] Appointments can be completed
- [ ] Billing displays correctly
- [ ] Profiles can be updated

### Security
- [ ] Authentication required for protected routes
- [ ] Role-based access enforced
- [ ] Tokens stored securely
- [ ] No sensitive data in URLs
- [ ] Form inputs validated

---

## 🐛 Debugging Tips

If tests fail:

1. **Check terminal for errors**
   - Backend terminal: Python/Django errors
   - Frontend terminal: React errors

2. **Check browser console (F12)**
   - Network errors
   - JavaScript errors
   - API response errors

3. **Check Network tab**
   - API responses
   - Status codes
   - Request/Response bodies

4. **Check Redux/State**
   - localStorage contents
   - Component states

5. **Database issues**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

---

## 📝 Test Results Template

Use this to document your testing:

```
Test Date: ________
Tester: ________

✅ Registration: PASS / FAIL
✅ Login: PASS / FAIL
✅ Patient Dashboard: PASS / FAIL
✅ Doctor Dashboard: PASS / FAIL
✅ Admin Dashboard: PASS / FAIL
✅ Appointments: PASS / FAIL
✅ Billings: PASS / FAIL
✅ UI/UX: PASS / FAIL
✅ Security: PASS / FAIL

Issues Found:
- Issue 1: ...
- Issue 2: ...

Notes:
- ...
```

---

## 🎯 What to Test First

**Quick 10-Minute Test:**
1. ✅ Register as patient
2. ✅ Register as doctor
3. ✅ Login as patient
4. ✅ Browse doctors
5. ✅ Book appointment
6. ✅ Login as doctor
7. ✅ View appointments
8. ✅ Complete appointment
9. ✅ Logout
10. ✅ Verify appointment status updated

---

## 🏆 Test Status Tracking

| Feature | Status | Notes |
|---------|--------|-------|
| User Registration | ⬜ | |
| User Login | ⬜ | |
| Patient Dashboard | ⬜ | |
| Doctor Dashboard | ⬜ | |
| Admin Dashboard | ⬜ | |
| Appointment Booking | ⬜ | |
| Appointment Completion | ⬜ | |
| Billing System | ⬜ | |
| Profile Management | ⬜ | |
| CRUD Operations | ⬜ | |

---

## 📞 Still Having Issues?

1. Check README.md for setup help
2. Review QUICK_START.md for common issues
3. Check browser console (F12)
4. Check terminal for error messages
5. Verify both servers are running
6. Clear browser cache (Ctrl+Shift+Delete)

---

**Good luck with your testing! 🚀**

If all tests pass, your Hospital Management System is ready for use! ✅
