from rest_framework_simplejwt.tokens import RefreshToken
from django.middleware import csrf
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework import status
from .serializers import UserSerializer
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
from django.core.mail import send_mail
from  ._2fa import Send2FAcode,CodeVerification
import requests



           
    
class Register_view(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            response_data = {"data": serializer.data, "message": "User added successfully!"}
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            response_data = {"data": None, "message": serializer.errors}
            return Response(response_data)
    


    
class Logout_view(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        resp = Response()
        token = request.COOKIES.get('access_token')
        if token:
            resp.delete_cookie('access_token')
            resp.data = {
                "data":None,
                "message": "Logged out successfully"
            }
            return resp
        else:
            resp.data = {
                "data":None,
                "message": "Unauthenticated !"
            }
            return resp

# @api_view(['GET'])
@permission_classes([IsAuthenticated])
class protected_view(APIView):
    # permission_classes = [IsAuthenticated]
    def get (self, request):
        return Response({"message": "This is a protected view."})






def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        data = request.data
        response = Response()
        email = data.get('email', None)
        password = data.get('password', None)
        if email is None :
            return Response({"message" : "set email ! ", "data": None})
        if password is None:
            return Response({"message" : "set password !", "data": None})
        user = authenticate(email=email, password=password)
        if user is not None:
                data = get_tokens_for_user(user)
                if data["access"] :
                    response.set_cookie(
                        key = settings.SIMPLE_JWT['AUTH_COOKIE'],
                        value = data["access"],
                        expires = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                        secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                        httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                        samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                    )
                # csrf.get_token(request)
                response.data = {"message" : "Login successfully","data":data}
                if user.is_2fa == False:
                    response.data = {"2fa" : True}
                    return redirect('SendEmail')
                return response
        else:
            return Response({"message" : "Invalid email or password !", "data": None}, status=status.HTTP_404_NOT_FOUND)
        

class User_view(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
        secret = settings.SECRET_KEY
        print("**"+ secret)
        if not token:
            raise  AuthenticationFailed('Unauthenticated !')
        try:
            payload = jwt.decode(token, secret, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired!')
        except jwt.DecodeError:
            raise AuthenticationFailed('Malformed token!')
        user = User.objects.filter(id=payload['user_id']).first()
        if user is None:
            raise AuthenticationFailed('User not found!')
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)