import {useEffect, useRef, useState, createContext, useContext, createRef, forwardRef } from 'react';

import axios from 'axios';

import styles from './Transcript.module.css';

import TimeStamp from './TimeStamp';
import Quote from './Quote';
import Loading from '@shared/loading-animation/Loading';
import {TranscriptProps } from "@src/Interfaces";

import { TranscriptWordInfo } from '../../../Interfaces';

import {ReactPlayerContext} from "../../core/editor/Editor";

import AWS from 'aws-sdk';

type QuoteWordTuple = [number,number];

export interface TimeStampStatus{
    index  : QuoteWordTuple
    payload : TranscriptWordInfo
    enabled : boolean;
}

export interface WhisperTimeStamped {
    id : string; 
    start : number; 
    end : number;
    words : TranscriptWordInfo[];
}


type TimeStampProvier = {
    timestamps : TimeStampStatus[]
    setTimeStamps : React.Dispatch<React.SetStateAction<TimeStampStatus[]>>
    timestampIndex : number
}

export const TimeStampContext = createContext<TimeStampProvier>({
    timestamps: [],
    setTimeStamps: () => {},
    timestampIndex : 0
});

const Transcript = (props : TranscriptProps) => {

    AWS.config.update({
        accessKeyId: process.env.REACT_APP_MINIO_USER_NAME,
        secretAccessKey: process.env.REACT_APP_MINIO_PASSWORD,
        region: 'London', // Set the region accordingly
        s3ForcePathStyle: true, // Required for Minio
        signatureVersion: 'v4', // Use v4 signature for Minio
    });

    const s3 = new AWS.S3({
        endpoint: process.env.REACT_APP_MINIO_ENDPOINT,
    });

    const [segment,setSegment] = useState([]);
    const makeAPICall = useRef(true);
    const [isLoading,setIsLoading] = useState<boolean>(true);
    const timestampIndex = useRef<number>(0);

    const [timestamps,setTimeStamps] = useState<TimeStampStatus[]>([]);

    const {isPlaying,playerRef,handleSeekTranscript,currentTime,isUpdated} = useContext(ReactPlayerContext);

    const bucketName = `project-${props.projectID}`;
    const key = 'final-product/transcript.json'; 
      
    const uploadJsonToMinio = (jsonData: any) => {

        const params = {
            Bucket: bucketName,
            Key: key,
            Body: JSON.stringify(jsonData),
            ContentType: 'application/json',
        };
    
        s3.upload(params, (err: any, data: any) => {
            if (err) {
                console.error('Error uploading file:', err);
            } else {
                console.log('File uploaded successfully:', data.Location);
            }
        });
    };

    const getTranscript = async () => {
        try{
            const UPLOAD_ENDPOINT = `http://127.0.0.1:5000/get-transcript`;
            const data = {
                "video_file_path": props.videoUrl,
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
        if (makeAPICall.current== true){
            const getParams = {
                Bucket: bucketName,
                Key: key,
            };

            s3.getObject(getParams, (err, data) => {
                if (err) {
                    console.error('Error retrieving JSON file from MinIO: Generating transcript instead.');
                    if (makeAPICall.current === true){
                        const segments = getTranscript();
                        segments.then((value) => {
                            setSegment(value);
                            setIsLoading(false);
                            uploadJsonToMinio(value);
                        });
                        makeAPICall.current = false;
                    }
                } else {
                    const jsonData = data?.Body ? JSON.parse(data.Body.toString()) : null;
                    console.log('Retrieved JSON data:', jsonData);
                    setSegment(jsonData);
                    setIsLoading(false);
                    makeAPICall.current = false;
                }
            });
        }

    },[]);

    /*
     * Updates the index so that  
     *  - The index i is for the timestamp ahead of the current time
     *  - i.e. currentTime < timestamps[i].payload.start
     *  - Where there is no other timeStampIndex j != i such that
     *  
     *      currentTime <= timestamps[j].payload.start <= timestamps[i].payload.start
     *  
     * This function will return the correct index according to the rules described above
     */
    const findUpdatedTimestampIndex = () => {
        let tempIndex = timestampIndex.current;
        let data = timestamps[tempIndex].payload;

        if (data.start <= currentTime && currentTime <= data.end){ // Case 1: Current time is in current timestamp: do nothing
            
        } else if (data.end < currentTime && tempIndex < timestamps.length - 1) { // Case 2: Current time is after the current timestamp: need to move index up
            while (data.end < currentTime){
                tempIndex++;
                if (tempIndex === timestamps.length - 1){ // In case a timestamp somehow ends after the video
                    break;
                }
                data = timestamps[tempIndex].payload;
            } 
        } else if (tempIndex !== 0) { // Case 3: Either the currentTime is between timestamps or is in a previous timestamp!
            data = timestamps[tempIndex - 1].payload;
            while (data.end > currentTime) {
                tempIndex--;
                if (tempIndex === 0){ // In case a timestamp somehow starts/ends before the video
                    break;
                }
                data = timestamps[tempIndex].payload;
                
            }
        }
        return tempIndex;
    };
    useEffect(() => {
        if (timestamps.length != 0){
            let tempIndex = findUpdatedTimestampIndex();
            timestampIndex.current = tempIndex;

            let lookAheadTime = currentTime + 0.050; // we want to look ahead a certain amount of time
            let foundSuitableStop = false;
            let firstSkipFound = false;
            let firstSkipTime = -1;
            let seekTime = lookAheadTime;
            while (!foundSuitableStop && tempIndex <= timestamps.length - 1){
                const data = timestamps[tempIndex].payload;
                const enabled = timestamps[tempIndex].enabled;
                if (data.start <= lookAheadTime && lookAheadTime <= data.end && !enabled){
                    if (!firstSkipFound){ 
                        firstSkipFound = true;
                        firstSkipTime = data.start;
                    }
                    seekTime = data.end;
                    lookAheadTime = seekTime + 0.050; // need to check if the following word is disabled too
                    tempIndex++;
                } else {
                    foundSuitableStop = true;  
                }
            }
            if (lookAheadTime != seekTime){ // i.e. there is a word(s) we want to skip
                setTimeout(() => {
                    handleSeekTranscript(seekTime);
                }, 1000 * (firstSkipTime - currentTime)); 
            }
        }
    },[currentTime]);


    if (isLoading) {
        return (
            <div className={styles.parent}>
                <Loading />
            </div>
        );
    } else if (segment === undefined || segment.length === 0) {
        return (
            <div className={styles.parent}>
                <div className={styles.MainContainer}>
                    Could not find Transcript.
                </div>
            </div>
        );
    } else {
        return(
            <ReactPlayerContext.Provider value = {{playerRef,handleSeekTranscript,isPlaying,currentTime,isUpdated}}>
                <TimeStampContext.Provider value={{timestamps : timestamps,setTimeStamps : setTimeStamps, timestampIndex : (timestampIndex.current)}}>
                    <div className={styles.parent}>
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
                    </div>
                </TimeStampContext.Provider>  
            </ReactPlayerContext.Provider>      
        );
    }
};


export default Transcript;
