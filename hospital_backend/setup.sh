#!/bin/bash

# Hospital Management System - Backend Setup Script for Mac/Linux

echo "Hospital Management System - Backend Setup"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python3 is not installed"
    exit 1
fi

echo "Step 1: Creating Virtual Environment..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "Error: Failed to create virtual environment"
    exit 1
fi

echo "Step 2: Activating Virtual Environment..."
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo "Error: Failed to activate virtual environment"
    exit 1
fi

echo "Step 3: Installing Dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi

echo "Step 4: Running Database Migrations..."
python manage.py migrate
if [ $? -ne 0 ]; then
    echo "Error: Failed to run migrations"
    exit 1
fi

echo ""
echo "Setup complete!"
echo ""
echo "To run the server, use: python manage.py runserver"
echo ""
