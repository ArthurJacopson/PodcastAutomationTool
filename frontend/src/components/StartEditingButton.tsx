import { PropsWithChildren } from "react";
import { Link } from 'react-router-dom';

import globalStyles from "../App.module.css"

const StartEditingButton:React.FC<PropsWithChildren<any>> = (props) => {
    return (
        <>
        {props.canContinue ? (
            <Link to={`../editor/${props.projectName}`} className={globalStyles.Link} >
                <button onClick={props.startProcessing}> Start Editing </button>
            </Link> 
        ) : (
                <Link to={`../editor/${props.projectName}`} className={globalStyles.Link} >
                    <button onClick={props.startProcessing} disabled> Start Editing </button>
                </Link> 
            )}
        </>
    );
}

export default StartEditingButton;
