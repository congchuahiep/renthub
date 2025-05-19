# firebase/config.py
import firebase_admin
from firebase_admin import credentials, db
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

cred = credentials.Certificate(os.path.join(BASE_DIR, 'firebase/chats-fd917-firebase-adminsdk-fbsvc-16c5d25223.json'))

# Chỉ khởi tạo một lần
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://chats-fd917-default-rtdb.firebaseio.com/'
    })
