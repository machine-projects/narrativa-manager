import os
import json
from datetime import datetime, timedelta
import requests
import redis
from dotenv import load_dotenv
# Carrega variáveis de ambiente do arquivo .env
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '.env'))
load_dotenv(env_path)

# Redis configuration
REDIS_HOST = "redis-10965.c309.us-east-2-1.ec2.redns.redis-cloud.com"
REDIS_PORT = 10965
REDIS_USER = os.getenv("REDIS_USER")
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD")
QUEUE_KEY = "channel_queue"
BATCH_SIZE = 10


def get_redis_client():
    if not REDIS_USER or not REDIS_PASSWORD:
        raise EnvironmentError("Environment variables REDIS_USER and REDIS_PASSWORD must be set")
    return redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        username=REDIS_USER,
        password=REDIS_PASSWORD,
        decode_responses=True
    )


def fetch_channels():
    url = "https://narrativamanager-valoriam.netlify.app/api/channels?limit=1000"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    raise Exception(f"Failed to fetch channels: {response.status_code}")


def extract_channel_ids(channels_data):
    return [channel['channelId'] for channel in channels_data.get('data', [])]


def sync_channels(channel_ids):
    sync_url = (
        "https://ppm5oded7xdvazlxdtbxtkub7i0trygv.lambda-url.us-east-2.on.aws/syncronize"
    )
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=1)
    payload = {
        "channels_ids": channel_ids,
        "num_syncronize": len(channel_ids),
        "startDate": start_date.strftime('%Y-%m-%dT%H:%M:%S.000Z'),
        "endDate": end_date.strftime('%Y-%m-%dT%H:%M:%S.000Z')
    }
    headers = {'Content-Type': 'application/json'}
    response = requests.post(sync_url, json=payload, headers=headers)
    if response.status_code != 200:
        raise Exception(f"Failed to synchronize {channel_ids}: {response.status_code}")


def main():
    client = get_redis_client()

    # Seed queue if empty
    if client.llen(QUEUE_KEY) == 0:
        channels_data = fetch_channels()
        channel_ids = extract_channel_ids(channels_data)
        if channel_ids:
            client.rpush(QUEUE_KEY, *channel_ids)
            client.expire(QUEUE_KEY, 12 * 3600)  # Set TTL 12 hours on queue
            print(f"Seeded {len(channel_ids)} channel IDs into Redis queue")

    # Process queue in batches
    while True:
        batch = client.lpop(QUEUE_KEY, BATCH_SIZE)
        if not batch:
            print("Queue is empty, synchronization complete")
            break

        try:
            print(f"Synchronizing batch of {len(batch)} channels: {batch}")
            sync_channels(batch)
            print(f"Successfully synchronized: {batch}")
        except Exception as e:
            print(f"Error synchronizing batch {batch}: {e}")
            # Optionally, push failed batch back to queue for retry
            client.rpush(QUEUE_KEY, *batch)
            break


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"An error occurred: {e}")
