pip install daphne
DJANGO_SETTINGS_MODULE=back_end.settings daphne -p 8001 back_end.asgi:application