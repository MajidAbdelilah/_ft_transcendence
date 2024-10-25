import requests
from django.shortcuts import redirect
from django.conf import settings
from django.http import JsonResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
import jwt
from authapp.models import User
import random
import string
from django.shortcuts import redirect, render
from django.http import JsonResponse
from authapp.serializers import UserSerializer


class login (APIView):
    permission_classes=[AllowAny]
    def get(self, request):
        authorization_url = f"https://api.intra.42.fr/oauth/authorize?client_id={settings.FORTY_TWO_CLIENT_ID}&redirect_uri={settings.FORTY_TWO_REDIRECT_URI}&response_type=code&"f"scope=public projects&"f"prompt=consent"
        return redirect(authorization_url)

class callback(APIView):
    permission_classes=[AllowAny]
    def get(self, request):
        code = request.GET.get('code')
        print("code ****  " + code)
        if not code:
            return JsonResponse({'error': 'No code provided'}, status=400)
        # Exchange code for access token
        token_url = "https://api.intra.42.fr/oauth/token"
        response = requests.post(token_url, data={
            'grant_type': 'authorization_code',
            'client_id': settings.FORTY_TWO_CLIENT_ID,
            'client_secret': settings.FORTY_TWO_CLIENT_SECRET,
            'redirect_uri': settings.FORTY_TWO_REDIRECT_URI,
            'code': code,
        })
        print(" response ####  " + response.text)
        if response.status_code != 200:
            return JsonResponse({'error': 'Failed to obtain token'})

        token_data = response.json()
        print(" response ####  " , token_data)
        access_token = token_data.get('access_token')
        user_info_url = "https://api.intra.42.fr/v2/me"
        user_response = requests.get(user_info_url, headers={'Authorization': f'Bearer {access_token}'})
        resp = Response()
        resp.set_cookie(
                    key = 'intra_token',
                    value = access_token,
                    expires = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                    secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
        if user_response.status_code != 200:
            return JsonResponse({'error': 'Failed to fetch user info'}, status=400)
        user_data = user_response.json()
        existeduser = User.objects.filter(email = user_data['email']).first()
        link = user_data['image']['link']
        print ("image      ======  ", link)
        if existeduser is None:
            # return JsonResponse({'error': 'user exist'}, status=400)
            user = User.objects.create(username=user_data['login'], email=user_data['email'], password="", profile_photo=link)
            resp.data ={"added succefully"}
        # resp = ({"user added succefully !! "})
        # serializer = UserSerializer(data=data)
        # serializer.is_valid(raise_exception=True)
        # serializer.save()
        # Newuser = User.objects.create
        return resp

class profile(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        access_token = request.COOKIES.get('intra_token') 
        print("access ____" , access_token)
        if access_token is None:
            return JsonResponse({'error': 'Failed to fetch user info'}, status=400)
        else :
            user_info_url = "https://api.intra.42.fr/v2/me"
            user_response = requests.get(user_info_url, headers={'Authorization': f'Bearer {access_token}'})
            user_data = user_response.json()
            return JsonResponse(user_data)
        
        
class logout_intra(APIView):
    permission_classes=[IsAuthenticated]
    def post (self, request):
        access_token = request.COOKIES.get('intra_token')
        user_info_url = "https://api.intra.42.fr/v2/me"
        user_response = requests.get(user_info_url, headers={'Authorization': f'Bearer {access_token}'})
        if access_token is None:
            return JsonResponse({'error': 'Failed to get access token'}, status=400)
        else:
            response = Response()
            response.delete_cookie('intra_token')
            response.data = {
                'message': 'Logged out successfully'
            }
            request.session.flush()
            return response