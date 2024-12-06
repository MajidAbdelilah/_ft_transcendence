from django.urls import path
from  . import views
from rest_framework_simplejwt import views as jwt_views
from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [
    path ('register/', views.Register_view.as_view()),
    path('login/', views.LoginView.as_view()),
    path('logout/', views.Logout_view.as_view()),
    path('sendcode/', views.Send2FAcode.as_view(), name='SendEmail'),
    path('CodeVerification/', views.CodeVerification.as_view(), name='GetCode'),
    path('update_user/', views.Update_user.as_view(), name='Update_user'),
    path('user/', views.User_view.as_view(), name='user'),
    path('users/', views.get_users.as_view(), name='users'),
    path('user_2fa/', views._2fa_verification.as_view(), name='2fa_verification'),
    path('password_generate/', views._42_generated_password.as_view())
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                            document_root=settings.MEDIA_ROOT)