import {
    useParams
} from "react-router-dom";

import { useRef, useState, useEffect } from "react";

import styles from './Editor.module.css'
import ReactPlayer from '@ehibb/react-player';

import sampleVideo from '../static/sample.mp4'
import WaveForm from "./WaveForm";
import { ProjectInfo, funcProp } from "../Interfaces";


const Editor = (props: funcProp) => {

    // Get the project name and pass it to the navbar
    const { project_id } = useParams();

    const [projectInfo, setProjectInfo] = useState<ProjectInfo>();

    props.func(`Editing ${projectInfo?.name!}`);



    useEffect(() => {

        /**
         * Fetches current project from the database by calling the Flask API
         * 
         * @returns {Promise<void>} - returns a Promise that is resolved when the project is deleted. 
         * @throws {Error} - throws an error if there is an issue fetching projects.
         */
        const fetchProject = async (): Promise<void> => {
            try {
                const response = await fetch(process.env.REACT_APP_FLASK_API_DEVELOP + `/project/${project_id}`);
                if(!response.ok) {
                    throw new Error(`Failed to fetch project. Status: ${response.status.toString()}`);
                } 
                setProjectInfo(await response.json());
            }
            catch (e) {
                console.log('Error fetching project:', e);
            }
        }

        if (project_id) {
            fetchProject();
        }
    }, [project_id])


    // Video player logic
    const [isPlaying, setIsPlaying] = useState(false);
    const playerRef = useRef<ReactPlayer>(null);

    const handleSeek = (newTime: number) => {

        if (playerRef.current) {
            playerRef.current.seekTo(newTime);
        }
    };

    if (!projectInfo) {
        return <div>Loading...</div>
    }

    return (
        <div id={styles.main}>

            <div className={styles.comp} id={styles.editor}>
                <ReactPlayer
                    className={styles.player}
                    url={sampleVideo}
                    muted={true}

                    width="100%"
                    height="100%"

                    controls={false}

                    ref={playerRef}
                    playing={isPlaying}
                />
            </div>

            <div className={styles.comp} id={styles.transcript}>
                Transcript
            </div>

            <div className={styles.comp} id={styles.timeline}>
                Timeline
                <div>
                    <WaveForm setVideoTime={handleSeek} setPlaying={setIsPlaying} />
                </div>
            </div>

        </div>
    );
};

export default Editor;