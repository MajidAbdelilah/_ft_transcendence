from django.contrib import admin
from authapp.models import User
from .models import Match, Tournament

admin.site.register(User)
admin.site.register(Match)
admin.site.register(Tournament)