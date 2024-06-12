# Import Flask and security modules
from flask import Flask, request, Blueprint, session
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import check_password_hash
from bson.json_util import dumps

# Import local modules
from database.database_init import mongo
from models.models import User

from scripts.login_to_skool import login_to_skool
from scripts.get_communities import skool_communities


# auth = Blueprint('auth', __name__, static_folder='../build', static_url_path='/')
auth = Blueprint('auth', __name__)

# Login Route
@auth.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']

    # Check if the user exists in the database
    user_data = mongo.db.users.find_one({'email' : email})
    # print(user_data)

    if data and user_data is not None and check_password_hash(user_data['password'], data['password']):
        user_obj = User(id=user_data['_id'], email=user_data['email'], password=user_data['password'], communityId=None)
        login_user(user_obj)
        session['user_id'] = dumps(user_data['_id'])
        return {'success': 'success'}
    else:
        return {'error': 'Email or password is incorrect'}, 401

# Session Check
@auth.route('/api/session', methods=['GET'])
def session_check():
    # print(current_user)
    # print(current_user.is_authenticated)
    if current_user.is_authenticated:
        return {'session': 'active'}
    else:
        return {'session': 'inactive'}

# Check Skool Account Exists
@auth.route('/api/skool', methods=['GET'])
@login_required
def get_skool():
    user_data = mongo.db.users.find_one({'_id' : current_user.id})

    if user_data and 'auth_token' in user_data:
        return {'success': 'success'}
    else:
        return {'error': 'Not found'}, 401
    
# Connect Skool Account
@auth.route('/api/connectskool', methods=['POST'])
@login_required
def connect_skool():
    data = request.get_json()

    auth_token = login_to_skool(data['skoolEmail'], data['skoolPassword'])

    if auth_token is not None:
        mongo.db.users.update_one({'_id': current_user.id}, {'$set': {'auth_token': auth_token}})
        return {'success': 'success'}

    else:
        return {'error': 'Invalid credentials'}, 401

# Get Communities
@auth.route('/api/get-communities', methods=['GET'])
@login_required
def get_communities():
    user_data = mongo.db.users.find_one({'_id' : current_user.id})

    if user_data and 'auth_token' in user_data:
        communities = skool_communities(user_data['auth_token'])
        return communities
    else:
        return {'error': 'Not found'}, 401

@auth.route('/api/selectcommunity', methods=['POST'])
@login_required
def select_community():
    data = request.get_json()

    try:
        session['community_id'] = data['communityId']
        return {'success': 'success'}
    except:
        return {'error': 'Invalid community ID'}, 401


# Logout Route
@auth.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return {'success': 'success'}
