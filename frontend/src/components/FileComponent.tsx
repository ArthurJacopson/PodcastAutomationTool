import { Link } from 'react-router-dom';

import styles from './FileComponent.module.css'
import globalStyles from '../App.module.css'

import thumbnail from '../static/thumbnail1.png'
import { FileInfo } from '../Interfaces'


const FileComponent = ({ slug, name, date, size }: FileInfo) => {

    return (
        <div className={styles.fileComponent}>
            <Link to={`editor/${slug}`} className={globalStyles.Link} >
                <div className={styles.fileComponentLeft}>
                    <img src={thumbnail} className={styles.thumbnail} alt=""></img>
                    <p className={styles.name}>{name}</p>
                </div>
            </Link>
            <div className={styles.fileComponentRight}>
                <div className={styles.fileInfo}>
                    <p>Last modified: {date}</p>
                    <p>Project size: {size}</p>
                </div>
                <p>Options</p>
            </div>
        </div>
    )
}

export default FileComponent;
