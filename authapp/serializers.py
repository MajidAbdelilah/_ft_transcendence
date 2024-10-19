from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email

        return token
class UserSerializer(serializers.ModelSerializer):
    class Meta :
        model = User
        fields=['id','username','password', 'email']
        extra_kwargs = {
            'password':{'write_only':True} 
        }
    #errors should be handled in front : field empty or password and password confirm doesnt match
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None :
            instance.set_password(password)
        else :
            raise serializers.ValidationError("Passwords is empty.")
        instance.save()
        return(instance)