# Import Flask and security modules
from flask import request, Blueprint
from flask_login import login_required, current_user
from datetime import datetime
import requests
from apscheduler.schedulers.background import BackgroundScheduler
import atexit

# Import local modules
from database.database_init import mongo

from utils.job_to_dict import job_to_dict

### CHANGE ME BEFORE DEPLOYING ###
create_post = Blueprint('create_post', __name__, static_folder='../build', static_url_path='/')
# create_post = Blueprint('create_post', __name__)

@create_post.route('/api/post', methods=['POST'])
@login_required
def post():
    data = request.get_json()

    scheduled_datetime = datetime.strptime(f"{data['date']} {data['time']}", '%Y-%m-%d %H:%M')
    print(scheduled_datetime)

    userId = current_user.id
    communityId = mongo.db.users.find_one({'_id': current_user.id})['communityId']

    mongo.db.posts.insert_one({
        'userId': userId,
        'communityId': communityId,
        'status': 'scheduled',
        'scheduled_datetime': scheduled_datetime,
        'data': data
    })

    return {'success': 'success'}, 200



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
