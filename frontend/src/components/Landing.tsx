import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import FileComponent from './FileComponent';
import { funcProp } from '../Interfaces';

const Landing = (props: funcProp) => {

    props.func("Podplistic");

    // const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
    const gotoCreate = () => navigate('/create');

    const makeAPICall = async () => {
        try {
            // setLoading(true);
            const response = await fetch('http://127.0.0.1:5000/projects');
            const data = await response.json();
            setProjects(await data);
            // setLoading(false);
            console.log({ data })
        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        makeAPICall();
    }, [])

    if (projects.length === 0) {
        return (
            <div>
                <p>No projects found...</p>
                <button onClick={gotoCreate}>Create Podcast</button>
            </div>
        );
    }
    else {
        return (
            <div className="mainContent">
                {projects.map(({ slug, name, date, size }) => {
                    return (<FileComponent key={slug} slug={slug} name={name} date={date} size={size} />
                    )
                })}
                <button onClick={gotoCreate}>Create Podcast</button>
            </div>
        );
    }

}

export default Landing;
