from django.urls import path 
from .views import NoteListCreate, NoteDetailView, UserListView

urlpatterns  = [
    path("api/users", UserListView.as_view(), name="list-users"),

    path("notes/", NoteListCreate.as_view(), name='note-list'),
    path("notes/<int:pk>/", NoteDetailView.as_view(), name='note-detail') # it will perform a crud operation based on the method it receives (GET, UPDATE, DELETE)
]