import { useState, useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import { ProjectInfo, funcProp } from '../Interfaces';
import ProjectComponent from './ProjectComponent';
import Loading from './Loading';

import { useWaitAuth0Redirect } from '../hooks/useWaitAuthoRedirect';

const Landing = (props: funcProp) => {
 
    props.func("Podplistic");

    const isLoggedIn =  useWaitAuth0Redirect('login');
    
    const [projects, setProjects] = useState<ProjectInfo[]>([]);

    const navigate = useNavigate();
    const gotoCreate = () => navigate('/create');
    const makeAPICallRef = useRef(true);

    const [isLoading,setIsLoading] = useState<boolean>(true);

    /**
     * Fetches all projects from the database by calling the Flask API
     * 
     * @returns {Promise<void>} - returns a Promise that is resolved when the project is deleted. 
     * @throws {Error} - throws an error if there is an issue fetching projects.
     */
    const fetchProjects = async (): Promise<void> => {
        try {
            const response = await fetch(process.env.REACT_APP_FLASK_API_DEVELOP + '/projects');
            if(!response.ok) {
                throw new Error(`Failed to fetch projects. Status: ${response.status.toString()}`);
            }
            const projects = await response.json(); 
            setProjects(projects);
            setIsLoading(false);
        } catch (e) {
            console.error('Error fetching projects:', e);
        }
    };

    /**
     * Deletes a project by calling the Flask API.
     * 
     * @param {string} project_id - the ID of the project to be deleted.
     * @returns {Promise<void>} - returns a Promise that is resolved when the project is deleted. 
     */
    const handleDelete = async (project_id: string): Promise<void> => {
        try {
            const response = await fetch(process.env.REACT_APP_FLASK_API_DEVELOP + `/delete/${project_id}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            // If successfully deleted from the API, remove the component from the frontend
            setProjects((currentProjects) =>
                currentProjects.filter((project) => project.project_id !== project_id)
            );
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };


    useEffect(() => {
        if (makeAPICallRef.current){
            if(isLoggedIn){
                fetchProjects();
            }
            makeAPICallRef.current = false;
        }
    },[isLoggedIn]);



    const sortedProjects = projects.slice().sort((a, b) => {
        return new Date(b.last_edited).getTime() - new Date(a.last_edited).getTime();
    });


    if (isLoading){
        return (
            <Loading />
        );
    } else if (projects.length === 0) {
        return (
            <div>
                <p>No projects found...</p>
                <button onClick={gotoCreate}>Create Podcast</button>
            </div>
        );
    } else {
        return (
            <div>
                {sortedProjects.map(({ project_id, name, created_at, last_edited, size }) => {
                    return (
                        <ProjectComponent
                            key={project_id}    // React wants a unique key for each item in map
                            project_id={project_id}
                            slug={project_id} // TODO: change this to slug={slug} when slug feature is implemented
                            name={name} 
                            created_at={created_at} 
                            last_edited={last_edited}
                            size={size} 
                            onDelete={() => handleDelete(project_id)}/>
                    );
                })}
                <button onClick={gotoCreate}>Create Podcast</button>
            </div>
        );
    }

};

export default Landing;
