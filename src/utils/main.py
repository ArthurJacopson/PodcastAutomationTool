import os
import subprocess
import ffmpeg
#Add comparing audio files and merging them dependign on the similarity
def concatenate_videos(input_videos, output_video):
    # Create a text file to list input video files
    with open('input.txt', 'w') as file:
        for video in input_videos:
            file.write(f"file '{video}'\n")

    # Concatenate the videos using FFmpeg
    command = [
        "ffmpeg",
        "-f", "concat",  # Use the concat demuxer
        "-safe", "0",     # Allow arbitrary file names
        "-i", "input.txt",  # Input file with a list of videos
        "-c", "copy",  # Copy video and audio streams without re-encoding
        output_video
    ]
    subprocess.run(command)
    os.remove('input.txt')


def trim(in_file, out_file,start,end,file_type):
    if os.path.exists(out_file):
        os.remove(out_file)
    probe_result = ffmpeg.probe(in_file)
    duration = probe_result.get("format",{}).get("duration",None)
    print(duration)
    input_stream = ffmpeg.input(in_file)
    pts = "PTS-STARTPTS"
    video = input_stream.trim(start=start, end=end).setpts(pts)
    audio = (input_stream
             .filter_("atrim", start=start, end=end)
             .filter_("asetpts", pts))
    video_and_audio = ffmpeg.concat(video,audio,v=1,a=1)
    output = ffmpeg.output(video_and_audio, out_file, format = file_type)
    output.run()

def audio_trim(aud_in,aud_out,cut):
    audio_input = ffmpeg.input(aud_in)
    audio_cut = audio_input.audio.filter('atrim', duration=cut)
    audio_output = ffmpeg.output(audio_cut, aud_out)
    ffmpeg.run(audio_output)

def merge_audio(input_audio1, input_audio2, output_audio):
    command = [
        "ffmpeg",
        "-i", input_audio1,
        "-i", input_audio2,
        "-filter_complex", "[0:a][1:a]amerge=inputs=2[aout]",
        "-map", "[aout]",
        output_audio
    ]
    subprocess.run(command)

def get_duration_ffmpeg(file_path):
    probe = ffmpeg.probe(file_path)
    stream = next((stream for stream in probe['streams'] if stream['codec_type'] == 'audio'), None)
    duration = float(stream['duration'])
    return duration
def combine_audio_with_video(inVid,inAu):
    input_video = ffmpeg.input(inVid)
    input_audio = ffmpeg.input(inAu)
    ffmpeg.concat(input_video, input_audio, v=1, a=1).output('combinedvid.mp4').run()

def main():
    pass

main()
