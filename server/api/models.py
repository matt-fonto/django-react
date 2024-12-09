from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    # specify the shape of model
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True) # automatically add this
    # on_delete=models.CASCADE => once we delete an user, delete the notes connected with it
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes") # relationship through Foreign Keys

    # specify how the model should be represented
    def __str__(self):
        return self.title

