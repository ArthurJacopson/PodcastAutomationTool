import os

import librosa
from IPython.display import Audio, display
import numpy as np
import matplotlib.pyplot as plt


"""

Util methods to plot give a visial represnetation of audio
Make sure audio file is in the same directory as the script

"""

def plot_spectogram(filename):
    path = os.path.join(os.getcwd(),filename)
    y, sr = librosa.load(path)

    display(Audio(data=y, rate=sr))

    D = librosa.amplitude_to_db(librosa.stft(y), ref=np.max)
    librosa.display.specshow(D, sr=sr, x_axis='time', y_axis='log')
    plt.colorbar(format="%+2.0f dB")
    plt.title("Spectrogram of " + filename)
    plt.show()


def plot_waveform(filename):
    path = os.path.join(os.getcwd(),filename)
    y, sr = librosa.load(path)
    time = librosa.times_like(y)
    plt.figure(figsize=(10, 6))
    plt.plot(time, y)
    plt.title("Audio Waveform of " + filename)
    plt.xlabel("Time (s)")
    plt.ylabel("Amplitude")
    plt.grid()
    plt.show()

