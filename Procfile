web: gunicorn --bind 0.0.0.0:$PORT --chdir hospital_backend hospital_project.wsgi:application
release: cd hospital_backend && python manage.py migrate
