from flask_login import UserMixin
from database.database_init import mongo
from bson.objectid import ObjectId

class User(UserMixin):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    @staticmethod
    def get(user_id):
        user_data = mongo.db.users.find_one({'_id': ObjectId(user_id)})
        if not user_data:
            return None

        return User(id=user_data['_id'], username=user_data['username'], password=user_data['password'])