@echo off
REM Hospital Management System - Backend Setup Script for Windows

echo Hospital Management System - Backend Setup
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

echo Step 1: Creating Virtual Environment...
python -m venv venv
if errorlevel 1 (
    echo Error: Failed to create virtual environment
    pause
    exit /b 1
)

echo Step 2: Activating Virtual Environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo Error: Failed to activate virtual environment
    pause
    exit /b 1
)

echo Step 3: Installing Dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo Step 4: Running Database Migrations...
python manage.py migrate
if errorlevel 1 (
    echo Error: Failed to run migrations
    pause
    exit /b 1
)

echo.
echo Setup complete!
echo.
echo To run the server, keep this window open and the virtual environment is activated.
echo Run: python manage.py runserver
echo.
pause
