import ffmpeg


def cut_video_with_smoothing(
        input_file,
        start_time,
        end_time,
        output_file,
        fade_duration=1):
    """
    Cuts a segment from a video with audio smoothing at the cut edges.

    :param input_file: str - Path to the input video file.
    :param start_time: float - Start time in seconds.
    :param end_time: float - End time in seconds.
    :param output_file: str - Path to the output video file.
    :param fade_duration: float - Duration of the audio fade in and fade out in seconds.
    """
    input_stream = ffmpeg.input(input_file, ss=start_time, to=end_time)
    video = input_stream.video
    audio = (
        input_stream.audio.filter(
            'afade',
            type='in',
            start_time=0,
            duration=fade_duration) .filter(
                'afade',
                type='out',
                start_time=end_time -
                start_time -
                fade_duration,
                duration=fade_duration))
    ffmpeg.output(video, audio, output_file).run(overwrite_output=True, quiet=True)


def render_video(
        input_file,
        output_file,
        codec_video='libx264',
        codec_audio='aac'):
    """
    Renders (transcodes) a video to a different format.

    :param input_file: str - Path to the input video file.
    :param output_file: str - Path to the output video file.
    :param codec_video: str - Video codec to use.
    :param codec_audio: str - Audio codec to use.
    """
    ffmpeg.input(input_file).output(
        output_file,
        vcodec=codec_video,
        acodec=codec_audio).run(
            overwrite_output=True, quiet=True)

def separate_audio_video(input_file, output_video_file, output_audio_file):
    """
    Separates audio and video streams from a file.

    :param input_file: str - Path to the input file.
    :param output_video_file: str - Path to the output video file (no audio).
    :param output_audio_file: str - Path to the output audio file.
    """
    ffmpeg.input(input_file).output(
        output_video_file,
        an=None).run(
            overwrite_output=True, quiet=True)
    ffmpeg.input(input_file).output(
        output_audio_file,
        vn=None).run(
            overwrite_output=True, quiet=True)


def create_thumbnail(input_file, time_frame, output_file):
    """
    Creates a thumbnail from a video.

    :param input_file: str - Path to the input video file.
    :param time_frame: float - Time position in the video (in seconds) to create the thumbnail.
    :param output_file: str - Path to the output thumbnail image file.
    """
    (
        ffmpeg
        .input(input_file, ss=time_frame)
        .filter('scale', 320, -1)
        .output(output_file, vframes=1)
        .run(overwrite_output=True, quiet=True)
    )


def silence_part_of_video(input_file, start_time, end_time, output_file):
    """
    Silences a specific part of the video.

    :param input_file: str - Path to the input video file.
    :param start_time: float - Start time in seconds where the audio should be silenced.
    :param end_time: float - End time in seconds where the audio should be silenced.
    :param output_file: str - Path to the output video file.
    """
    input_stream = ffmpeg.input(input_file)
    video = input_stream.video
    audio = input_stream.audio.filter(
        'volume', f"enable=between(t,{start_time},{end_time})", volume=0)
    ffmpeg.output(video, audio, output_file).run(overwrite_output=True, quiet=True)


def add_audio_to_video(video_file, audio_file, output_file):
    """
    Adds or replaces an audio track in a video file.

    :param video_file: str - Path to the video file.
    :param audio_file: str - Path to the audio file to add to the video.
    :param output_file: str - Path to the output video file.
    """
    input_video = ffmpeg.input(video_file)
    input_audio = ffmpeg.input(audio_file)
    try:
        ffmpeg.output(
            input_video.video,
            input_audio.audio,
            output_file,
            acodec='aac').run(
                overwrite_output=True, quiet=True)
    except ffmpeg.Error as e:
        print(f"Error during ffmpeg operation: {e}")
        raise e

# Usage examples:
# cut_video_with_smoothing('input.mp4', 10, 20, 'cut_output.mp4')
# render_video('input.mp4', 'rendered_output.mp4')
# separate_audio_video('input.mp4', 'video_only_output.mp4', 'audio_only_output.mp3')
# create_thumbnail('input.mp4', 5, 'thumbnail_output.jpg')
# silence_part_of_video('input.mp4', 30, 45, 'silenced_output.mp4')
# add_audio_to_video('video_only_output
