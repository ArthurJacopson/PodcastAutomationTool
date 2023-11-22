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
                <div>
                    <ReactPlayer 
                        url={sampleVideo}
                        controls={true} 
                        width="55vw"
                        height="100%"
                    />
                </div>
            </div>

            <div className={styles.comp} id={styles.timeline}>
                <div className={styles.compHeading}>
                    Timeline
                </div>
                <div>
                    <WaveForm />
                </div>
            </div>

            <div className={styles.comp} id={styles.transcript}>
                <div className={styles.compHeading}>
                    Transcript
                </div>
            </div>
        </div>
        );
    };

export default Editor;