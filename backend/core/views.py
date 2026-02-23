from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Note
from .serializers import NoteSerializer
from .services import GenerativeAIService

class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        from rest_framework.exceptions import ValidationError
        
        youtube_url = serializer.validated_data.get('youtube_url')
        
        try:
            print(f"Starting transcript fetch for: {youtube_url}")
            transcript = GenerativeAIService.get_transcript(youtube_url)
            print(f"Transcript fetched successfully, length: {len(transcript)}")
            
            print("Starting AI note generation...")
            ai_data = GenerativeAIService.generate_notes(transcript)
            print(f"AI data generated: {type(ai_data)}")
        except Exception as e:
            print(f"ERROR in perform_create: {str(e)}")
            import traceback
            traceback.print_exc()
            raise ValidationError({"error": str(e)})
        
        summary = ai_data.get('summary') if ai_data else None
        flashcards = ai_data.get('flashcards') if ai_data else None
        quiz = ai_data.get('quiz') if ai_data else None

        print(f"Saving note with summary: {type(summary)}, flashcards: {type(flashcards)}, quiz: {type(quiz)}")
        
        serializer.save(
            user=self.request.user,
            transcript=transcript,
            summary=summary,
            flashcards=flashcards,
            quiz=quiz
        )

class NoteDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)

class LogoutView(APIView):
    """
    Logout endpoint that blacklists the refresh token
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Blacklist the refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response(
                {"message": "Logout successful, token blacklisted"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
