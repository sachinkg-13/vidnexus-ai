from django.urls import path
from .views import NoteListCreateView, NoteDetailView, LogoutView
from .auth_views import (
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    CookieTokenBlacklistView,
    AuthStatusView,
    RegisterView,
)

urlpatterns = [
    path('notes/', NoteListCreateView.as_view(), name='note-list-create'),
    path('notes/<int:pk>/', NoteDetailView.as_view(), name='note-detail'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # Cookie-based authentication endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CookieTokenObtainPairView.as_view(), name='cookie-login'),
    path('auth/refresh/', CookieTokenRefreshView.as_view(), name='cookie-refresh'),
    path('auth/logout/', CookieTokenBlacklistView.as_view(), name='cookie-logout'),
    path('auth/status/', AuthStatusView.as_view(), name='auth-status'),
]
