import subprocess
import random
import boto3
import os
import ffmpeg

# Set environnment vairables

os.environ["MINIO_ENDPOINT"] = "http://127.0.0.1:9000"
os.environ["ACCESS_KEY"] = "minio_user"
os.environ["SECRET_KEY"] = "minio_password"

# Creates an S3 client with MinIO configuration
s3_client = boto3.client('s3',
                        endpoint_url=os.environ["MINIO_ENDPOINT"],
                        aws_access_key_id=os.environ["ACCESS_KEY"],
                        aws_secret_access_key=os.environ["SECRET_KEY"])


def generate_thumbnail(bucket_name, object_key):
    """
    API function that recieves an mp4 file and generates a thumbnail from the frame 5s in, then uploads it to server.
    :param bucket_name: name of bucket that video is going to be recieved from in the server.
    :param object_key: name of the video file that is being recieved from server.
    
    """

    response = s3_client.get_object(Bucket=bucket_name, Key=object_key)
    video_content = response['Body'].read()

    with open('video.mp4', 'wb') as file:
        file.write(video_content)

    input_file = 'video.mp4'
    output_file = 'thumbnail.jpg'

    command = [
    'ffmpeg',
    '-i', input_file,
    '-ss', '00:00:05',
    '-vframes', '1',
    output_file
    ]
    subprocess.run(command)

    with open(output_file, 'rb') as file:
        s3_client.put_object(Bucket=bucket_name, Key=(object_key + "_thumbnail.jpg"), Body=file, ACL='public-read')

    s3_client.get_waiter('object_exists').wait(
        Bucket = bucket_name,
        Key = (object_key + "_thumbnail.jpg")
    )

    try:
        os.remove(input_file)
        os.remove(output_file)
        print("Files deleted successfully.")
    except FileNotFoundError:
        print("Files not found.")
    except Exception as e:
        print("An error occurred: {e}")


    return {"thumbnail_url": (os.environ["MINIO_ENDPOINT"] + "/" + bucket_name + "/" + (object_key + "_thumbnail.jpg") )}