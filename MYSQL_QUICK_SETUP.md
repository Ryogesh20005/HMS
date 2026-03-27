# 🗄️ MySQL Setup - Quick Commands

## Database Credentials
```
Host:     localhost
Port:     3306
User:     root
Password: yosh_46
Database: hmsdb
```

## Create Database (First Time)

### Windows/Mac/Linux:
```bash
mysql -u root -pyosh_46
```

Then in MySQL prompt:
```sql
CREATE DATABASE hmsdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

## Verify Database
```bash
mysql -u root -pyosh_46 -e "SHOW DATABASES;"
```

## Django Setup
```bash
cd hospital_backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Troublershoot

### Check MySQL Connection
```bash
mysql -u root -pyosh_46 -e "SELECT 1;"
```

### Reset Database (if needed)
```bash
mysql -u root -pyosh_46 -e "DROP DATABASE hmsdb; CREATE DATABASE hmsdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

## Full Setup Flow

1. **Create Database:**
   ```bash
   mysql -u root -pyosh_46
   CREATE DATABASE hmsdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd hospital_backend
   pip install -r requirements.txt
   ```

3. **Run Migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Start Backend:**
   ```bash
   python manage.py runserver
   ```

5. **Start Frontend (in another terminal):**
   ```bash
   cd hospital_frontend
   npm install
   npm start
   ```

## Configuration Location
- File: `hospital_backend/hospital_project/settings.py`
- Database Settings: DATABASES variable (lines ~65-75)

## For More Help
See: `MYSQL_SETUP.md` in the root folder
