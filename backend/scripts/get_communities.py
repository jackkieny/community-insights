import os, requests, json
from dotenv import load_dotenv
load_dotenv()
from datetime import datetime

def skool_communities(auth_token):
    url = os.getenv('SKOOL_COMMUNITIES_URL')

    session = requests.Session()
    session.cookies.set('auth_token', auth_token)

    try:
        response = session.get(url)
    except:
        print(f'Error: {response.status_code}')
        return {'error': 'Error fetching communities'}, 500
    
    if response.status_code == 200:
        community_info = {}
        community_info = response.json()

    else:
        return {'error': 'Error fetching communities'}, 500




    
    return community_info

if __name__ == '__main__':
    auth_token = os.getenv('AUTH_TOKEN')
    communities = skool_communities(auth_token)
    print(communities)