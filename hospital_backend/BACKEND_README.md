# Backend Setup and Running Instructions

## Prerequisites
- Python 3.8 or higher
- pip package manager
- Virtual environment tool
- MySQL 8.0 or higher (already configured for hmsdb database)

## Installation Steps

### 0. Setup MySQL Database (Windows)

Before setting up Django, you need to create the MySQL database:

1. **Ensure MySQL is installed and running**
   ```bash
   mysql --version
   ```

2. **Create the database:**
   ```bash
   mysql -u root -p
   ```
   
   Enter password: `yosh_46`
   
   Then in MySQL prompt:
   ```sql
   CREATE DATABASE hmsdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   EXIT;
   ```

### 1. Create Virtual Environment
```bash
python -m venv venv
```

### 2. Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Database Migrations
```bash
python manage.py migrate
```

### 5. Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

### 6. Run Development Server
```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

## Important Notes

- **Database:** MySQL (hmsdb)
- **Database User:** root
- **Database Password:** yosh_46
- **Database Host:** localhost
- **Database Port:** 3306
- API documentation is available at `http://localhost:8000/api/`
- Admin panel is available at `http://localhost:8000/admin/`
- Default CORS settings allow requests from `http://localhost:3000` (React frontend)

## API Testing

You can test the API using tools like:
- Postman
- cURL
- Thunder Client
- VS Code REST Client

## Troubleshooting

### Import Errors
If you see import errors, ensure all dependencies are installed:
```bash
pip install -r requirements.txt -r --upgrade
```

### MySQL Connection Error
If you see "Can't connect to MySQL server":
1. Ensure MySQL is running
2. Check credentials (user: root, password: yosh_46)
3. Verify database exists: `hmsdb`
4. Try creating database manually:
   ```bash
   mysql -u root -pyosh_46 -e "CREATE DATABASE IF NOT EXISTS hmsdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

### Database Lock
If you encounter database lock errors:
```bash
python manage.py migrate --run-syncdb
```

### Port Already in Use
Run on a different port:
```bash
python manage.py runserver 8001
```

### MySQL Client Installation on Windows
If you get MySQLclient installation errors, install MySQL development headers first:
1. Download MySQL from https://dev.mysql.com/downloads/mysql/
2. Install with "MySQL Server" and "MySQL Workbench"
3. Then run: `pip install mysqlclient`

## Database Models

The system includes the following models synchronized with MySQL:
- User (Custom user model with roles)
- Patient (Medical information)
- Doctor (Professional details)
- Appointment (Scheduling)
- Billing (Payment tracking)

All configured with MySQL-compatible character sets and proper relationships.
