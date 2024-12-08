from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all() # get all the users
    serializer_class = User # convert the data into JSON format
    permission_classes = [AllowAny] # allow anyone to create a user