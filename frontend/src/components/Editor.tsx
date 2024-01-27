import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { funcProp, ProjectInfo } from "../Interfaces";

import ReactPlayer from "@ehibb/react-player";

import styles from './Editor.module.css';

import sampleVideo from '../static/sample.mp4';
import Transcript from "./Transcript";
import WaveForm from "./WaveForm";
import useUpdateLastEdited from "../hooks/useUpdateLastEdited";
import Loading from "./Loading";

const Editor  =  (props: funcProp) => {
    const { controller_type, project_id } = useParams();

    const [projectInfo, setProjectInfo] = useState<ProjectInfo>();

    props.func(`Editing ${projectInfo?.name || 'Unnamed Project'}`);

    // Whenever this component is re-rendered (i.e. an edit was made) call this hook
    useUpdateLastEdited(project_id);

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
            } catch (e) {
                console.error('Error fetching project:', e);
            }
        };

        if (project_id) {
            fetchProject();
        }
    }, [project_id]);

    // Video player logic
    const [isPlaying, setIsPlaying] = useState(false);
    const playerRef = useRef<ReactPlayer>(null);

    const handlePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e : any) => {
        if (playerRef.current != null){
            const seekFromButton : number = +(e.target.value);
            const newTime = seekFromButton + playerRef.current.getCurrentTime();
            playerRef.current.seekTo(newTime);
        }
    };

    const handleSeekWaveform = (newTime: number) => {
        if (playerRef.current) {
            playerRef.current.seekTo(newTime);
        }
    };

    const videoController = controller_type === "regular" ? (
        <div className={styles.videoControlsContainer}>
            <button onClick={handleSeek} value="-5">Back 5s</button>
            <button onClick={handlePlay}>Play</button>
            <button onClick={handleSeek} value="5">Forward 5s</button>
        </div>
    )
        : (
            <div className={styles.waveFormWrapper}>
                <div className={styles.comp}>
                Timeline
                    <WaveForm setVideoTime={handleSeekWaveform} setPlaying={setIsPlaying} />
                </div>
            </div>
        );
    if (!projectInfo) {
        return <Loading />;
    }

    return (
        <div className={styles.mainContainer}>
            <div id={styles.video}>
                <ReactPlayer
                    ref={playerRef}
                    url={sampleVideo}
                    muted={false}
                    width="100%"
                    height="auto"
                    controls={false}
                    playing={isPlaying}
                    onSeek={(e) => console.log("onSeek",e)}
                />
                {videoController}
            </div>
            <div id={styles.transcript}>
                <h1>Transcript</h1>
                <Transcript/>
            </div>
        </div>
    );
};
export default Editor;
