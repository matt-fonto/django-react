from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, UserListView, NoteListCreate, NoteDetailView # importing the view we created
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # users
    path("api/user/register/", CreateUserView.as_view(), name="register"), # link register view
 
    # api-auth
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"), # link TokenObtainPairView
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"), # link TokenRefresh view
    path("api-auth/", include("rest_framework.urls")), # link pre-built rest_frameworks

     # notes => we should forward this to api.urls
    path("api/", include("api.urls")),
]


