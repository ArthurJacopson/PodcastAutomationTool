import subprocess
import os

from api.editing.utils.minioUtils import create_s3_client

s3_client = create_s3_client(os.environ["MINIO_ENDPOINT"], 
                             os.environ["ACCESS_KEY"], os.environ["SECRET_KEY"])


def generate_thumbnail(bucket_name, object_key):
    """
    Recieves an mp4 file and generates a thumbnail from the frame 5s in, then uploads to server.
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
        s3_client.put_object(Bucket=bucket_name, Key=(
            object_key + "_thumbnail.jpg"), Body=file, ACL='public-read')

    s3_client.get_waiter('object_exists').wait(
        Bucket=bucket_name,
        Key=(object_key + "_thumbnail.jpg")
    )

    try:
        os.remove(input_file)
        os.remove(output_file)
        print("Files deleted successfully.")
    except FileNotFoundError:
        print("Files not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

    return {"thumbnail_url":
            f'{os.environ["MINIO_ENDPOINT"]}/{bucket_name}/{object_key}_thumbnail.jpg'}
