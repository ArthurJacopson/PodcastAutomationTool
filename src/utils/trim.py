import sys

import numpy as np
import audiosegment
from scipy.io.wavfile import write

np.set_printoptions(threshold=sys.maxsize)

def read_file_to_array(filename):
    audio = audiosegment.from_file(filename).resample(sample_rate_Hz=32000,sample_width=2,channels=1)
    array = audio.to_numpy_array()
    return array

def write_out_from_array(newfilename,array):
    if array.dtype == np.int16:
        write("".join([newfilename,".wav"]),32000,array)


def trim(array,threashold):
    print(array.shape)
    boolean = np.where(np.absolute(array) < threashold,False,True)
    array = array[boolean]
    return array
    



