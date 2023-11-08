import { useNavigate } from 'react-router-dom';

import './FileComponent.css'

import thumbnail from '../static/thumbnail1.png'

interface FileInfo {
    name: string;
    date: string;
    size: number;
}

const FileComponent = ({ name, date, size }: FileInfo) => {

    const navigate = useNavigate();
    const handleClick = () => navigate('/editor');

    return (
        <div className="fileComponent">
            <div className='fileComponentLeft' onClick={handleClick}>
                <img src={thumbnail} className='thumbnail'></img>
                <p className='name'>{name}</p>
            </div>
            <div className='fileComponentRight'>
                <div className='fileInfo'>
                    <p>Last modified: {date}</p>
                    <p>Project size: {size}</p>
                </div>
                <p>Options</p>
            </div>
        </div>
    )
}

export default FileComponent;