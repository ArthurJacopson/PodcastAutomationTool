import os
import cv2 as cv
import numpy as np
import ffmpeg

def read_video(filename):
    path = os.path.join(os.getcwd(),filename)
    capture = cv.VideoCapture(path)
    while capture.isOpened():
        ret,frame = capture.read()
        if not ret:
            print("Cant retrieve frame")
            break
        colour = cv.cvtColor(frame,cv.COLOR_BGR2BGRA)
        cv.imshow('frame',colour)
        if cv.waitKey(1) == ord('q'):
            break
    capture.release()
    cv.destroyAllWindows()



def get_video_info(filepath):
    probe = ffmpeg.probe(filepath)
    video_info = next(frame for frame in probe['streams'] if frame['codec_type'] == "video")
    return video_info

def get_width(filepath):
    return int(get_video_info(filepath)["width"])

def get_height(filepath):
    return int(get_video_info(filepath)["height"])

def get_frame_count(filepath):
    return int(get_video_info(filepath)["nb_frames"])



def video_to_array(videoname):
    video_file =  os.path.join(os.getcwd(),videoname)
    height = get_height(video_file)
    width = get_width(video_file)
    input_stream = ffmpeg.input(video_file)
    output = (
        input_stream.output("pipe:", format = "rawvideo",pix_fmt = "rgb24",s="{}x{}".format(width,height))
        .run_async(pipe_stdout = True)
    )          
    video_arr = np.frombuffer(output.stdout.read(),np.uint8)
    video_arr = video_arr.reshape([-1,height,width,3])
    return video_arr
