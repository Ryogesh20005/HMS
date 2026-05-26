# 0002_create_admin_user.py
"""Migration to create a default admin user.

This migration adds a superuser with:
  username: admin
  email: admin@example.com
  password: admin1234   (hashed securely)
  role: 'admin'

If the user already exists, it does nothing.
"""

from django.db import migrations
from django.contrib.auth import get_user_model

def create_admin_user(apps, schema_editor):
    User = get_user_model()
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_user(
            username='admin',
            email='admin@cholan.com',
            password='admin123',
            role='admin',
            first_name='Cholan',
            last_name='Admin',
            is_staff=True,
            is_superuser=True,
        )
        admin.save()

def remove_admin_user(apps, schema_editor):
    User = get_user_model()
    User.objects.filter(username='admin').delete()

class Migration(migrations.Migration):
    dependencies = [
        ('hospital_app', '0001_initial'),
    ]
    operations = [
        migrations.RunPython(create_admin_user, reverse_code=remove_admin_user),
    ]
