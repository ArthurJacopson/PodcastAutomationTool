import os
import boto3

def set_environment_variables(endpoint, access_key, secret_key):
    """
    Takes in minio setup values and creates environment variables from them.

    :param endpoint: the minio endpoint url.
    :param access_key: the access key required to create s3 client.
    :param secret_key: the secret key required to create s3 client.
    """

    os.environ["MINIO_ENDPOINT"] = endpoint
    os.environ["ACCESS_KEY"] = access_key
    os.environ["SECRET_KEY"] = secret_key


def create_s3_client(endpoint, access_key, secret_key):
    """
    Takes in the minio variables and creates the s3 client.

    :param endpoint: the minio endpoint url.
    :param access_key: the access key required to create s3 client.
    :param secret_key: the secret key required to create s3 client.
    """
    
    s3_client = boto3.client('s3',
                             endpoint_url=endpoint,
                             aws_access_key_id=access_key,
                             aws_secret_access_key=secret_key)
    
    return s3_client
