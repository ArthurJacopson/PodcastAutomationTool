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

## Installation and Build Guide
1. Please ensure you have [Docker Compose installed](https://docs.docker.com/compose/install/).
2. (Optional) After cloning the repo, go to `.env` and change the credentials.
3. Run `docker compose -f docker-compose.prod.yml up` from the project's root directory.
4. Visit `http://localhost:3000/`

## Project Dependencies

## Authors
Jamie Robb, Ewan Hibberd, Boris Velinov, Michael Anderson, Miko Osak, Arif Yakupogullari