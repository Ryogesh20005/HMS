"""
WSGI config for hospital_project project.
This file is at the root level to facilitate deployment on Render.
"""

import os
import sys
from pathlib import Path

# Add the hospital_backend directory to the Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR / 'hospital_backend'))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hospital_project.settings')

# Import the Django WSGI application
from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()
