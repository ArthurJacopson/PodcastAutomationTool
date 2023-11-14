import unittest, os, sys, sndhdr
import numpy as np
sys.path.append('../src/utils')
from trim import *


class test_trim(unittest.TestCase):
    
    # assumes you have a example-files folder with a s1-trim.wav to test, can be changed
    def setUp(self):
        self.target_file_path = os.path.abspath('../example-files/s1-trim.wav')
        self.write_output_file_path = os.path.abspath('test.wav')
        self.trim_output_file_path = os.path.abspath('test_trimmed.wav')
        
    def tearDown(self):
        if os.path.exists(self.write_output_file_path):
            os.remove(self.write_output_file_path)
        if os.path.exists(self.trim_output_file_path):
            os.remove(self.trim_output_file_path)

    def test_array_read_type(self):
        output = read_file_to_array(self.target_file_path)
        self.assertTrue(isinstance(output, np.ndarray), f"{type(output)} is not an array.")
        
    def test_array_write_filetype(self):
        write_out_from_array("test", read_file_to_array(self.target_file_path))
        result = sndhdr.what(self.write_output_file_path)
        self.assertTrue(result.filetype == 'wav', f"File outputted by 'write_out_from_array' isn't a wav file, instead it is a {result.filetype} file.")
        
    def test_array_trim_length(self):
        array = read_file_to_array(self.target_file_path)
        trimmed_array = trim(array, 50)
        write_out_from_array("test_trimmed", trimmed_array)
        self.assertTrue(sndhdr.what(self.target_file_path).nframes > sndhdr.what(self.trim_output_file_path).nframes, "Trimmed array doesn't have less frames than the original.")

if __name__ == '__main__':
    unittest.main()
