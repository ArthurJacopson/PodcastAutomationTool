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

import AWS, { AWSError } from 'aws-sdk';
import { BlobMetadata } from "aws-sdk/clients/codecommit";
import { GetObjectOutput } from "aws-sdk/clients/s3";

type ReactPlayerProvider = {
    playerRef : React.RefObject<ReactPlayer>,
    handleSeekTranscript: (newTime: number) => void,
    isPlaying: boolean,
    currentTime : number,
    isUpdated: boolean,
}



export const ReactPlayerContext = createContext<ReactPlayerProvider>({
    playerRef : createRef<ReactPlayer>(),
    handleSeekTranscript: () => {},
    isPlaying : false,
    currentTime : 0,
    isUpdated : false,
});


const Editor  =  (props: funcProp) => {

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

    const { controller_type, project_id } = useParams();

    const [projectInfo, setProjectInfo] = useState<ProjectInfo>();
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

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

        /**
         * Fetches final podcast url from the minio storage by using the AWS SDK.
         * 
         * @returns {Promise<void>} - returns a Promise that is resolved when the podcast is fetched. 
         * @throws {Error} - throws an error if there is an issue fetching podcast.
         */
        const fetchVideoUrl = async () => {
            try {
                const params = {
                    Bucket: `project-${project_id}`,
                    Key: 'final-product/final_podcast_mastered.mp4',
                };

                const waitForObjectToExist = async (params: AWS.S3.HeadObjectRequest, timeout = 30000, interval = 1000): Promise<boolean> => {
                    const startTime = Date.now();
                    while (Date.now() - startTime < timeout) {
                        try {
                            // Attempt to get object metadata
                            const data = await s3.headObject(params).promise();
                            // If successful, the object exists
                            return true;
                        } catch (error: any) {
                            if (error) {
                                // If error is "NotFound", continue waiting
                            } 
                        }
                        // Wait for the specified interval before trying again
                        await new Promise(resolve => setTimeout(resolve, interval));
                    }
                    // Timeout reached, object doesn't exist
                    return false;
                };

                const exists = await waitForObjectToExist(params);
                if (exists) {
                    const url = await s3.getSignedUrlPromise('getObject', params);
                    setVideoUrl(url);
                } else {
                    console.log('File does not exist.');
                }
            } catch (error) {
                console.error('Error fetching video URL:', error);
            }
        };

        if (project_id) {
            fetchProject();
            fetchVideoUrl();
        }
    }, [project_id]);

    /**
     * API call to create final version of video, where deleted words are properly removed
     * Once this call has successfully returned retrieve the raw video data from minio and download* it
     *
     * @returns {void} - Nothing returned, but browser downloads video
     * @throws {Error} - throws error if there is an error with either the API call or minio call
     *
     */
    const exportPodcast = async () => {

        try{
            const response = await fetch(process.env.REACT_APP_FLASK_API_DEVELOP
                + `/export-podcast/${project_id}`);
            if (!response.ok) {
                throw new Error(response.status.toString());
            }

            const params = {
                Bucket: `project-${project_id}`,
                Key: `final-product/final_podcast_export.mp4`,
            };

            // This uses a callback to download the video once it is retrieved
            s3.getObject(params, (err:AWSError, data:GetObjectOutput) => {
                if(err){
                    throw new Error(err.statusCode?.toString());
                } else {
                    const buffer: Buffer = data.Body as Buffer;
                    const blob = new Blob([buffer], {type: data.ContentType});
                    
                    // Need to create a link so that we can "click" it to actually download the content - just having the data is not enough

                    const blobUrl = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = params.Key;
                    link.click();

                }
            });


        } catch (e) {
            console.error('Error trying to export podcast:', e);
        }

    };

    // Video player logic
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime,setCurrentTime] = useState<number>(0);
    const playerRef = useRef<ReactPlayer>(null);
    const [isUpdated, setIsUpdated] = useState(false);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleSeekButton = (e : any) => {
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
	
    /*
	 * Updates the time on the video according to the transcript
	 * This will also update the time on the waveform, if it is being used
	 *
	 * @params {number} newTime, which the react player reference will seek to
	 * @returns {void}
	 */
	
    const handleSeekTranscript = (newTime: number) => {
        if (playerRef.current){
            playerRef.current.seekTo(newTime);
            setCurrentTime(newTime);
            setDidVideoSeek(true);
        }
    };


    //  Extra logic for waveform
    const [didVideoSeek, setDidVideoSeek] = useState(false);

    const handleSeekWaveform = (newTime: number) => {
        if (playerRef.current) {
            playerRef.current.seekTo(newTime);
        }
    };
    const videoController = controller_type === "regular" ? (
        <div className={styles.videoControlsContainer}>
            <button onClick={handleSeekButton} value="-5">Back 5s</button>
            <button onClick={togglePlay}>Play</button>
            <button onClick={handleSeekButton} value="5">Forward 5s</button>
        </div>
    )
        : (
            <div className={styles.waveFormWrapper}>
                <div className={styles.comp}>
                Timeline
                    <WaveForm
                        setVideoTime={handleSeekWaveform} 
                        videoUrl={videoUrl} 
                        setPlaying={setIsPlaying}
                        didVideoSeek={didVideoSeek}
                        setDidVideoSeek={setDidVideoSeek}
                        currentTime={currentTime}
                    />
                </div>
            </div>
        );
    if (!projectInfo || !videoUrl) {
        return <Loading />;
    }

    const handleOnProgress = (e: OnProgressProps) =>  {
        setCurrentTime(parseFloat((e.playedSeconds).toFixed(2)));
    };

    return (
        <div className={styles.mainContainer}>
            <div id={styles.video}>
                {videoUrl && (
                    <ReactPlayer
                        ref={playerRef}
                        url={videoUrl}
                        muted={false}
                        width="100%"
                        height="auto"
                        controls={false}
                        playing={isPlaying}
                        onSeek={(e) => console.log("onSeek",e)}
                        onProgress={(e) => handleOnProgress(e)}
                        progressInterval={1}
                    />
                )}
                {videoController}
                <button onClick={exportPodcast}> Export Podcast </button>
                
            </div>
            <div id={styles.transcript}>
                <h1>Transcript</h1>
                <ReactPlayerContext.Provider value={{playerRef,handleSeekTranscript,isPlaying,currentTime, isUpdated}}>
                    <Transcript videoUrl={videoUrl} projectID={project_id}/>
                </ReactPlayerContext.Provider>
            </div>
        </div>
    );
};
export default Editor;
