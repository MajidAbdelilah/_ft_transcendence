#!/bin/bash
cp /app/nginx.crt /etc/ssl/certs/nginx.crt
cp /app/nginx.key /etc/ssl/private/nginx.key
echo "Pong_Game_1337_test" >> /etc/hostname
python3 -m venv ../myenv
# docker-compose up -d
touch ../.env
bash -c "source ../myenv/bin/activate "
pip install -r /app/backend/requirements.txt
systemctl start nginx
python /app/backend/manage.py runserver 0.0.0.0:8000
EXPOSE 80 443
# tail -f /dev/null