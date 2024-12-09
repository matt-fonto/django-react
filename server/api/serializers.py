from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User # the model to serialize
        fields = ["id", "username", "password"] # the fields to serialize
        extra_kwargs = {"password": {"write_only": True}} # make sure the password is not returned in the response

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data) # ** is used to unpack the dictionary
        return user
    
