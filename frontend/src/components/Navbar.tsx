import { useNavigate } from 'react-router-dom';

import styles from './Navbar.module.css'

import podplistic from '../static/podplistic.png'
import profile from '../static/account.png'

const Navbar: React.FC<{ title: string }> = ({ title }) => {
    const navigate = useNavigate();
    const handleClick = () => navigate('/');

    return (
        <div className={styles.navContainer}>
            <img className={styles.navLogo} alt="Logo" src={podplistic} onClick={handleClick} />
            <h1 className={styles.TitleText}>{title}</h1>
            <img className={styles.navBackgroundAccount} alt="Account" src={profile} />
        </div>
    );
};

export default Navbar;
