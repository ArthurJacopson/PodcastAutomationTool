import { Link } from 'react-router-dom';

import './FileComponent.css'
import '../App.css'

import thumbnail from '../static/thumbnail1.png'

interface FileInfo {
    slug: string;
    name: string;
    date: string;
    size: number;
}

const FileComponent = ({ slug, name, date, size }: FileInfo) => {

    return (
        <div className="fileComponent">
            <Link to={`editor/${slug}`} className='Link' >
                <div className='fileComponentLeft'>
                    <img src={thumbnail} className='thumbnail'></img>
                    <p className='name'>{name}</p>
                </div>
            </Link>
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