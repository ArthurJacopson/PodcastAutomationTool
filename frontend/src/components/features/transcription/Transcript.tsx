import {useEffect, useRef, useState } from 'react';

import axios from 'axios';

import styles from './Transcript.module.css';
import TimeStamp from './TimeStamp';
import Quote from './Quote';
import Loading from '../../shared/loading-animation/Loading';


const Transcript = () => {

    const [segment,setSegment] = useState([]);
    const makeAPICall = useRef(true);
    const [isLoading,setIsLoading] = useState<boolean>(true);

    const getTranscript = async () => {
        try{
            const UPLOAD_ENDPOINT = `http://127.0.0.1:5000/get-transcript`;
            const data = {
                "video_file_path": "test_files/sample.mp4",
                "temp_folder": "temp_output/",
                "output_file_name":"out.mp3",
                "isCompressed":false
            };
            const response = await axios.post(UPLOAD_ENDPOINT, data, {
                headers: {
                    "content-type": "json",
                },
            });

            const transcriptJSON = await response.data;
            const parsed = await JSON.parse(await transcriptJSON);
            const segmentArray = parsed.segments;
            return segmentArray;
        }catch (e) {
            console.error(e);
        }

    };

    useEffect(() => {
        if (makeAPICall.current === true){
            const segments = getTranscript();
            segments.then((value) => {
                setSegment(value);
                setIsLoading(false);
            });
            makeAPICall.current = false;
        }
    },[]);



    return(
        <div className={styles.parent}>
            {isLoading ? 
                <>
                    <Loading />
                </> 
                :
                <div className={styles.MainContainer}>
                    {segment.map(({ id, start, end, words }) => (
                        <div key={id} className={styles.segmentContainer}>
                            <div className={styles.timestamp}>
                                <TimeStamp key={id} id={id} start={start} end={end} />
                            </div>
                            <div className={styles.transcription}>
                                <Quote key={id} wordArray={words} TimestampId={id} />
                            </div>
                        </div>
                    ))}
                </div>
            }
        </div>        
    );


};


export default Transcript;
