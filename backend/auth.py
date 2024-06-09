from flask import Flask, request, Blueprint
from werkzeug.security import check_password_hash
from database.database_init import mongo


# auth = Blueprint('auth', __name__, static_folder='../build', static_url_path='/')
auth = Blueprint('auth', __name__)

# Login Route
@auth.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    email = data['email']

    # Check if the user exists
    user_data = mongo.db.users.find_one({'email': email})
    if not user_data or not check_password_hash(user_data['password'], data['password']):
        return {'error': 'Email or password is incorrect.'}, 401

    user_object = 

    return {'success': 'success'}

