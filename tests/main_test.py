import unittest, os, sys, subprocess, json, librosa
import numpy as np
sys.path.append('../api/api/editing/utils')
from main import *


class test_main(unittest.TestCase):
    
    # assumes you have /sample-files folder with a sample files to test
    def setUp(self):
        self.audio_input_filepath = os.path.abspath('./sample-files/audio/sample1.mp3')
        self.video_input_filepath = os.path.abspath('./sample-files/video/sample.mp4')
        self.video2_input_filepath = os.path.abspath('./sample-files/video/goat.mp4')
        self.video_output_filepath = os.path.abspath('test.mp4')
        self.audio_output_filepath = os.path.abspath('test.wav')
        
    def tearDown(self):
        if os.path.exists(self.audio_output_filepath):
            os.remove(self.audio_output_filepath)
        if os.path.exists(self.video_output_filepath):
            os.remove(self.video_output_filepath)

    @staticmethod
    def get_video_duration(filepath):
        command = [
            "ffprobe",
            "-v", "error",
            "-show_entries", "format=duration",
            "-of", "json",
            filepath
        ]
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if result.returncode == 0:
            info = json.loads(result.stdout.decode())
            duration = float(info['format']['duration'])
            return duration
        else:
            print("Error running ffprobe:")
            print(result.stderr.decode())
            return None
        
    @staticmethod
    def get_audio_duration(filepath):
        audio, sr = librosa.load(filepath, sr=None)
        duration = librosa.get_duration(y=audio, sr=sr)
        return duration

    def test_concatenating_videos_length(self):
        tolerance = 0.1 # output will always be different length from input due to encoding
        concatenate_videos([self.video_input_filepath, self.video2_input_filepath], self.video_output_filepath)
        self.assertTrue(os.path.exists(self.video_output_filepath), "concatenate_videos failed to produce a video.")
        duration_in = self.get_video_duration(self.video_input_filepath) + self.get_video_duration(self.video2_input_filepath)
        duration_out = self.get_video_duration(self.video_output_filepath)
        self.assertTrue(abs(duration_in - duration_out) < tolerance, f"Total duration of input {duration_in} is not within tolerance of output duration {duration_out}.")

    def test_video_trim_length(self):
        trim(self.video_input_filepath, self.video_output_filepath,0.1,0.2,'mp4')
        self.assertTrue(os.path.exists(self.video_output_filepath), "trim failed to produce a video file.")
        trimmed_duration = self.get_video_duration(self.video_output_filepath)
        self.assertTrue(trimmed_duration == 0.1, f"Duration of trimmed video is {trimmed_duration} instead of the expected 0.1")

    def test_audio_trim_length(self):
        audio_trim(self.audio_input_filepath, self.audio_output_filepath, 0.1)
        self.assertTrue(os.path.exists(self.audio_output_filepath), "audio_trim failed to produce an audio file.")
        trimmed_duration = self.get_audio_duration(self.audio_output_filepath)
        self.assertTrue(trimmed_duration == 0.1, f"Duration of trimmed audio is {trimmed_duration} instead of the expected 0.1")

if __name__ == '__main__':
    unittest.main()
