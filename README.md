# CS30 Main - Podcast Editor

This repository contains the code for Podcast Editor, a project created by University of Glasgow students as part of the third-year group project.

Major features include:
- [x] Importing multimedia files
- [x] Syncing different audio and video sources
- [x] User-controlled trimming and clipping
- [x] Podcast export options
- [x] Automatic removal of 'dead sections' (and user ability to tweak)
- [x] Automatic audio mastering (and user ability to tweak)
- [x] Persistent video editing sessions
- [x] Dummy login page

A key aim of the project is to create an application that is accessible to users of multiple skill levels. As such, many features must have an automatic mode (handled entirely by the application) **as well as** the ability for more experienced users to manually tweak their work.

## 


## User Guide

- Installation and Build:
1. Please ensure you have [Docker Compose installed](https://docs.docker.com/compose/install/).
2. (Optional) After cloning the repo, go to `.env` and change the credentials.
3. Run `docker compose -f docker-compose.prod.yml up` from the project's root directory.
4. Visit `http://localhost:3000/`

- What happens when I am on the landing page ?
1. The moment you press create podcast it will take you to the project creation page.
2. On this page you have to give a name to your project, select the editing type(Regular Editing is recommended).
3. To start uploading videos you need to press "Add Participant" and depending on who is the speaker(Participant 1 would be the Speaker 1 while General is for the wide shot) you are expected to upload video files.
4. Now you can layback and relax while our application runs its magic and creates your podcast for you.

- The spesific video types:
1. Ensure that your clips start approcmately around the sametime to ensure that the output would be more stable.
2. The videos you will upload must have three angles: Speaker 1, Speaker 2 and a wideshot. Please note that wideshot is not mandatory.
3. After you have uploaded the videos if you have a seperate microphone recording the conversation please attach them based on the speaker. Such as Speaker 1 would have Speaker1.mp4 Speaker1.mp3.
4. Ensure that there is not a massive offset between the audio and video tracks.

- General usage of the transcript based editing:
1. After the transcript and the video is generated you will have two different windows. One will allow you to view the video while the otherone will contain the transcript, you will be able to edit the transcript to your liking to ensure that unwanted parts are not within the video.
2. In order to edit the video, you will click on the word and it will pop up with options to select from. One being seek which will skip to that bit directly and the other option being delete.
3. After all seems fine press export and just wait for the magic to happen.


## Project Dependencies

## Authors
Jamie Robb, Ewan Hibberd, Boris Velinov, Michael Anderson, Miko Osak, Arif Yakupogullari