import { useEffect } from 'react';

import { useAuth0 } from "@auth0/auth0-react";

import { useNavigate } from "react-router-dom";

export function useWaitAuth0Redirect (redirectURL) {

    const {isLoading,isAuthenticated} = useAuth0();

    const navigate = useNavigate();
    
    useEffect(() => {
        const waitAuth0 =  async() => {
            if (await JSON.parse(process.env.REACT_APP_DEVELOPMENT)){
                // If in development mode, return early and prevent authentication from being required
                return;
            }
            if (isLoading === false && !isAuthenticated){
                navigate(redirectURL);
                return false;
            }
        }
        waitAuth0();
    }, [isLoading,isAuthenticated,navigate,redirectURL]);
    
    return isAuthenticated;
}