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
import json
from authapp.models import User
import random
import string
from django.shortcuts import redirect, render
from django.http import JsonResponse
from django.core.mail import send_mail
from  ._2fa import Send2FAcode,CodeVerification, _2fa_verification, _42_generated_password
import requests


from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.conf import settings

           
    
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
        if token is not None :
            resp.delete_cookie('access_token')
            resp.data = {
                "data":None,
                "message": "Logged out successfully"
            }
            return resp
        token = request.COOKIES.get('intra_token')
        if token is not None :
            user_response = requests.get(settings.FORTY_TWO_USER_PROFILE_URL, headers={'Authorization': f'Bearer {token}'})
            if token is None:
                return JsonResponse({'error': 'Failed to get access token'}, status=400)
            else:
                response = Response()
                response.delete_cookie('intra_token')
                response.data = {
                    'message': 'Logged out successfully'
                }
                request.session.flush()
                return response
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
        userserialize = UserSerializer(user)
        if user is not None:
                data = get_tokens_for_user(user)
                if data["access"] :
                    if user.is_2fa == True:
                        # response.headers["Location"] = 'http://127.0.0.1:3000/settings'
                        # response.status_code = status.HTTP_302_FOUND
                        response.data = {"message" : "Login successfully","data":{"user": userserialize.data , "tokens":data }}
                        response.set_cookie(
                            key = settings.SIMPLE_JWT['AUTH_COOKIE'],
                            value = data["access"],
                            expires = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                            secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                            httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                            samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                            path='/',
                            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()
                        )
                    else:
                        if data["access"] :
                            response.set_cookie(
                                key = settings.SIMPLE_JWT['AUTH_COOKIE'],
                                value = data["access"],
                                expires = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                                secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                                httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                                samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                                path='/',
                                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
                            response.data = {"message" : "Login successfully","data":{"user": userserialize.data , "tokens":data }}
                    return response
        else:
            return Response({"message" : "Invalid email or password !", "data": None})
        

# class User_view(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self, request):
#         token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
#         secret = settings.SECRET_KEY
#         print("**"+ secret)
#         if not token:
#             raise  AuthenticationFailed('Unauthenticated !')
#         try:
#             payload = jwt.decode(token, secret, algorithms=['HS256'])
#         except jwt.ExpiredSignatureError:
#             raise AuthenticationFailed('Token has expired!')
#         except jwt.DecodeError:
#             raise AuthenticationFailed('Malformed token!')
#         user = User.objects.filter(id=payload['user_id']).first()
#         if user is None:
#             raise AuthenticationFailed('User not found!')
#         serializer = UserSerializer(user)
#         return Response(serializer.data, status=status.HTTP_200_OK)



class get_users(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        users = User.objects.values()
        listUsers = {}
        for i in users:
            listUsers[i['username']] = i
            print( " i    ---->    ", listUsers[i['username']])
        for j in listUsers:
            print("j:   ",listUsers[j])
        return Response(listUsers)
class Update_user(APIView):
    permission_classes = [IsAuthenticated]
    def post(self , request):
        response = Response()
        user = User.objects.get(email=request.user)
        new_password = request.data['new_password'] if request.data['new_password']!="" else None
        current_password = request.data['current_password'] if request.data['current_password']!="" else None
        username = request.data['username'] if request.data['username']!="" else None
        profile_photo = request.FILES.get('profile_photo') if request.data['profile_photo']!="" else None
        print("data ///// :", new_password,current_password, username,profile_photo)
        if user is not None  and current_password is not None and user.check_password(current_password):
            if username is not None : 
                otheruser =  User.objects.filter(username=username).first()
                if otheruser is not None and otheruser.email == user.email or otheruser is None:
                    user.username = username
                    user.save()
                    print("******* change username *********")       
            if new_password is not None:
                user.set_password(new_password)
                user.save()  
                print("******* change pass *********")     
            if profile_photo is not None:
                user.image_field  = profile_photo
                user.save()       
                print("******* change photo *********")
            user.save()       
            userserialize=UserSerializer(user)
            response.data = {"data" : userserialize.data , "message" : "updated succefully ! "}
            return response
        else:
            response.data = {"data" : None , "message" : "credentiels error"}
            return response

class User_view(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        response = Response()
        user = User.objects.get(email = request.user)
        if user is not None :
            serializer = UserSerializer(user)
            response.data = {"user": serializer.data}
            return response
        else:
            response.data = {"user": {"massage": "Error in getting user informations"}}
            return response
    
    
class User_is_logged_in(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        response = Response()
        user = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
        if user is  None :
            response.data = {"date":None,"message": "False"}
            return response
        else:
            validated_token = UntypedToken(user)
            if validated_token.payload['user_id'] == request.user['id']:
                print("ussser**")
            # user_s = (self.get_user(validated_token))
            response.data = {"date":None,"message": "True"}
            return response



# def decode_jwt_token(token):
#     try:
#         # Decode the token using UntypedToken
#         decoded_token = UntypedToken(token)
#         return {"decoded_token": decoded_token.payload, "message": "Token is valid"}
#     except InvalidToken as e:
#         return {"error": "Invalid token", "details": str(e)}
#     except TokenError as e:
#         return {"error": "Token error", "details": str(e)}

# # Example usage
# token = "your.jwt.token"
# result = decode_jwt_token(token)