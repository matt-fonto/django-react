# Backend

### Quick reflection: Node vs. Django

#### Django

- Principles:

  - Batteries included: project comes together with all possible parts required for full usability
  - Convention over configuration: Core components (models, views, serializers, forms, etc) have a predefined structure

- Built-in features:

  - Django comes with ORM, migrations, authentication, admin panel out of the box

- Explict design:
  - Layers have specific roles:
    - Models: define data
    - Serializers: handle data transformation
    - Views: manage request/response logic
    - URLS: map views to endpoints

#### Node

- Flexibility
- Configuration over convention
- Architectural decisions rely mainly on the developer

### Django Concepts

1. Apps: Inside the project, there can be multiple apps
   Project/
   ├── App1/
   │ ├── models/
   │ ├── views/
   │ ├── urls/
   ├── App2/
   │ ├── models/
   │ ├── views/
   │ ├── urls/

## Getting Started

```bash
python3 -m venv env # create virtual env
source env/bin/activate # activate virtual env

echo $VIRTUAL_ENV # to check if we're inside a virtual environment
which python # another possibility

# Add requirements.txt to root, then run:
pip install -r requirements.txt

# requirements.txt
asgiref
Django
django-cors-headers
djangorestframework
djangorestframework-simplejwt
PyJWT
pytz
sqlparse
psycopg2-binary
python-dotenv

django-admin startproject server # create the backend

cd server # go to server directory
python manage.py startapp api # start an app
```

## Settings.py

- We need to customize the settings in the project-level slightly

```py
from datetime import timedelta
from dotenv import load_dotenv
import os

load_dotenv()

...
ALLOWED_HOSTS = ["*"]

# JWT Settings
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ]
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
}

INSTALLED_APPS = [
    ...
    'django.contrib.staticfiles',
    # add them
    "api",
    "rest_framework",
    "corsheaders"
]

MIDDLEWARE = [
    ...
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # add it
    "corsheaders.middleware.CorsMiddleware"
]

... # at the bottom
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
```

## Dependencies

- Once installed, the dependencies will be on env > lib > python_version > list of dependencies

## JWT

- Json Web Token
- Commonly used in authentication and authorization flows

```js
{
    "headers": {
        "Authorization": "Bearer XXXX.YYYY.ZZZZ"
                            // header.payload.signature
    }
}
```

- The backend needs to know who we're and which permissions we have

### Authorization

1. Client signs in/registers. User enters login crendentials
2. Server verifies credentials and returns JWT
   - This JWT contains claims about the user's permission to application/website
   - Now, the JWT works as a "badge", which goes with the user where he goes. It's like we're in a factory and through the "badge" the user has some access or no to the structure of the factory
   - Never store JWT in local storage or session data
   - Instead, they should be stored in a HttpOnly cookie. This isn't accessible from JavaScript/browser code
3. Client submits token in every future request
   3.1. This is what allows the client to access routes/services/resources

### Structure

JWTs are composed of:

1. Header => XXXXXX.

   - The header is further divided into two pieces, being:
     - 1.1 Type of token
     - 1.2 Type of algorithm being used

   ```js
   {
       "type": "Bearer",
       "algorithm": "RSA"
   }
   ```

   - This information is encoded with "base64urlEncoded"

2. Payload => YYYYYY.

   - Contains the claims: information about the client, entity or any additional data
     - 2.1 Registered claims
     - 2.2 Public claims
     - 2.3 Private claims

   ```js
    // each of these lines is a claim
   {
      "username": "Matt",
      "admin": true,
      "exp": 12345678, // unix format
   }
   ```

   - Only store sensitive data in your payload if it's encrypted
     - Encryption: transforming human-readable plain text into incomprehensibe text (ciphertext)
     - Digital signature: a type of electronic signature that encrypts docs with digital codes

3. Signature => ZZZZZZ.

   - Encoded header + encoded payload + SECRET_KEY
   - Takes all this info to check if the data has been tempered with or if it's reliable

### Types of Tokens

- Access token: what will grant us access. What is used with the requests
- Refresh token: used to refresh the access token
  - Once the access token is expired, the refresh token will be submitted to the server. If the refresh token is valid, a new access token will be generated

Once the front-end receives them, it will store them in the cookies. So, we don't need to keep revalidating all the time.

## Serializers

They are like interpreters

- Serializers in Django REST Framework (DRF) are used to:
  - Convert our data into JSON format and vice versa
  - Convert Python objects (like Django models) into JSON, which can be consumed by the frontend
  - Validate incoming JSON data and convert it into Python objects for backend use
- JSON: JavaScript Object Notation, a lightweight data-interchange format
- ORM: Object-Relational Mapping, a programming technique for converting data between different systems

  - Python ORM: We write Python code, and it transforms it into database instructions

![Serializer View](https://miro.medium.com/v2/resize:fit:1000/1*UTCLKbdQmnyywpPqa6aNkw.png)

```py
# project > app > serializers.py
# server > api > serializers.py

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User # the model to serialize
        fields = ["id", "username", "password"] # the fields to serialize
        extra_kwargs = {"password": {"write_only": True}} # make sure the password is not returned in the response

    # we override the create method
    def create(self, validated_data):
        # User.objects.create_user => handles password hashing
        # by using it, we automatically hash the password before storing them
        user = User.objects.create_user(**validated_data) # ** is used to unpack the dictionary
        return user
```

## View

- Views in DRF handle HTTP requests and response. They:
  - Receive requests (ex: POST to create a user)
  - Process data (ex: validate, save, or fetch data)
  - Return appropriate responses (ex: JSON for success or error messages)

```py
# project > app > views.py
# server > api > views.py

# generics.CreateAPIView: simplifies the creation of a resource by reducing boilerplat

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all() # queryset: specify the data this view works with
    serializer_class = UserSerializer # serializer_class: specify the serializer used to validate and transform data
    permission_classes = [AllowAny] # permission_classes: defines who can access this view
```

### Django REST Framework (DRF) API Handling

#### Generic Views

Handle common CRUD operations with minimal boilerplate code. They are3 based on querysets and serializers.

- They provide functionality such as: list, retrieve, create, update, destroy

```py
class BlogPostListView(generics.ListAPIView):
   queryset = BlogPost.objects.all()
   serializer_class = BlogPostSerializers
```

Types:

- ListAPIView: GET list all
- CreatAPIView: POST
- RetrievedAPIView: GET single entity
- UpdateAPIView: PUT or PATCH
- DestroyAPIView: DELETE
- ListCreateAPIView: GET (list) + POST
- RetrieveUpdateDestoryAPIView: GET(single entity) + PUT/PATCH + DELETE

#### APIView

Most basic DRF view. It gives full control over the request handling, but requires more boilerplate

```py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class BlogPostAPIView(APIView):
   def get(self, request):
      posts = BlogPost.objects.all()
      serializer = BlogPostSerializer(posts, many=True) # doing something similar to zod
      return Response(serializer.data)

   def post(self, request):
      serializer = BlogPostSerializer(data=request.data)
      if serializer.is_valid():
         serializer.save()
         return Response(serializer.data, status=status.HTTP_201_CREATED)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

## Flow

> Request: Client -> URL -> View -> Serializer -> DB
> Response: DB -> Serializer -> View -> Client

```py
Client
   ↓ POST /api/users/
Django URLs (urls.py)
   ↓ Match URL pattern → Route to view
View (views.py)
   ↓ Handle request → Call serializer
Serializer (serializer.py)
   ↓ Validate → Process → Save to DB
Database (models.py)
   ↓ Save user → Return Python object
View (views.py)
   ↓ Conver Python object → JSON response
Client
```

1. Frontend sends a request (ex: `POST /api/users/`) to the backend. Request usually includes:

   - URL: endpoint for the action (`api/users`)
   - HTTP Method: defines the action (POST, GET, DELETE, PUT)
   - Headers: metadata, like `Content-Type` or authorization tokens
   - Body: the data payload

2. Django URLS receive the request and direct to the appropriate view

   ```py
       urlpatterns = [
       path('users/', CreateUserView.as_view(), name='create_user'),
       ]

       # when the backend servers the POST /api/users/ django matches the URL pattern and calss the CreateUserView.as_view()
   ```

3. View receives and handles the request

   - Retrieves and validates the incoming data
   - Uses the serializer to transform and process ata
   - Interacts with the db to perform operation
   - Prepares the response

4. Serializer will validate and convert the data

   - Validates the incoming data
   - Converts JSON into Python for backend use
   - Handles logic
   - Converts Python objects back to JSON for the response

5. Response is returned to the frontend with the created user data

## Creating user + Testing the auth

- Go to: `server/api/users/register` -> create the user
- Go to: `server/api/token` -> add credentials and get token
  - This will give us a refresh and access token. This is what the front-end would store
- In case we want to refresh the access token, go to: `server/api/token/refresh` and add the refresh token there. It will generate a new access token.

## Django Workflow

Define the model -> Apply Migrations -> Create Serializer -> Create View -> Configure URL -> Test the API
Model -> Migration -> Serializer -> View -> URL (MMSVU: My mother sings very uniquely)

1. Define the model: Create the database structure for the data

- Create model in app's `model.py`
- Define the fields and their types

```py
from django.db import models

class BlogPost(models.Model):
   title = models.CharField(max_length=100)
   content = models.TextField()
   created_at = models.DateTimeField(auto_now_add=True)
   updated_at = models.DateTimeField(auto_now=True)

   def __str__(self):
      return self.title
```

2. Apply Migrations: Sync the model with the database

```bash
python manage.py makemigrations # generate migration files
python manage.py migrate # apply the migrations to the db
```

3. Create the serializer: Define how the model's data is converted to/from JSON

- Create the serializer in app's `serializers.py`
- Use `ModelSerializer` for most use cases

```py
from rest_framework import serializers
from .models import BlogPost

class BlogPostSerializer(serializers.ModelSerializer):
   class Meta:
      model = BlogPost
      fields = ['id', 'title', 'content', 'created_at', 'updated_at']
```

4. Create Views: handle requests and perform actions (CRUD)

- Use DRF generic views for common actions (ex: CRUD)
- Assign the serializer and queryset to the view

```py
from rest_framework import generics
from .models import BlogPost
from .serializers import BlogPostSerializer

class BlogPostListCreateView(generics.ListCreateAPIView):
   queryset = BlogPost.objecs.all()
   serializer_class = BlogPostSerializer

class BlogPostDetailView(generics.RetrieveUpdateDestroyAPIView):
   queryset = BlogPost.objects.all()
   serializer_class = BlogPostSerializer
```

5. Configure the URL: Map the views to specific endpoints

- Add URL pattern in project's `urls.py`

```py
from django.urls import path
from .views import BlogPostListCreateView, BlogPostDetailView

urlsPatterns = [
   path("blogposts/", BlogPostListCreateView.as_view(), name="blogpost-list-create"),
   path("blogposts/<int:pk>/", BlogPostDetailView.as_view(), name="blogpost-detail")
]
```
