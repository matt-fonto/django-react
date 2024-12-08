from django.contrib.auth.models import User
from rest_framework import serializers

# Serializer: we will use this to convert our data into JSON format and vice versa
# JSON: JavaScript Object Notation, a lightweight data-interchange format
# ORM: Object-Relational Mapping, a programming technique for converting data between different systems
    # Python ORM: We write Python code, and it transforms it into database instructions

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User # the model to serialize
        fields = ["id", "username", "password"] # the fields to serialize
        extra_kwargs = {"password": {"write_only": True}} # make sure the password is not returned in the response

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data) # ** is used to unpack the dictionary
        return user