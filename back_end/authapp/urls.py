from django.urls import path
from  . import views
from rest_framework_simplejwt import views as jwt_views
urlpatterns = [
    # path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path ('register/', views.Register_view.as_view()),
    # path ('login/', views.Login_view.as_view()),
    path('user/', views.User_view.as_view()),
    path('logout/', views.Logout_view.as_view()),
    path('protected_view/', views.protected_view.as_view()),
    path('login/', views.LoginView.as_view()),
]