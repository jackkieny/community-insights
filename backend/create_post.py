# Import Flask and security modules
from flask import Flask, request, Blueprint, session 
from flask_login import login_required, current_user
import requests, re

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

@create_post.route('/api/checkembedlink', methods=['POST'])
@login_required
def check_embed_link():
    # Set up the urls for the different embed types
    youtube_url = 'https://www.youtube.com/oembed?format=json&url='
    vimeo_url = 'https://vimeo.com/api/oembed.json?url='
    loom_url = 'https://www.loom.com/v1/oembed?url='
    wista_url = 'https://fast.wistia.com/oembed?format=json&url='

    # Get the data from the request
    data = request.get_json()

    # Check the link type and set the url
    if data['linkType'] == 'youtube':
        url = youtube_url + data['embeddedLink']
    elif data['linkType'] == 'vimeo':
        url = vimeo_url + data['embeddedLink'] 
    elif data['linkType'] == 'loom':
        url = loom_url + data['embeddedLink']
    elif data['linkType'] == 'wistia':
        url = wista_url + data['embeddedLink']
    else:
        return {'error': 'Invalid link type'}, 400

    # Make the request to the url
    response = requests.get(url)

    # Return the appropriate response
    if response.status_code == 200:
        return {
            'success': 'success',
            'html': response.json()['html']
            }, 200
    else:
        return {'error': 'Invalid link'}, 400
