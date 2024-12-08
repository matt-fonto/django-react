# Backend

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
