import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hospital_project.settings')
django.setup()

from hospital_app.models import Patient, User

# Check if patient profile was created
user = User.objects.filter(username='patient123').first()
if user:
    print(f"✓ User Found: {user.username} (Role: {user.role})")
    patient = Patient.objects.filter(user=user).first()
    if patient:
        print(f"✓ Patient Profile Found: {patient}")
    else:
        print("✗ ERROR: Patient profile NOT found!")
else:
    print("✗ User not found")

# List all patients
print("\nAll Patients in DB:")
for p in Patient.objects.all():
    print(f"  - {p.user.username} ({p.user.email})")

print("\nAll Users:")
for u in User.objects.all():
    print(f"  - {u.username} (Role: {u.role})")
