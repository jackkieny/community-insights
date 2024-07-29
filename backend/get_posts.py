from flask import Blueprint, request
from flask_login import login_required, current_user

from database.database_init import mongo

### CHANGE ME BEFORE DEPLOYING ###
get_post = Blueprint('get_post', __name__, static_folder='../build', static_url_path='/')
# get_post = Blueprint('get_post', __name__)

@get_post.route('/api/get-posts', methods=['GET'])
@login_required
def get_posts():
    userId = current_user.id
    posts = mongo.db.posts.find({'userId': userId})
    posts_list = list(posts)

    for post in posts_list:
        post['_id'] = str(post['_id'])
        post['userId'] = str(post['userId'])

    return {'posts': posts_list}, 200