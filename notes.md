# Backend

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

## Dependencies

- Once installed, the dependencies will be on env > lib > python_version > list of dependencies
