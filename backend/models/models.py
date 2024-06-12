# Import Flask and ObjectID modules
from flask_login import UserMixin
from bson.objectid import ObjectId

# Import local modules
from database.database_init import mongo


### User Class ###
class User(UserMixin):
    def __init__(self, id, email, password, communityId):
        self.id = id
        self.email = email
        self.password = password
        self.communityId = communityId

    def set_community_id(self, community_id):
        self.communityId = community_id

    @staticmethod
    def get(user_id):
        user_data = mongo.db.users.find_one({'_id': ObjectId(user_id)})
        if not user_data:
            return None

        return User(id=user_data['_id'], email=user_data['email'], password=user_data['password'], communityId=user_data.get('communityId'))