import subprocess
import re
import os
import time
import sys


import numpy as np

from utils.trim import read_file_to_array
from utils.minioUtils import create_s3_client, upload_to_s3

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
                f"Timeout reached. The file '{file_path}' did not appear within {timeout} seconds.",
                file=sys.stderr)
            return False

    print(f"The file '{file_path}' exists.", file=sys.stderr)
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
        for obj in objects:
            participant = f"participant-{i}/"
            # Get the file key (name)
            file_key = obj['Key']
            if file_key.startswith(participant):
                files = s3_client.list_objects_v2(
                    Bucket=bucket_name, Prefix=participant)['Contents']
                for file in files:
                    print("file file key = " + file['Key'], file=sys.stderr)
                    if file['Key'].lower().endswith(".mp4"):
                        # Download the file
                        download_file_path = f"camera{i}.mp4"
                        s3_client.download_file(
                            bucket_name, file['Key'], download_file_path)
                        wait_for_file(download_file_path)
                        print(f"Downloaded: {file['Key']}", file=sys.stderr)

                    if file['Key'].lower().endswith(".wav"):
                        # Download the file
                        download_file_path = f"mic{i}.wav"
                        s3_client.download_file(
                            bucket_name, file['Key'], download_file_path)
                        wait_for_file(download_file_path)
                        print(f"Downloaded: {file['Key']}", file=sys.stderr)
                i += 1

        return True
    except BaseException as e:
        print(f"Credentials not available: {e}", file=sys.stderr)
        return False


def clean_files():
    """
    Upon completion or an error will remove any intermediate files that have been created.
    """
    try:
        os.remove("camera1.mp4")
        os.remove("camera2.mp4")
        os.remove("mic1.wav")
        os.remove("mic2.wav")
        print("Files deleted successfully.", file=sys.stderr)
    except Exception:
        print("Error, files not deleted", file=sys.stderr)

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
            f"{bucket_name}/final-product" +
            "/" +
            (final_output))}


def merge_and_isolate_microphones(audio_file1, audio_file2):
    merged_output = 'merged_output.wav'
    command_merge = [
        'ffmpeg',
        '-y',
        '-i', audio_file1,
        '-i', audio_file2,
        '-filter_complex', '[0:a][1:a]amerge=inputs=2[aout]',
        '-map', '[aout]',
        merged_output
    ]
    subprocess.run(command_merge, check=True, stderr=subprocess.STDOUT, stdout=subprocess.DEVNULL)
    print(f"Merged audio streams into {merged_output}", file=sys.stderr)

    # Step 2: Apply Audio Panning to Isolate Each Microphone
    isolated_output1 = 'microphone1_isolated.wav'
    isolated_output2 = 'microphone2_isolated.wav'
    command_isolate = [
        'ffmpeg',
        '-y',
        '-i', merged_output,
        '-filter_complex', '[0:a]pan=1c|c0=c0[left];[0:a]pan=1c|c0=c1[right]',
        '-map', '[left]', isolated_output1,
        '-map', '[right]', isolated_output2
    ]
    subprocess.run(command_isolate, check=True, stderr=subprocess.STDOUT, stdout=subprocess.DEVNULL)
    print(
        f"Isolated audio streams into {isolated_output1} and {isolated_output2}", file=sys.stderr)

    return isolated_output1, isolated_output2


def choose_highest_sounds(audio_files):
    # Assume 8KHz sample rate (whatever is used in read_file_to_array
    sample_rate = 8_000
    audio_arrays = []
    transitions = []

    for audio_file in audio_files.values():
        audio_array = read_file_to_array(audio_file)
        audio_arrays.append(audio_array)

    # Take the sum of the volume at every sample in a second
    # This takes a 1D array representing an audio file from size N to size N/sample_rate
    # Have to trim off some of the end of some of the arrays as a result - sorry!

    new_size = min(len(audio_array)
                   for audio_array in audio_arrays) // sample_rate

    audio_array_seconds_sum = np.array([audio_array[:new_size * sample_rate]
                                        .reshape((new_size, sample_rate))
                                        .sum(axis=1) for audio_array in audio_arrays])

    # Need to convert this into a full numpy array
    for i in range(new_size):
        transitions.append(
            (i, i+1, f'speaker{np.argmax(audio_array_seconds_sum[:, i]) + 1}'))

    return transitions


def find_silence_periods(audio_file, speaker_name):
    command = [
        'ffmpeg',
        '-y',
        '-i', audio_file,
        '-af', 'volumedetect',
        '-vn',
        '-sn',
        '-dn',
        '-f', 'null',
        '-'
    ]
    result = subprocess.run(command, text=True, stderr=subprocess.STDOUT, stdout=subprocess.DEVNULL)
    output = result.stderr
    print(output, file=sys.stderr)

    # Parse the output to find silence periods
    pattern = r'silence_(start|end): (\d+\.\d+)'
    matches = re.findall(pattern, output)

    # Convert matches to a list of start/end times
    transitions = []
    for i in range(0, len(matches), 2):
        start, end = float(matches[i][1]), float(matches[i + 1][1])
        transitions.append((start, end, speaker_name))
    print(len(transitions), file=sys.stderr)
    return transitions


def process_video_segments(video_files, transitions, video_output, offsets):
    filter_complex = []
    inputs = []
    for i, (start, end, speaker) in enumerate(transitions):
        inputs += ['-i', video_files[speaker]]
        # Adjust start time by offset
        start_offset = start + offsets.get(speaker, 0)
        if end is None:
            filter_complex.append(
                f"[{i}:v]trim=start={start_offset},setpts=PTS-STARTPTS[v{i}];")
        else:
            filter_complex.append(
                f"[{i}:v]trim=start={start_offset}:end={end},setpts=PTS-STARTPTS[v{i}];")

    if len(transitions) > 0:
        filter_complex.append(
            ''.join(
                f"[v{i}]" for i in range(
                    len(transitions))) +
            f"concat=n={len(transitions)}:v=1:a=0[outv]")
    filter_complex_string = ''.join(filter_complex)

    command = ['ffmpeg', '-y'] + inputs + ['-filter_complex',
                                           filter_complex_string, '-map', '[outv]', video_output]
    try:
        subprocess.run(command, check=True, stderr=subprocess.STDOUT, stdout=subprocess.DEVNULL)
        print(f"Processed video segments are merged into {video_output}", file=sys.stderr)
    except subprocess.CalledProcessError as e:
        print(
            f"An error occurred while processing video segments: {e}", file=sys.stderr)


def align_and_merge_audio(audio_files, transitions, audio_output, offsets):
    filter_complex = []
    inputs = []
    for i, (start, end, speaker) in enumerate(transitions):
        inputs += ['-i', audio_files[speaker]]
        # Adjust start time by offset
        start_offset = start + offsets.get(speaker, 0)
        if end is None:
            filter_complex.append(
                f"[{i}:a]atrim=start={start_offset},asetpts=PTS-STARTPTS[a{i}];")
        else:
            filter_complex.append(
                f"[{i}:a]atrim=start={start_offset}:end={end},asetpts=PTS-STARTPTS[a{i}];")
    if len(transitions) > 0:
        filter_complex.append(
            ''.join(
                f"[a{i}]" for i in range(
                    len(transitions))) +
            f"concat=n={len(transitions)}:v=0:a=1[outa]")

    filter_complex_string = ''.join(filter_complex)

    command = ['ffmpeg', '-y'] + inputs + ['-filter_complex',
                                           filter_complex_string, '-map', '[outa]', audio_output]
    try:
        subprocess.run(command, check=True, stderr=subprocess.STDOUT, stdout=subprocess.DEVNULL)
        print(f"Processed audio segments are merged into {audio_output}", file=sys.stderr)
    except subprocess.CalledProcessError as e:
        print(
            f"An error occurred while processing audio segments: {e}", file=sys.stderr)


def attach_audio_to_video(video_output, audio_output, final_output):
    command = [
        'ffmpeg',
        '-y',
        '-i', video_output,
        '-i', audio_output,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-strict', 'experimental',
        final_output
    ]
    try:
        subprocess.run(command, check=True, stderr=subprocess.STDOUT, stdout=subprocess.DEVNULL)
        print(
            f"Final output with synchronized audio and video is available at {final_output}",
            file=sys.stderr)
    except subprocess.CalledProcessError as e:
        print(
            f"An error occurred while attaching audio to video: {e}", file=sys.stderr)


def clear_up_api_folder():
    """
    Method that clears the main api fodler with any leftover files
    from a previous processing session that has been interrupted
    It removes audio and video files liested in both extension arrays
    """
    files = os.listdir(os.curdir)
    video_extensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv']
    audio_extensions = ['.mp3', '.wav', '.ogg', '.aac', '.flac', '.wma']
    
    for file_name in files:
        file_path = os.path.join(os.curdir, file_name)

        if any(file_name.lower().endswith(ext) for ext in video_extensions) \
                or any(file_name.lower().endswith(ext) for ext in audio_extensions):
            try:
                os.remove(file_path)
                print(f"Deleted file: {file_path}", file=sys.stderr)
            except OSError as e:
                print(f"Error deleting file: {file_path} - {e}", file=sys.stderr)


def main(bucket_name):

    audio_file1 = 'mic1.wav'
    audio_file2 = 'mic2.wav'
    video_files = {
        'speaker1': 'camera1.mp4',
        'speaker2': 'camera2.mp4',
        'wide': 'wide_shot.mp4'}
    
    clear_up_api_folder()
    try:
        if not retrieve_files(bucket_name):
            return {"Error": "Files not retrieved"}

        # Merge and isolate microphones
        isolated_audio = merge_and_isolate_microphones(
            audio_file1, audio_file2)
        audio_files = {
            'speaker1': isolated_audio[0], 'speaker2': isolated_audio[1]}

        # Speaker 2's audio and video start 10 seconds after Speaker 1's
        offsets = {'speaker2': 0}

        transitions_speaker1 = find_silence_periods(
            audio_files['speaker1'], 'speaker1')
        transitions_speaker2 = find_silence_periods(
            audio_files['speaker2'], 'speaker2')
        transitions_combined = choose_highest_sounds(audio_files)

        transitions = sorted(
            transitions_speaker1 +
            transitions_speaker2 +
            transitions_combined,
            key=lambda x: x[0])

        print(transitions, file=sys.stderr)
        video_output = 'processed_video.mp4'
        audio_output = 'merged_audio.wav'
        final_output = 'final_podcast.mp4'

        process_video_segments(video_files, transitions, video_output, offsets)
        align_and_merge_audio(audio_files, transitions, audio_output, offsets)
        attach_audio_to_video(video_output, audio_output, final_output)

        upload_to_s3(bucket_name, final_output, bucket_name)
        clean_files()

    except Exception as e:
        print(e, file=sys.stderr)
        final_output = 'final_podcast.mp4'
        os.rename('camera1.mp4', final_output)
        upload_to_s3(s3_client, final_output, bucket_name)
        os.remove(final_output)
        clean_files()

    return generate_response(final_output, bucket_name)
