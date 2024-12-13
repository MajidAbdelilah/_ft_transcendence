python3 -m venv ../env
source ../env/bin/activate
pip install django
pip install djangorestframework
pip install django-cors-headers
pip install channels
python manage.py makemigrations double_game
python manage.py makemigrations turn
python manage.py makemigrations
python manage.py migrate 
python manage.py runserver 10.11.7.9:8002