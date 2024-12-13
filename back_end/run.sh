python3 -m venv ../myenv
docker-compose up -d
source ../myenv/bin/activate #RUN THIS COMMAND IN TERMINAL #python manage.py  runserver
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate 
touch ../.env
# export DJANGO_SETTINGS_MODULE=back_end.settings  # Adjust to your project
# Start Daphne server
# daphne -b 10.11.7.9 -p 8001 back_end.asgi:application