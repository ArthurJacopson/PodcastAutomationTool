import {
    useParams,
} from "react-router-dom";

import styles from './Editor.module.css'
import ReactPlayer from 'react-player';

import sampleVideo from '../static/birds.mp4'
import WaveForm from "./WaveForm";
import { funcProp } from "../Interfaces";


const Editor = (props: funcProp) => {

    const { project } = useParams();
    props.func(`Editing ${project!}`);
    return (
        <div id={styles.main}>

            <div className={styles.comp} id={styles.editor}>
                <ReactPlayer
                    className={styles.player}
                    url={sampleVideo}
                    // controls={true}
                    width="100%"
                    height="100%"
                />
            </div>

            <div className={styles.comp} id={styles.transcript}>
                Transcript
            </div>

            <div className={styles.comp} id={styles.timeline}>
                Timeline
                <div>
                    <WaveForm />
                </div>
            </div>

        </div>
    );
};

export default Editor;