import unittest, os, sys, timeit
import numpy as np
import cv2 as cv
sys.path.append('../api/api/editing/utils')
from video import *


class test_video(unittest.TestCase):
    
    # assumes you have a example-files folder with a sample_video.mp4 to test
    def setUp(self):
        self.video_input_filepath = os.path.abspath('./sample-files/video/samples.mp4')

    def test_video_read_duration_similar(self):
        target = cv.VideoCapture(self.video_input_filepath)
        self.assertTrue(target.get(cv.CAP_PROP_FPS) != 0 and target.isOpened(), f"Failed to open video / Frame count is 0.")
        length = int(target.get(cv.CAP_PROP_FRAME_COUNT)) / target.get(cv.CAP_PROP_FPS)
        # The following code actually plays the video, and measures the time took to play it. Use short test video or change test.
        timer = timeit.Timer(lambda: read_video(self.video_input_filepath))
        time_taken = timer.timeit(number = 1)
        self.assertTrue(abs(time_taken - length) < 0.5, f"Video of length {length} took {time_taken} seconds to play.")

    def test_video_info_not_empty(self):
        info = get_video_info(self.video_input_filepath)
        self.assertTrue(info, "get_video_info returned an empty dictionary.")
    
    def test_video_info_width(self):
        info = int(get_width(self.video_input_filepath))
        target = cv.VideoCapture(self.video_input_filepath)
        self.assertTrue(target.isOpened(), "OpenCV failed to open the video file.")
        self.assertTrue(info == int(target.get(cv.CAP_PROP_FRAME_WIDTH)),
                        f"get_video_info gives {info} as width for video with a width of {int(target.get(cv.CAP_PROP_FRAME_WIDTH))}.")
        
    def test_video_info_length(self):
        info = int(get_height(self.video_input_filepath))
        target = cv.VideoCapture(self.video_input_filepath)
        self.assertTrue(target.isOpened(), "OpenCV failed to open the video file.")
        self.assertTrue(info == int(target.get(cv.CAP_PROP_FRAME_HEIGHT)),
                        f"get_video_info gives {info} as height for video with a height of {int(target.get(cv.CAP_PROP_FRAME_HEIGHT))}.")
        
    def test_video_info_length(self):
        info = int(get_frame_count(self.video_input_filepath))
        target = cv.VideoCapture(self.video_input_filepath)
        self.assertTrue(target.isOpened(), "OpenCV failed to open the video file.")
        self.assertTrue(info == int(target.get(cv.CAP_PROP_FRAME_COUNT)),
                        f"get_video_info gives {info} as height for video with a height of {int(target.get(cv.CAP_PROP_FRAME_COUNT))}.")
    
    def test_video_to_array_valid_array(self):
        array = video_to_array(self.video_input_filepath)
        self.assertTrue(isinstance(array, np.ndarray) and len(array.shape) == 4 and array.any(), "Invalid array returned.")

if __name__ == '__main__':
    unittest.main()
