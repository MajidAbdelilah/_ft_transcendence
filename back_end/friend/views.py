from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets
from .models import Friend
from .serializers import FriendSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.db import IntegrityError
from rest_framework.permissions import IsAuthenticated

class FriendViewSet(viewsets.ViewSet):
    def post(self, request):
        authentication_classes = [JWTAuthentication]
        permission_classes = [IsAuthenticated]
        return 
        
   