#!/bin/bash
npm install
apt-get update && apt-get install -y nginx openssl curl systemctl\
    && rm -rf /var/lib/apt/lists/*
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx.key -out nginx.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=Department/CN=localhost"
cp nginx.crt /etc/ssl/certs/nginx.crt
cp nginx.key /etc/ssl/private/nginx.key
cp nginx_conf/Default.conf /etc/nginx/nginx.conf
echo "127.0.0.1   Pong-Game-1337" >> /etc/hosts
systemctl start nginx
npm run dev 