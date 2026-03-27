@echo off
REM Hospital Management System - Frontend Setup Script for Windows

echo Hospital Management System - Frontend Setup
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo Step 1: Installing Dependencies...
call npm install
if errorlevel 1 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Setup complete!
echo.
echo To run the development server, use: npm start
echo.
pause
