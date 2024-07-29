# Import the necessary Flask modules
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from flask_login import LoginManager

# Import the modules from the other files
from database.database_init import mongo
from models.models import User
from auth import auth
from create_post import create_post
from get_posts import get_post

# Load the environment variables
import logging
import os
from dotenv import load_dotenv
load_dotenv()

### Initialize the Flask App ###
logging.basicConfig(level=logging.WARNING)


### CHANGE ME BEFORE DEPLOYING ###
app = Flask(__name__, static_folder='../build', static_url_path='/')
# app = Flask(__name__)
CORS(app)
app.config['MONGO_URI'] = os.getenv('MONGO_URI')
app.config['SESSION_TYPE'] = 'mongodb'
app.config['SESSION_MONGODB'] = MongoClient(os.getenv('MONGO_URI'))
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
mongo.init_app(app)

# @app.before_request
# def log_invalid_requests():
#     if not request.method in ['GET', 'POST']:
#         logging.warning(f"Invalid request method: {request.method}")
#         return jsonify({'error': 'Invalid request method'}), 400

# Initialize the LoginManager
login_manager = LoginManager()
login_manager.init_app(app)
@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

# Register the Blueprints
app.register_blueprint(auth)
app.register_blueprint(create_post)
app.register_blueprint(get_post)   

### Routes ###

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(port=5000, debug=True)