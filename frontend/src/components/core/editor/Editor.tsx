import { useParams } from "react-router-dom";
import { createContext, createRef, useEffect, useRef, useState } from "react";

import { funcProp, ProjectInfo } from "@src/Interfaces";

import ReactPlayer from "@ehibb/react-player";

import styles from './Editor.module.css';

import sampleVideo from '@static/sample.mp4';
import Transcript from "@features/transcription/Transcript";
import WaveForm from "@shared/waveform/WaveForm";
import useUpdateLastEdited from "@hooks/useUpdateLastEdited";
import Loading from "@shared/loading-animation/Loading";
import { OnProgressProps } from "@ehibb/react-player/base";

type ReactPlayerProvider = {
    playerRef : React.RefObject<ReactPlayer>,
    isPlaying: boolean,
    currentTime : number,
    isUpdated: boolean,
}



export const ReactPlayerContext = createContext<ReactPlayerProvider>({
    playerRef : createRef<ReactPlayer>(),
    isPlaying : false,
    currentTime : 0,
    isUpdated : false,
});

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
    const [currentTime,setCurrentTime] = useState<number>(0);
    const playerRef = useRef<ReactPlayer>(null);
    const [isUpdated, setIsUpdated] = useState(false);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e : any) => {
        if (playerRef.current != null){
            const duration  = playerRef.current.getDuration();
            const seekFromButton : number = +(e.target.value);
            const newTime = seekFromButton + playerRef.current.getCurrentTime();

            if (newTime > duration && isPlaying){
                togglePlay();
            }
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
            <button onClick={togglePlay}>Play</button>
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

    const handleOnProgress = (e: OnProgressProps) =>  {
        setCurrentTime(parseFloat((e.playedSeconds).toFixed(2)));
    };

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
                    onProgress={(e) => handleOnProgress(e)}
                    progressInterval={1}
                />
                {videoController}
            </div>
            <div id={styles.transcript}>
                <h1>Transcript</h1>
                <ReactPlayerContext.Provider value={{playerRef,isPlaying,currentTime, isUpdated}}>
                    <Transcript/>
                </ReactPlayerContext.Provider>
            </div>
        </div>
    );
};
export default Editor;
