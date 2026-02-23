from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import authenticate
from django.conf import settings
from datetime import timedelta
from .serializers import RegisterSerializer


class CookieTokenObtainPairView(APIView):
    """
    Custom login view that sets JWT tokens in httpOnly cookies
    """
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Username and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        # Create response
        response = Response({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
            }
        }, status=status.HTTP_200_OK)

        # Set httpOnly cookies
        # Access token cookie (short-lived)
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite='Lax',
            max_age=3600,  # 1 hour (matches ACCESS_TOKEN_LIFETIME)
        )

        # Refresh token cookie (long-lived)
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite='Lax',
            max_age=86400,  # 1 day (matches REFRESH_TOKEN_LIFETIME)
        )

        return response


class CookieTokenRefreshView(APIView):
    """
    Refresh access token using refresh token from cookie
    """
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response(
                {'error': 'Refresh token not found'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            # Validate and refresh token
            refresh = RefreshToken(refresh_token)
            new_access_token = str(refresh.access_token)

            # Get new refresh token if rotation is enabled
            new_refresh_token = str(refresh)

            # Create response
            response = Response({
                'message': 'Token refreshed successfully'
            }, status=status.HTTP_200_OK)

            # Set new access token cookie
            response.set_cookie(
                key='access_token',
                value=new_access_token,
                httponly=True,
                secure=False,  # Set to True in production
                samesite='Lax',
                max_age=3600,
            )

            # Set new refresh token cookie (rotated)
            response.set_cookie(
                key='refresh_token',
                value=new_refresh_token,
                httponly=True,
                secure=False,  # Set to True in production
                samesite='Lax',
                max_age=86400,
            )

            return response

        except TokenError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_401_UNAUTHORIZED
            )


class CookieTokenBlacklistView(APIView):
    """
    Logout view that blacklists refresh token and clears cookies
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            
            if refresh_token:
                # Blacklist the refresh token
                token = RefreshToken(refresh_token)
                token.blacklist()

            # Create response
            response = Response(
                {'message': 'Logout successful'},
                status=status.HTTP_200_OK
            )

            # Clear cookies
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')

            return response

        except Exception as e:
            # Even if blacklisting fails, clear cookies
            response = Response(
                {'message': 'Logout completed'},
                status=status.HTTP_200_OK
            )
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            return response


class AuthStatusView(APIView):
    """
    Check if user is authenticated
    """
    permission_classes = [AllowAny]

    def get(self, request):
        # Check if access token exists in cookies
        access_token = request.COOKIES.get('access_token')
        
        if access_token and request.user.is_authenticated:
            return Response({
                'isAuthenticated': True,
                'user': {
                    'id': request.user.id,
                    'username': request.user.username,
                }
            })
        
        return Response({
            'isAuthenticated': False
        })


class RegisterView(APIView):
    """
    User registration endpoint - creates new user account
    Optionally auto-logs in user after successful registration
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            # Create the user
            user = serializer.save()
            
            # Auto-login: Generate tokens and set cookies
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            # Create response with user data
            response = Response({
                'message': 'Registration successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                }
            }, status=status.HTTP_201_CREATED)

            # Set httpOnly cookies (auto-login)
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,  # Set to True in production with HTTPS
                samesite='Lax',
                max_age=3600,  # 1 hour
            )

            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=False,  # Set to True in production with HTTPS
                samesite='Lax',
                max_age=86400,  # 1 day
            )

            return response
        
        # Return validation errors
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
