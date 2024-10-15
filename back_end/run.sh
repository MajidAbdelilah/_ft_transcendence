python3 -m venv ../myenv
docker-compose up -d
source ../myenv/bin/activate
pip install -r requirements.txt
touch ../.env