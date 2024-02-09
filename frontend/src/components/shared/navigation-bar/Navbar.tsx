import { useNavigate } from 'react-router-dom';

import styles from './Navbar.module.css';

import ProfileView from '@features/log-in/ProfileView';


import podplistic from '@static/podplistic.png';
import profile from '@static/account.png';
import { useState } from 'react';

import { NavbarProps } from "@src/Interfaces";

const Navbar: React.FC<{ title: string }> = ({ title } : NavbarProps ) => {
    const navigate = useNavigate();
    const handleClick = () => navigate('/');

    const [showPorfile,setShowProfile] = useState(false);

    const handleProfileClick = () => {
        setShowProfile((prevshowProfile) => !prevshowProfile);
    };

    return (
        <div className={styles.navContainer}>
            <img className={styles.navLogo} alt="Logo" src={podplistic} onClick={handleClick} />
            <h1 className={styles.TitleText}>{title}</h1>
            <img className={styles.navBackgroundAccount} alt="Account" src={profile} onClick={handleProfileClick}/>
            {showPorfile && <div className={styles.ProfileViewContainer}><ProfileView /></div>}
        </div>
    );
};

export default Navbar;
