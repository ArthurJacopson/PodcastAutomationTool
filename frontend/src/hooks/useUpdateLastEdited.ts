import { useEffect } from "react";

const useUpdateLastEdited = (project_id: string | undefined) => {

    const API_ENDPOINT = process.env.REACT_APP_FLASK_API_DEVELOP;

    const updateLastEdited = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}/update/${project_id}`);
            if(!response.ok) {
                throw new Error(`Failed to update last edited. Status: ${response.status.toString()}`);
            } 
        } catch (e) {
            console.error('Error updating last edited:', e);
        }
    };

    useEffect(() => {
        if (project_id) {
            updateLastEdited();
        }
    });
}; 

export default useUpdateLastEdited;