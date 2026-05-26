# 0003_remove_extra_admins.py
"""Migration to ensure only the default admin user (username='admin') exists.
Any other user with role='admin' will be deleted.
"""

from django.db import migrations
from django.contrib.auth import get_user_model


def remove_extra_admins(apps, schema_editor):
    User = get_user_model()
    # Delete all admin users except the one with username 'admin'
    User.objects.filter(role='admin').exclude(username='admin').delete()


def restore_extra_admins(apps, schema_editor):
    # No automatic restore; this migration is irreversible.
    pass


class Migration(migrations.Migration):
    dependencies = [
        ('hospital_app', '0002_create_admin_user'),
    ]
    operations = [
        migrations.RunPython(remove_extra_admins, reverse_code=restore_extra_admins),
    ]
