pip install daphne
DJANGO_SETTINGS_MODULE=game.settings daphne -p 8001 game.asgi:application