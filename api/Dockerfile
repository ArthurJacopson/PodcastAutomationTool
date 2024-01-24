FROM ubuntu:22.04

RUN apt-get update &&\
    apt-get install -y ffmpeg python3 python3-pip libpq-dev

ADD requirements.txt requirements.txt

RUN pip3 install -r requirements.txt 
