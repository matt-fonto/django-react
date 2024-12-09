from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
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

