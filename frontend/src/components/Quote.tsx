import SingleWord from "./SingleWord";

import { TranscriptWordInfo } from "../Interfaces";

import styles from './Quote.module.css';

const Quote = ({wordArray,TimestampId} : any) => {

    const words = wordArray.map(({text,start,end} : TranscriptWordInfo,index:number) =>  
        <SingleWord 
            key={index} 
            id={index} 
            start={start} 
            end={end} 
            text={text}
        />);

    return (
        <div id={TimestampId} className={styles.quoteContainer}>
            {words}
        </div>
    );
};

export default Quote;