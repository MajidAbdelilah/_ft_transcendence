from django.urls import path
from  . import views
from rest_framework_simplejwt import views as jwt_views
urlpatterns = [
    path ('register/', views.Register_view.as_view()),
    path('login/', views.LoginView.as_view()),
    path('logout/', views.Logout_view.as_view()),
    path('sendcode/', views.Send2FAcode.as_view(), name='SendEmail'),
    path('CodeVerification/', views.CodeVerification.as_view(), name='GetCode'),
    path('update_user/', views.Update_user.as_view(), name='Update_user'),
    path('user/', views.User_view.as_view(), name='user')
]