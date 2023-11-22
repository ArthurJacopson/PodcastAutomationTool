import { useEffect, useRef, useState, useCallback } from "react";
import { useWaveSurfer } from "../hooks/useWaveSurfer";
import WaveSurfer from "wavesurfer.js";
import styles from './WaveForm.module.css';

const WaveForm = (props: any) => {
    const waveformContainerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const wavesurfer = useWaveSurfer(waveformContainerRef) as unknown as WaveSurfer;

    const onClickPlay = useCallback(() => {
        wavesurfer.playPause();
    }, [wavesurfer]);

    useEffect(() => {
        if (wavesurfer) {
            const functions = [
                wavesurfer.on('play', () => {
                    setIsPlaying(true);
                    props.setPlaying(true);
                }),
                wavesurfer.on('pause', () => {
                    setIsPlaying(false);
                    props.setPlaying(false);
                }),
                wavesurfer.on('seeking', (progress: number) => {
                    props.setVideoTime(progress);
                }),
                wavesurfer.on('finish', () => {
                    setIsPlaying(false);
                    props.setPlaying(false);
                })
            ];

            return () => {
                functions.forEach((unsub) => unsub());
            };
        }
    }, [wavesurfer, props, props.setVideoTime, props.setIsPlaying,]);

    return (
        <div id={styles.waveformContainer} ref={waveformContainerRef}>
            <button onClick={onClickPlay}>{isPlaying ? "Pause" : "Play"}</button>
        </div>
    );
};

export default WaveForm;