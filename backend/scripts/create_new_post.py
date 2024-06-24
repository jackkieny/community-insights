import requests
import json


def create_new_post(post_data, auth_token, group_id):
    url = "https://api.skool.com/posts?follow=true"

    session = requests.Session()
    session.headers.update({
        'content-type': 'application/json',
    })
    session.cookies.set('auth_token', auth_token)


    request_payload = {
        'group_id': group_id,
        'metadata': {
            'title': post_data['title'],
            'content': post_data['content'],
            'action': 0,
            'attachments': "",
            'label': 'd774b807986c4ee586127019e778f305'
        }
    }

    response = session.post(url, data=json.dumps(request_payload))

    if response.status_code != 200:
        print(f"Failed {response.status_code}\n{response.text}")

    return
