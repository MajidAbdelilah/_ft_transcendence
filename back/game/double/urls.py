from django.urls import path
from .views import MatchHistoryView, MatchHistoryByUsernameView

urlpatterns = [
    path('match-history/', MatchHistoryView.as_view(), name='match-history-list-create'),
    path('match-history/<str:username>/', MatchHistoryByUsernameView.as_view(), name='match-history-by-username'),
]