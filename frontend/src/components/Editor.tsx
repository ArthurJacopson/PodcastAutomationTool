import {
    useParams
} from "react-router-dom";

import { useRef, useState } from "react";

import styles from './Editor.module.css'
import ReactPlayer from '@ehibb/react-player';

import sampleVideo from '../static/sample.mp4'
import WaveForm from "./WaveForm";
import { funcProp } from "../Interfaces";


const Editor = (props: funcProp) => {

    // Get the project name and pass it to the navbar
    const { project } = useParams();
    props.func(`Editing ${project!}`);


    // Video player logic
    const [isPlaying, setIsPlaying] = useState(false);
    const playerRef = useRef<ReactPlayer>(null);

    const handleSeek = (newTime: number) => {

        if (playerRef.current) {
            playerRef.current.seekTo(newTime);
        }
    };

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