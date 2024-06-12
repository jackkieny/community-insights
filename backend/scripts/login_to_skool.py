import os, requests, json
from dotenv import load_dotenv
load_dotenv()

def login_to_skool(email, password):

    url = os.getenv('SKOOL_LOGIN_URL')
    
    payload = {
        "email": email,
        "password": password
    }
    try:
        response = requests.post(url, data=json.dumps(payload))
    except:
        pass
    
    if response.status_code != 200:
        return None
    else:
        return response.cookies.get('auth_token')