# CS30 Main - Podplistic Podcast Editor

<img src="https://static.wixstatic.com/media/4ae805_8f7ae020838c4a47adbf40181bf111d1~mv2.png/v1/fill/w_558,h_156,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Podplistic%20Logo%20PNG_edited.png" align="right"
     alt="Podplistic Logo" height="50">



This repository contains the code for the Podplistic Podcast Editor, a project created by University of Glasgow students as part of the third-year group project. The aim of this project is to develop an MVP for Podplistic to use to raise additional finance to further develop the application. 

Major features include:
- [x] Importing multimedia files
- [ ] Syncing different audio and video sources
- [ ] User-controlled trimming and clipping
- [ ] Podcast export options
- [ ] Automatic removal of 'dead sections' (and user ability to tweak)
- [ ] Automatic audio mastering (and user ability to tweak)
- [ ] Persistent video editing sessions
- [x] Dummy login page

A key aim of the project is to create an application that is accessible to users of multiple skill levels. As such, many features must have an automatic mode (handled entirely by the application) **as well as** the ability for more experienced users to manually tweak their work.

## Installation and Build Guide
1. Please ensure you have [Docker Compose installed](https://docs.docker.com/compose/install/).
2. (Optional) After cloning the repo, go to `.env` and change the credentials.
3. Run `docker compose -f docker-compose.prod.yml up` from the project's root directory.
4. Visit `http://localhost:3000/`

## Project Dependencies

## Authors
Jamie Robb, Ewan Hibberd, Boris Velinov, Michael Anderson, Miko Osak, Arif Yakupogullari