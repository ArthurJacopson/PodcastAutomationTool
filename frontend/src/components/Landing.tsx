import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import FileComponent from './FileComponent';
import { funcProp } from '../Interfaces';

const Landing = (props: funcProp) => {

    props.func("Podplistic");

    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
    const gotoCreate = () => navigate('/create');

    const makeAPICall = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/projects');
            if(!response.ok) throw new Error(response.status.toString());
            const data = await response.json();
            setProjects(await data);
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
    // TODO: Need to handle empty projects option otherwise map throws an error
    else {
        return (
            <div className="mainContent">
                {projects.map(({ project_id, name, date, size }) => {
                    return (<FileComponent key={project_id} slug={project_id} name={name} date={date} size={size} />
                    )
                })}
                <button onClick={gotoCreate}>Create Podcast</button>
            </div>
        );
    }

}

export default Landing;
