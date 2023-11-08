import {
    useParams,
} from "react-router-dom";

import '../App.css'
import './Editor.css'

interface funcProp {
    func: (data: string) => void;
}

const Editor = (props: funcProp) => {

    const { project } = useParams();
    props.func(`Editing ${project!}`);

    return (
        <div className="Editor mainContent">
            <div className='comp' id='main'>
                <div className='comp' id='editor'>{project}</div>
                <div className='comp' id='transcript'>Transcript</div>
                <div className='comp' id='timeline'>Timeline</div>
            </div>
        </div>
    )
}

export default Editor;