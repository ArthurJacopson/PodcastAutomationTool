import {
    useParams,
} from "react-router-dom";

import styles from './Editor.module.css'

interface funcProp {
    func: (data: string) => void;
}

const Editor = (props: funcProp) => {

    const { project } = useParams();
    props.func(`Editing ${project!}`);

    return (
        <div id={styles.main}>
            <div className={styles.comp} id={styles.editor}>{project}</div>
            <div className={styles.comp} id={styles.transcript}>Transcript</div>
            <div className={styles.comp} id={styles.timeline}>Timeline</div>
        </div>
    )
}

export default Editor;