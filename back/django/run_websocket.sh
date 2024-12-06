#!/bin/bash
python3 -m venv ../env
# Activate virtual environment
source ../env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput
export DJANGO_SETTINGS_MODULE=game.settings  # Adjust to your project
# Start Daphne server
daphne -b 127.0.0.1 -p 8001 game.asgi:application