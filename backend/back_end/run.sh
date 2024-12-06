#!/bin/bash
python3 -m venv ../myenv
# docker-compose up -d
touch ../.env
bash -c "source ../myenv/bin/activate "
pip install -r /app/backend/requirements.txt
python /app/backend/manage.py runserver 0.0.0.0:8000
# tail -f /dev/null