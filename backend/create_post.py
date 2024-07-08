# Import Flask and security modules
from flask import Flask, request, Blueprint, session 
from flask_login import login_required, current_user

# Import local modules
from database.database_init import mongo

from scripts.create_new_post import create_new_post

### CHANGE ME BEFORE DEPLOYING ###
create_post = Blueprint('create_post', __name__, static_folder='../build', static_url_path='/')
# create_post = Blueprint('create_post', __name__)

@create_post.route('/api/post', methods=['POST'])
@login_required
def post():
    data = request.get_json()

    auth_token = mongo.db.users.find_one({'_id': current_user.id})['auth_token']
    communityId = mongo.db.users.find_one({'_id': current_user.id})['communityId']
    skool_email = mongo.db.users.find_one({'_id': current_user.id})['skool_email']
    skool_pass = mongo.db.users.find_one({'_id': current_user.id})['skool_password']

    create_post_status_code = create_new_post(data, auth_token, communityId, skool_email, skool_pass)

    if create_post_status_code == 200:
        return {'success': 'success'}
    else:
        return {'error': 'Error creating post'}, 500
