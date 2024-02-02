import { useState } from "react";

import { TranscriptWordInfo } from "../../../Interfaces";

import style from "./SingleWord.module.css";



const SingleWord = ({id,start,end,text} : TranscriptWordInfo) => {

    return (
        <div id={id as unknown as string} className={style.word}>
            <button >
                {text}
            </button>
        </div>
    );

};

export default SingleWord;
