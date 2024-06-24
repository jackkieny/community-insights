import os, requests, json


def create_new_post(post_data, auth_token, group_id, skool_email, skool_pass):

    session = requests.Session()
    session.get('https://skool.com')

    login_payload = {
        'email': skool_email,
        'password': skool_pass
    }

    login_response = session.post(os.getenv('SKOOL_LOGIN_URL'), data=json.dumps(login_payload)) 

    request_payload = {
        'post_type': 'generic',
        'group_id': group_id,
        'metadata': {
            'title': post_data['title'],
            'content': post_data['content'],
            'action': 0,
            'attachments': "",
            'labels': 'd774b807986c4ee586127019e778f305'
        }
    }

    post_response = session.post(os.getenv('SKOOL_POST_URL'), data=json.dumps(request_payload))

    print(f'Login response: {login_response.status_code}\n{login_response.text}')
    print(f'Post response: {post_response.status_code}\n{post_response.text}')

    return
