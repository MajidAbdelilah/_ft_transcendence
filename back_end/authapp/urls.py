from django.urls import path
from  . import views
from rest_framework_simplejwt import views as jwt_views
urlpatterns = [
    path ('register/', views.Register_view.as_view()),
    path('login/', views.LoginView.as_view()),
    path('logout/', views.Logout_view.as_view()),
    path('sendcode/', views.Send2FAcode.as_view(), name='SendEmail'),
    path('CodeVerification/', views.Send2FAcode.as_view(), name='GetCode'),
]