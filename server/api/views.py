from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all() # queryset: specify the data this view works with
    serializer_class = UserSerializer # serializer_class: specify the serializer used to validate and transform data
    permission_classes = [AllowAny] # permission_classes: defines who can access this view