python3 -m venv ../myenv
docker-compose up -d
source ../myenv/bin/activate #RUN THIS COMMAND IN TERMINAL #python manage.py  runserver
pip install -r requirements.txt
touch ../.env