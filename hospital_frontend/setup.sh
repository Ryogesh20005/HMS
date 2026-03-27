#!/bin/bash

# Hospital Management System - Frontend Setup Script for Mac/Linux

echo "Hospital Management System - Frontend Setup"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    exit 1
fi

echo "Step 1: Installing Dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi

echo ""
echo "Setup complete!"
echo ""
echo "To run the development server, use: npm start"
echo ""
