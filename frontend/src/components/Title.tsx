import './Title.css'
import React from "react";

const Title : React.FC<{ text: string }> = ({ text })=> {
    return (
        <div>
            <div className="Title">
            <h1 className="TitleText">{ text }</h1>
            </div>
        </div>
    );

};

export default Title;