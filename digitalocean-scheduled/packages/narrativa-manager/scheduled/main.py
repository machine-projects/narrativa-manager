import requests
from datetime import datetime, timedelta
import json
import os

def fetch_channels():
    url = "https://narrativamanager-valoriam.netlify.app/api/channels?limit=1000"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to fetch channels: {response.status_code}")

def extract_channel_ids(channels_data):
    channel_ids = [channel['channelId'] for channel in channels_data['data']]
    return channel_ids

def sync_channels(channel_ids):
    sync_url = "https://ppm5oded7xdvazlxdtbxtkub7i0trygv.lambda-url.us-east-2.on.aws/syncronize"
    
    # Definindo as datas
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=1)
    
    payload = {
        "channels_ids": channel_ids,
        "num_syncronize": 5,
        "startDate": start_date.strftime('%Y-%m-%dT%H:%M:%S.000Z'),
        "endDate": end_date.strftime('%Y-%m-%dT%H:%M:%S.000Z')
    }
    
    headers = {'Content-Type': 'application/json'}
    response = requests.post(sync_url, data=json.dumps(payload), headers=headers)
    
    if response.status_code == 200:
        print("Syncronization successful")
    else:
        print(f"Failed to syncronize: {response.status_code}")

def main():
    try:
        channels_data = fetch_channels()
        channel_ids = extract_channel_ids(channels_data)
        sync_channels(channel_ids)
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()