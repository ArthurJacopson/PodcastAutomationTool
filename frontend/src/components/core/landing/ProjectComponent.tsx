import { Link } from 'react-router-dom';

import styles from '../../shared/file-comp/ListComponent.module.css';
import globalStyles from '../../../App.module.css';

import thumbnail from '../../../static/thumbnail1.png';
import { ProjectInfo } from '../../../Interfaces';

import { getTimeAgo, cropString } from "../../../utils";


const ProjectComponent = ({ project_id, slug, name, created_at, last_edited, size, onDelete }: ProjectInfo) => {
    return (
        <div className={styles.listComponent}>
            <Link to={`editor/regular/${slug}`} className={globalStyles.Link} >
                <div className={`${styles.listComponentLeft} {styles.projectComponentLeft}`}>
                    <img src={thumbnail} className={styles.thumbnail} alt=""></img>
                    <p className={styles.name}>{cropString(name, 20)}</p>
                </div>
            </Link>
            <div className={styles.listComponentRight}>
                <div className={styles.listComponentInfo}>
                    <p>Edited {getTimeAgo(last_edited)}</p>
                    <p>Project size: {size}</p>
                    <button onClick={() => {
                        onDelete(project_id);
                    }}>Delete Project</button>
                </div>
            </div>
        </div>
    );
};

export default ProjectComponent;
