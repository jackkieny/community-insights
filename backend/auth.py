# Import Flask and security modules
from flask import Flask, request, Blueprint, session
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import check_password_hash
from bson.json_util import dumps

# Import local modules
from database.database_init import mongo
from models.models import User


# auth = Blueprint('auth', __name__, static_folder='../build', static_url_path='/')
auth = Blueprint('auth', __name__)

# Login Route
@auth.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']

    # Check if the user exists in the database
    user_data = mongo.db.users.find_one({'email' : email})
    print(user_data)

    if data and user_data is not None and check_password_hash(user_data['password'], data['password']):
        user_obj = User(id=user_data['_id'], email=user_data['email'], password=user_data['password'])
        login_user(user_obj)
        session['user_id'] = dumps(user_data['_id'])
        return {'success': 'success'}
    else:
        return {'error': 'Email or password is incorrect'}, 401

# Session Check
@auth.route('/api/session', methods=['GET'])
def session_check():
    print(current_user)
    print(current_user.is_authenticated)
    if current_user.is_authenticated:
        return {'session': 'active'}
    else:
        return {'session': 'inactive'}

# Logout Route
@auth.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return {'success': 'success'}
