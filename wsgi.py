#!/usr/bin/env python
"""
WSGI config for hospital_project project.
"""

import os
import sys

# Add the hospital_backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'hospital_backend'))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hospital_project.settings')

# Import and setup Django
import django
django.setup()

# Get the WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
