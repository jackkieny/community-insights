import os, requests, json
from dotenv import load_dotenv
load_dotenv()

def skool_communities(auth_token):
    communities_url = os.getenv('SKOOL_COMMUNITIES_URL')
    labels_url = os.getenv('SKOOL_LABELS_URL')

    session = requests.Session()
    session.cookies.set('auth_token', auth_token)

    try:
        communities_response = session.get(communities_url)
    except:
        return {'error': 'Error fetching communities'}, 500
    
    if communities_response.status_code == 200:
        communities_list = []

        data = communities_response.json()

        for group in data['groups']:
            labels_list = []
            member_data = json.loads(group['metadata']['member'])
            
            if member_data['role'] == 'group-admin':
                try: 
                    labels_response = session.get(labels_url + group['id'] + '/labels')
                    labels_data = labels_response.json()
                    for label in labels_data['labels']:
                        labels_obj = {
                            'id': label['id'],
                            'display_name': label['metadata']['display_name'],
                        }
                        labels_list.append(labels_obj)
                except:
                    return {'error': 'Error fetching communities'}, 500
            
            group_obj = {
                'archived': 1 if 'archived' in group else 0,
                'role': member_data['role'],
                'id': group['id'],
                'labels': labels_list,
                'name': group['name'],
                'display_name': group['metadata']['display_name'],
                'total_members': group['metadata']['total_members'],
                'total_posts': group['metadata'].get('total_posts'),
                'logo_big_url': group['metadata'].get('logo_big_url'),
                'logo_url': group['metadata'].get('logo_url'),
                'color': group['metadata']['color'],
            }
            communities_list.append(group_obj)

    else:
        return {'error': 'Error fetching communities'}, 500

    return communities_list
