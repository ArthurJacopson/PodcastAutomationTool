import { TimeStampInfo } from "../Interfaces";

import styles from "./TimeStamp.module.css";



const TimeStamp =  ({id,start,end} : TimeStampInfo) => {

    return  (
        <div id={id as unknown as string} className={styles.component}>
            <button>{start} s</button>-<button>{end} s</button>
        </div>

    );
};


export default TimeStamp;