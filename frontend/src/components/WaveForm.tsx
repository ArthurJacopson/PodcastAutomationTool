
import { useEffect, useRef, useState, useCallback} from "react";
import { useWaveSurfer } from "../hooks/useWaveSurfer";

import WaveSurfer from "wavesurfer.js";
import styles from './WaveForm.module.css';

const WaveForm = ()  => {

    const waveformContainerRef = useRef(null);
    const [isPlaying,setIsPlaying] = useState(false);
    const wavesurfer = useWaveSurfer(waveformContainerRef) as unknown as WaveSurfer;

    const onClickPlay = useCallback(() => {
        wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play()
    },[wavesurfer])


    useEffect(() => {
        if (wavesurfer){
            setIsPlaying(false)
            const functions = [
                wavesurfer.on('play',() =>setIsPlaying(true)),
                wavesurfer.on('pause',() =>setIsPlaying(false)),
            ]

            return () => {
                functions.forEach((unsub)=>unsub())
            }
        }
    } ,[wavesurfer]);

    return (
        <div id={styles.waveformContainer} ref={waveformContainerRef}>
            <button onClick={onClickPlay}>{isPlaying ? "Pause" : "Play"}</button>
        </div>

    );

};


export default WaveForm