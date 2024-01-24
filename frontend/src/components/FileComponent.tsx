import styles from './ListComponent.module.css';

import { FileInfo } from '../Interfaces';

import { cropString } from "../utils";


const FileComponent = ({name, size, file_type, thumbnail_url }: FileInfo) => {
    return (
        <div className={styles.listComponent}>
            <div className={styles.listComponentLeft}>
                <img src={thumbnail_url} className={styles.thumbnail} alt=""></img>
                <p className={styles.name}>{cropString(name, 20)}</p>
            </div>
            <div className={styles.listComponentRight}>
                <div className={styles.listComponentInfo}>
                    <p>Type: {file_type}</p>
                    <p>Size: {size}</p>
                    <button>Options</button>
                </div>
            </div>
        </div>
    );
};

export default FileComponent;

