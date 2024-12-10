from django.contrib.auth.models import User

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser, FormParser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializers import UserSerializer, NoteSerializer
from .models import Note


# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all() # queryset: specify the data this view works with
    serializer_class = UserSerializer # serializer_class: specify the serializer used to validate and transform data
    permission_classes = [AllowAny] # permission_classes: defines who can access this view

# get all users
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class NoteListCreate(generics.ListCreateAPIView): 
    """ List and creates notes """

    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated] # only authenticated users can create notes

    # we need to customize the default methods get and create
    def get_queryset(self):
        return Note.objects.filter(author=self.request.user) # return only the user's notes
    
    def perform_create(self, serializer):
        # we don't need to check `serializer.is_valid()` because DRF validates the serializer before calling the method
        serializer.save(author=self.request.user) # if it's valid, we save the author to the serializer
        
class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    """ Retrieve (get one), update and delete note """
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    """ 
     in case we don't have extra logic, we don't need the perform_update and perform_destroy override, DRF does that automatically
    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else: 
            print(serializer.errors)
    
    def perform_destroy(self, instance):
        instance.delete() """

class LogoutView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser]  # Enable JSON and form-data parsing

    def post(self, request):
        try:
            print(request.data)
            refresh_token = request.data.get("refresh")
            print(refresh_token)

            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=400)

            token = RefreshToken(refresh_token)
            
            if token.get("token_type") != "refresh":
                return Response({"error": "Invalid token type. Refresh token required."}, status=400)
            token.blacklist() # add the token to the blacklist

            return Response({"message": "You have been logged out"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
