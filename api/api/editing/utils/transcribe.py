import os
import subprocess
import json
import shutil
from pydub import AudioSegment
import whisper_timestamped as whisper


def get_audio_from_video(video_file: str,destination_path: str,out_file_name: str) -> None:
    """
    :param video_file: String relative path of the filename
    :param destination_path: String relative path of the temorary folder that will be created
    :param out_file_name: String of the name of the audio file that will be produced

    Given a relative video file path it extracts the audio and and puts it inside a destination folder
    """

    if not os.path.exists(destination_path):
        os.makedirs(destination_path)
    video_file_full = os.path.realpath(video_file)
    output_file = os.path.realpath(os.path.join(destination_path, out_file_name))
    if os.path.exists(output_file):
        os.remove(output_file)
    try:
        subprocess.run(['ffmpeg', '-i', video_file_full, '-vn', '-acodec', 'libmp3lame','-q:a','2', output_file])
        print(f"Audio extracted successfully to {output_file}")
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")


def validate_frequency(audiofile: str) -> None:
    """
    :param audiofile: relative path of the audiofile as a string
    
    This is a helper function that turns the frequency of an audio file to 16kHz
    It is recommended by whisper to use 16kHz files but it works with any file frequency
    """
    audiofile = os.path.realpath(audiofile)
    audio_file = AudioSegment.from_file(audiofile)
    audioSegment = audio_file.set_frame_rate(16000)
    audioSegment.export(audiofile,format="mp3",bitrate="320k")
    print(f"16kHz output in {audiofile}")


def get_json_transcript(audiofile: str) -> str:
    """
    :param audiofile: relative path of the audiofile as a string
    This is the main program that generates the transcription that calls the whisper_timestamped module
    It works on the cpu and it returns an english transcript as a json file that is passed to the front end
    """
    audiofile = os.path.realpath(audiofile)
    audio = whisper.load_audio(audiofile)
    model = whisper.load_model("tiny",device="cpu")
    res = whisper.transcribe(model,audio,language='en',task='transcribe')
    return json.dumps(res)



def process_video_to_JSON(video_file_path: str,temp_folder_path: str, output_filename:str,downscale:bool) -> str:
    """
    :param video_file_path: String of relative file path for the video
    :param temp_folder_path: String of relative file path for the folder in which the extracted audio file should exist
    :param output_filename: String of what the extracted audio should be called
    :param downscale: boolean to determine if validateFrequency should be used

    This is the function called by the flask API and it
        - gets the video 
        - extracts the audio
        - puts the audio in a specified folder
        - downscales to 16kHz if specified
        - gets the transcript from the audio file
        - deletes the folder so the temporary audio file does not exist anymore
    """
    get_audio_from_video(video_file_path,temp_folder_path,output_filename)
    outFilePath = "".join([temp_folder_path,output_filename])
    if downscale:
        validate_frequency(outFilePath)
    response = get_json_transcript(outFilePath)
    shutil.rmtree(temp_folder_path)
    return response





