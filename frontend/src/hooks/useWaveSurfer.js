import { useState, useEffect } from "react";

import WaveSurfer from "wavesurfer.js";

import sampleAudio from '../static/sample.mp3'

export function useWaveSurfer(containerRef)
{
    const [wavesurfer, setWavesurfer] = useState(null)
    useEffect(() =>
    {
        if (containerRef.current != null)
        {
            const wavesurfer = WaveSurfer.create({
                waveColor: '#01C1FF',
                progressColor: '#6DDBFF',
                cursorColor: '#c8a2c8',
                barWidth: 3,
                barHeight: 0.8,
                url: sampleAudio,
                height: 80,
                container: containerRef.current,
            })

            setWavesurfer(wavesurfer);

            return () =>
            {
                wavesurfer.destroy();
            }
        }

    }, [containerRef]);

    return wavesurfer
};
