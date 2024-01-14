import { Link } from 'react-router-dom';

import styles from './ListComponent.module.css'
import globalStyles from '../App.module.css'

import thumbnail from '../static/thumbnail1.png'
import { ProjectInfo } from '../Interfaces'


const ProjectComponent = ({ project_id, slug, name, created_at, size, onDelete }: ProjectInfo) => {
    return (
        <div className={styles.listComponent}>
            <Link to={`editor/${slug}`} className={globalStyles.Link} >
                <div className={`${styles.listComponentLeft} {styles.projectComponentLeft}`}>
                    <img src={thumbnail} className={styles.thumbnail} alt=""></img>
                    <p className={styles.name}>{name}</p>
                </div>
            </Link>
            <div className={styles.listComponentRight}>
                <div className={styles.listComponentInfo}>
                    <p>Created at: {created_at}</p>
                    <p>Project size: {size}</p>
                </div>
                <p>Options</p>
                <button onClick={() => {onDelete(project_id)}}>Delete Project</button>
            </div>
        </div>
    )
}

export default ProjectComponent;
