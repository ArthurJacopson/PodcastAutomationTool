import styles from './Editor.module.css'

import { useNavigate } from 'react-router-dom';
import FileComponent from './FileComponent';
import { funcProp } from '../Interfaces';

const Landing = (props: funcProp) => {

    props.func("Podplisticss");

    const navigate = useNavigate();
    const gotoCreate = () => navigate('/create');
    const sampleData = [
        { slug: "a", name: "Project A", date: "Oct 25, 2023", size: 55.71 },
        { slug: "b", name: "Project B", date: "Oct 14, 2023", size: 25.61 },
    ]

    return (
        <div className="mainContent">
            {sampleData.map(({ slug, name, date, size }) => {
                return (<FileComponent slug={slug} name={name} date={date} size={size} />
                )
            })}
            <button onClick={gotoCreate}>Create Podcast</button>
        </div>
    )
}

export default Landing;
