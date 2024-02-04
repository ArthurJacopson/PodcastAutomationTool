import subprocess
import re
import os
import time

from api.editing.utils.minioUtils import create_s3_client, set_environment_variables

set_environment_variables(
    "http://127.0.0.1:9000",
    "minio_user",
    "minio_password")

s3_client = create_s3_client(
    os.environ["MINIO_ENDPOINT"],
    os.environ["ACCESS_KEY"],
    os.environ["SECRET_KEY"])


def wait_for_file(file_path, timeout=60):
    """
    Waits for a specified time interval to ensure a file exists.

    :param file_path: the file that must exist.
    :param timeout: the time  it will wait before returning false.
    """
    start_time = time.time()

    while not os.path.exists(file_path):
        time.sleep(1)  # Wait for 1 second
        if time.time() - start_time > timeout:
            print(
                f"Timeout reached. The file '{file_path}' did not appear within {timeout} seconds.")
            return False

    print(f"The file '{file_path}' exists.")
    return True


def retrieve_files(bucket_name):
    """
    Takes in a minio bucket and retrieves the files required to be merged

    :param bucket_name: the minio bucket the files have to be retrieved from.
    """
    try:
        # List all objects in the bucket
        objects = s3_client.list_objects(Bucket=bucket_name)['Contents']
        i = 1
        j = 1
        for obj in objects:
            # Get the file key (name)
            file_key = obj['Key']

            # Check if the file has a .mp4 extension
            if file_key.lower().endswith('.mp4'):
                # Download the file
                download_file_path = f"camera{i}.mp4"
                s3_client.download_file(
                    bucket_name, file_key, download_file_path)
                wait_for_file(download_file_path)
                print(f"Downloaded: {file_key}")
                i += 1

            if file_key.lower().endswith('.wav'):
                download_file_path = f"mic{j}.wav"
                s3_client.download_file(
                    bucket_name, file_key, download_file_path)
                wait_for_file(download_file_path)
                print(f"Downloaded: {file_key}")
                j += 1

    except BaseException:
        print("Credentials not available")


def clean_files():
    """
    Upon completion or an error will remove any intermediate files that have been created.
    """
    try:
        os.remove("camera1.mp4")
        os.remove("camera2.mp4")
        os.remove("mic1.wav")
        os.remove("mic2.wav")
        print("Files deleted successfully.")
    except Exception:
        print("Error, files not deleted")
        


def upload_final_output(final_output, bucket_name):
    """
    Uploads the final output file to the specified bucket

    :param final_outout: the name of the final output file.
    :param bucket_name: the name of the bucket to be uploaded to.
    """
    with open(final_output, 'rb') as file:
        s3_client.put_object(
            Bucket=bucket_name,
            Key=(final_output),
            Body=file,
            ACL='public-read')

    s3_client.get_waiter('object_exists').wait(
        Bucket=bucket_name,
        Key=(final_output)
    )


def generate_response(final_output, bucket_name):
    """
    Generates the response to be returned by the API call.

    :param final_output: the name of the final merged output file.
    :param bucket_namel: the name of the bucket it was uploaded to.
    """
    return {
        "final_output_url": (
            os.environ["MINIO_ENDPOINT"] +
            "/" +
            bucket_name +
            "/" +
            (final_output))}


def merge_and_isolate_microphones(audio_file1, audio_file2):
    merged_output = 'merged_output.wav'
    command_merge = [
        'ffmpeg',
        '-i', audio_file1,
        '-i', audio_file2,
        '-filter_complex', '[0:a][1:a]amerge=inputs=2[aout]',
        '-map', '[aout]',
        merged_output
    ]
    subprocess.run(command_merge, check=True)
    print(f"Merged audio streams into {merged_output}")

    # Step 2: Apply Audio Panning to Isolate Each Microphone
    isolated_output1 = 'microphone1_isolated.wav'
    isolated_output2 = 'microphone2_isolated.wav'
    command_isolate = [
        'ffmpeg',
        '-i', merged_output,
        '-filter_complex', '[0:a]pan=1c|c0=c0[left];[0:a]pan=1c|c0=c1[right]',
        '-map', '[left]', isolated_output1,
        '-map', '[right]', isolated_output2
    ]
    subprocess.run(command_isolate, check=True)
    print(
        f"Isolated audio streams into {isolated_output1} and {isolated_output2}")

    return isolated_output1, isolated_output2


def analyze_audio(audio_file):
    command = [
        'ffmpeg',
        '-i', audio_file,
        '-af', 'volumedetect',
        '-vn',
        '-sn',
        '-dn',
        '-f', 'null',
        '-'
    ]
    result = subprocess.run(command, stderr=subprocess.PIPE, text=True)
    output = result.stderr

    # Parse the output to find silence periods
    pattern = r'silence_(start|end): (\d+\.\d+)'
    matches = re.findall(pattern, output)

    # Convert matches to a list of start/end times
    transitions = []
    for i in range(0, len(matches), 2):
        start, end = float(matches[i][1]), float(matches[i + 1][1])
        transitions.append((start, end))

    return transitions


def process_video_segments(video_files, transitions, video_output, offsets):
    filter_complex = []
    inputs = []
    for i, (start, end, speaker) in enumerate(transitions):
        inputs += ['-i', video_files[speaker]]
        # Adjust start time by offset
        start_offset = start + offsets.get(speaker, 0)
        filter_complex.append(
            f"[{i}:v]trim=start={start_offset}:end={end},setpts=PTS-STARTPTS[v{i}];")

    filter_complex.append(
        ''.join(
            f"[v{i}]" for i in range(
                len(transitions))) +
        f"concat=n={len(transitions)}:v=1:a=0[outv]")
    filter_complex_string = ''.join(filter_complex)

    command = ['ffmpeg'] + inputs + ['-filter_complex',
                                     filter_complex_string, '-map', '[outv]', video_output]
    try:
        subprocess.run(command, check=True)
        print(f"Processed video segments are merged into {video_output}")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred while processing video segments: {e}")


def align_and_merge_audio(audio_files, transitions, audio_output, offsets):
    filter_complex = []
    inputs = []
    for i, (start, end, speaker) in enumerate(transitions):
        inputs += ['-i', audio_files[speaker]]
        # Adjust start time by offset
        start_offset = start + offsets.get(speaker, 0)
        filter_complex.append(
            f"[{i}:a]atrim=start={start_offset}:end={end},asetpts=PTS-STARTPTS[a{i}];")

    filter_complex.append(
        ''.join(
            f"[a{i}]" for i in range(
                len(transitions))) +
        f"concat=n={len(transitions)}:v=0:a=1[outa]")
    filter_complex_string = ''.join(filter_complex)

    command = ['ffmpeg'] + inputs + ['-filter_complex',
                                     filter_complex_string, '-map', '[outa]', audio_output]
    try:
        subprocess.run(command, check=True)
        print(f"Processed audio segments are merged into {audio_output}")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred while processing audio segments: {e}")


def attach_audio_to_video(video_output, audio_output, final_output):
    command = [
        'ffmpeg',
        '-i', video_output,
        '-i', audio_output,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-strict', 'experimental',
        final_output
    ]
    try:
        subprocess.run(command, check=True)
        print(
            f"Final output with synchronized audio and video is available at {final_output}")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred while attaching audio to video: {e}")


def main(bucket_name):

    retrieve_files(bucket_name)

    audio_file1 = 'mic1.wav'
    audio_file2 = 'mic2.wav'

    # Merge and isolate microphones
    isolated_audio1, isolated_audio2 = merge_and_isolate_microphones(
        audio_file1, audio_file2)

    video_files = {
        'speaker1': 'camera1.mp4',
        'speaker2': 'camera2.mp4',
        'wide': 'wide_shot.mp4'}
    audio_files = {'speaker1': isolated_audio1, 'speaker2': isolated_audio2}
    # Speaker 2's audio and video start 10 seconds after Speaker 1's
    offsets = {'speaker2': 10}

    transitions_speaker1 = analyze_audio(audio_files['speaker1'])
    transitions_speaker2 = analyze_audio(audio_files['speaker2'])

    transitions = sorted(
        transitions_speaker1 +
        transitions_speaker2,
        key=lambda x: x[0])

    video_output = 'processed_video.mp4'
    audio_output = 'merged_audio.wav'
    final_output = 'final_product.mp4'
    try:
        process_video_segments(video_files, transitions, video_output, offsets)
        align_and_merge_audio(audio_files, transitions, audio_output, offsets)
        attach_audio_to_video(video_output, audio_output, final_output)
        upload_final_output(final_output, bucket_name)
        clean_files()
    except BaseException:
        clean_files()

    return generate_response(final_output, bucket_name)
