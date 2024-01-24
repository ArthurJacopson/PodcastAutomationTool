import { useState } from "react";

import { TranscriptWordInfo } from "../Interfaces";

import style from "./SingleWord.module.css";



const SingleWord = ({id,start,end,text} : TranscriptWordInfo) => {

    const [isHovered,setIsHovered] = useState(false);

    const buttonColour  = isHovered ? '#3DA3DB' : 'gray';
    const textColour = isHovered ? '#E0E0E0' : 'white';

    const handleHover = () => {
        setIsHovered(!isHovered);
    };

    return (
        <div id={id as unknown as string} className={style.word}>
            <button 
                onMouseOver={handleHover} 
                onMouseLeave={handleHover} 
                style={{
                    backgroundColor: buttonColour,
                    color: textColour
                }}
            >
                {text}
            </button>
        </div>
    );

};

export default SingleWord;
