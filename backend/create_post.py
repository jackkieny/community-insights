# Import Flask and security modules
from flask import Flask, request, Blueprint, session 
from flask_login import login_user, login_required, logout_user, current_user

# Import local modules
from database.database_init import mongo
from models.models import User

from scripts.create_new_post import create_new_post

### CHANGE ME BEFORE DEPLOYING ###
# post = Blueprint('post', __name__, static_folder='../build', static_url_path='/')
create_post = Blueprint('create_post', __name__)

@create_post.route('/api/post', methods=['POST'])
@login_required
def post():
    data = request.get_json()
    # print(data)

    auth_token = mongo.db.users.find_one({'_id': current_user.id})['auth_token']
    communityId = mongo.db.users.find_one({'_id': current_user.id})['communityId']
    # print(auth_token)
    # print(current_user.communityId)

    print("Creating new post...")
    create_new_post(data, auth_token, communityId)
    return {'success': 'success'}
