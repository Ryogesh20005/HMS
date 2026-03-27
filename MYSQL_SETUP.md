# MySQL Setup Guide for Hospital Management System

## Database Configuration

- **Database Name:** hmsdb
- **Database User:** root
- **Database Password:** yosh_46
- **Database Host:** localhost
- **Database Port:** 3306
- **Character Set:** utf8mb4

## Windows Installation & Setup

### Step 1: Install MySQL

1. Download MySQL Community Server from: https://dev.mysql.com/downloads/mysql/
2. Run the installer
3. Choose Setup Type: "Developer Default" or "Server only"
4. Ensure "MySQL Server" is selected
5. In Configuration:
   - **Config Type:** Development Machine
   - **MySQL Port:** 3306 (default)
   - **MySQL Service Name:** MySQL80
   - **Account:** Create MySQL user named "root" with password "yosh_46"

### Step 2: Create the Database

After MySQL is installed and running:

```bash
mysql -u root -pyosh_46
```

Then in MySQL prompt, paste:
```sql
CREATE DATABASE hmsdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

To verify:
```bash
mysql -u root -pyosh_46 -e "SHOW DATABASES;"
```

You should see `hmsdb` in the list.

## Mac Installation & Setup

### Step 1: Install MySQL

Using Homebrew:
```bash
brew install mysql
brew link mysql
brew services start mysql
mysql_secure_installation
```

Or download from: https://dev.mysql.com/downloads/mysql/

### Step 2: Create Database

```bash
mysql -u root -p
```

Enter the password when prompted, then:
```sql
CREATE DATABASE hmsdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

## Linux Installation & Setup

### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

### Step 2: Create Database

```bash
sudo mysql -u root -p
```

Then:
```sql
CREATE DATABASE hmsdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

## Verify MySQL Installation

Run:
```bash
mysql -u root -pyosh_46
```

If you see the MySQL prompt `mysql>`, MySQL is working correctly.

## Backend Configuration

The Django backend is already configured for MySQL:

**File:** `hospital_backend/hospital_project/settings.py`

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'hmsdb',
        'USER': 'root',
        'PASSWORD': 'yosh_46',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'charset': 'utf8mb4',
        }
    }
}
```

## Running Django with MySQL

After MySQL database is created:

```bash
cd hospital_backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Troubleshooting

### "Access denied for user 'root'@'localhost'"
- Check password is correct: `yosh_46`
- Verify MySQL is running
- Test with command: `mysql -u root -pyosh_46`

### "Can't connect to MySQL server"
- Ensure MySQL is running
- Windows: Check Services app for "MySQL80"
- Mac: `brew services list` should show mysql running
- Linux: `sudo systemctl status mysql`

### "Database doesn't exist: hmsdb"
Create it manually:
```bash
mysql -u root -pyosh_46 -e "CREATE DATABASE hmsdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### "No module named 'MySQLdb'"
Install MySQL client:
```bash
pip install mysqlclient
```

If that fails on Windows, try alternatives:
```bash
pip install PyMySQL
# Then add to settings.py:
# import pymysql
# pymysql.install_as_MySQLdb()
```

## Verify Database Creation

```bash
mysql -u root -pyosh_46 -e "SHOW DATABASES;"
```

Output should include:
```
| information_schema |
| hmsdb              |
| mysql              |
| performance_schema |
| sys                |
```

## Reset Database (If Needed)

If you need to reset the database completely:

```bash
mysql -u root -pyosh_46 -e "DROP DATABASE hmsdb; CREATE DATABASE hmsdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

Then run migrations again:
```bash
python manage.py migrate
```

## MySQL Workbench (Optional)

For a GUI to manage MySQL:

1. Download from: https://dev.mysql.com/downloads/workbench/
2. Install and run
3. Create a connection:
   - **Connection Name:** Hospital Management
   - **Hostname:** localhost
   - **Port:** 3306
   - **Username:** root
   - **Password:** yosh_46
4. Click "Test Connection"

## Performance Tips

The database is configured with:
- **Character Set:** utf8mb4 (supports all Unicode characters)
- **Collation:** utf8mb4_unicode_ci (case-insensitive)
- **Host:** localhost (for development)
- **Port:** 3306 (default MySQL port)

For production, consider:
- Using a managed database service
- Enabling SSL connections
- Setting up replication
- Optimizing indexes
- Regular backups

## Backup & Restore

### Backup:
```bash
mysqldump -u root -pyosh_46 hmsdb > hmsdb_backup.sql
```

### Restore:
```bash
mysql -u root -pyosh_46 hmsdb < hmsdb_backup.sql
```

## Connection Pooling (Advanced)

For production deployments, add to settings.py:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'hmsdb',
        'USER': 'root',
        'PASSWORD': 'yosh_46',
        'HOST': 'localhost',
        'PORT': '3306',
        'CONN_MAX_AGE': 600,  # Connection pooling
        'OPTIONS': {
            'charset': 'utf8mb4',
            'autocommit': True,
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        }
    }
}
```

## Tables Created

After running migrations, the following tables are created:

```
hmsdb
├── users (User accounts with roles)
├── patients (Patient medical information)
├── doctors (Doctor professional details)
├── appointments (Appointment scheduling)
├── billings (Payment tracking)
├── django_migrations (Migration history)
└── django_* (Other Django system tables)
```

## Next Steps

1. ✅ MySQL installed and database created
2. ✅ Backend configured
3. Run migrations: `python manage.py migrate`
4. Create superuser: `python manage.py createsuperuser`
5. Start server: `python manage.py runserver`
6. Access at: http://localhost:8000

---

**Setup complete! Your Hospital Management System is now using MySQL.** ✅
