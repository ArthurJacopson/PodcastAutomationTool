import { TimeStampInfo } from "../Interfaces";

import styles from "./TimeStamp.module.css";

import { getTime }  from "../utils";



const TimeStamp =  ({id,start,end} : TimeStampInfo) => {
    
    return  (
        <div id={id as unknown as string} className={styles.component}>
            <button>
                {getTime(start)}
            </button>
            -
            <button>
                {getTime(end)}
            </button>
        </div>

    );
};


export default TimeStamp;
