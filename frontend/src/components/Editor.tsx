import './Editor.css'

const Editor = () => {
    return (
        <div className="Editor">
            <div className='comp' id='main'>
                <div className='comp' id='editor'>Editor</div>
                <div className='comp' id='transcript'>Transcript</div>
                <div className='comp' id='timeline'>Timeline</div>
            </div>
        </div>
    )
}

export default Editor;