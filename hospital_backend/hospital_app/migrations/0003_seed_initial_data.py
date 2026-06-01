# -*- coding: utf-8 -*-
"""Data migration to seed initial patients and doctors.

Adds 10 patient users and 10 doctor users with associated profiles.
All details are fictional Tamil Nadu addresses.
"""

from django.db import migrations
from django.utils import timezone
import random

def create_initial_data(apps, schema_editor):
    User = apps.get_model('hospital_app', 'User')
    Patient = apps.get_model('hospital_app', 'Patient')
    Doctor = apps.get_model('hospital_app', 'Doctor')

    # Specializations list for doctors
    specializations = [
        'cardiology', 'dermatology', 'neurology', 'orthopedics',
        'pediatrics', 'psychiatry', 'surgery', 'gynecology',
        'general', 'radiology'
    ]

    # Create patients
    for i in range(1, 11):
        username = f'patient{i}'
        first_name = f'Patient{i}'
        last_name = 'TamilNadu'
        email = f'patient{i}@example.com'
        user = User.objects.create_user(
            username=username,
            password='Password@123',
            first_name=first_name,
            last_name=last_name,
            email=email,
            role='patient'
        )
        patient = Patient.objects.create(
            user=user,
            date_of_birth=timezone.datetime(1990, 1, i).date(),
            blood_group=random.choice(['A+', 'B+', 'O+', 'AB+']),
            address='Chennai, Tamil Nadu, India',
            phone=f'09{random.randint(10000000, 99999999)}',
        )
        # Optional: Add extra fields if desired
        patient.save()

    # Create doctors
    for i in range(1, 11):
        username = f'doctor{i}'
        first_name = f'Doctor{i}'
        last_name = 'TamilNadu'
        email = f'doctor{i}@example.com'
        user = User.objects.create_user(
            username=username,
            password='Password@123',
            first_name=first_name,
            last_name=last_name,
            email=email,
            role='doctor'
        )
        doctor = Doctor.objects.create(
            user=user,
            specialization=random.choice(specializations),
            license_number=f'LIC{1000 + i}',
            qualification='MBBS, MD',
            years_of_experience=random.randint(2, 20),
            consultation_fee=500.00,
            clinic_address='Coimbatore, Tamil Nadu, India',
            phone=f'09{random.randint(10000000, 99999999)}',
        )
        doctor.save()

def remove_initial_data(apps, schema_editor):
    User = apps.get_model('hospital_app', 'User')
    # Delete the seeded users
    User.objects.filter(username__in=[f'patient{i}' for i in range(1, 11)] + [f'doctor{i}' for i in range(1, 11)]).delete()

class Migration(migrations.Migration):
    dependencies = [
        ('hospital_app', '0002_create_admin_user'),
    ]

    operations = [
        migrations.RunPython(create_initial_data, reverse_code=remove_initial_data),
    ]
