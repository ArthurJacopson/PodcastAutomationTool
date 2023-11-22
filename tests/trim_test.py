import unittest, os, sys, sndhdr
import numpy as np
sys.path.append('../src/utils')
from trim import *


class test_trim(unittest.TestCase):
    
    # assumes you have a example-files folder with a sample_audio.wav to test, can be changed
    def setUp(self):
        self.audio_input_filepath = os.path.abspath('../example-files/sample_audio.wav')
        self.audio_output_filepath = os.path.abspath('test.wav')
        
    def tearDown(self):
        if os.path.exists(self.audio_output_filepath):
            os.remove(self.audio_output_filepath)

    def test_array_read_is_array(self):
        output = read_file_to_array(self.audio_input_filepath)
        self.assertTrue(isinstance(output, np.ndarray), f"read_file_to_array outputted a file of type {type(output)}.")
        
    def test_array_write_is_wav(self):
        write_out_from_array("test", read_file_to_array(self.audio_input_filepath))
        self.assertTrue(os.path.exists(self.audio_output_filepath), "write_out_from_array failed to output an audio file.")
        result = sndhdr.what(self.audio_output_filepath)
        self.assertTrue(result.filetype == 'wav', f"File outputted by write_out_from_array isn't a wav file, instead it is a {result.filetype} file.")
        
    def test_array_trim_length_is_lower(self):
        array = read_file_to_array(self.audio_input_filepath)
        trimmed_array = trim(array, 50)
        write_out_from_array("test", trimmed_array)
        self.assertTrue(os.path.exists(self.audio_output_filepath), "write_out_from_array failed to output an audio file using an array trimmed using trim.")
        self.assertTrue(sndhdr.what(self.audio_input_filepath).nframes > sndhdr.what(self.audio_output_filepath).nframes, "Trimmed array doesn't have less frames than the original.")

if __name__ == '__main__':
    unittest.main()
