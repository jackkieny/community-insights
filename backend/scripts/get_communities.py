import os, requests, json
from dotenv import load_dotenv
load_dotenv()
from datetime import datetime

def skool_communities(auth_token):
    # Load environment variables
    url = os.getenv('SKOOL_COMMUNITIES_URL')

    # Start session and set auth token
    session = requests.Session()
    session.cookies.set('auth_token', auth_token)

    # Fetch communities
    try:
        response = session.get(url)
    except:
        print(f'Error: {response.status_code}')
        return {'error': 'Error fetching communities'}, 500
    
    # Check if response is successful
    if response.status_code == 200:
        data = response.json()

        communities = []

        for group in data['groups']:
            member_data = json.loads(group['metadata']['member'])
            group_obj = {
                'archived': 1 if 'archived' in group else 0,
                'role': member_data['role'],
                'id': group['id'],
                'name': group['name'],
                'display_name': group['metadata']['display_name'],
                'total_members': group['metadata']['total_members'],
                'total_posts': group['metadata'].get('total_posts'),
                'logo_big_url': group['metadata'].get('logo_big_url'),
                'logo_url': group['metadata'].get('logo_url'),
                'color': group['metadata']['color'],
            }
            communities.append(group_obj)

    else:
        return {'error': 'Error fetching communities'}, 500

    return communities
