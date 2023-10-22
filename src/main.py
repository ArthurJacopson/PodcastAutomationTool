import os
import ffmpeg

def trim(in_file, out_file,start,end):
    if os.path.exists(out_file):
        os.remove(out_file)
    probe_result = ffmpeg.probe(in_file)
    duration = probe_result.get("format",{}).get("duartion",None)
    print(duration)


trim("movie.mp4","out.mp4",10,18)