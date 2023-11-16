import { useNavigate } from 'react-router-dom';

import './Navbar.css'

import podplistic from '../static/podplistic.png'
import profile from '../static/account.png'

const Navbar: React.FC<{ title: string }> = ({ title }) => {
    const navigate = useNavigate();
    const handleClick = () => navigate('/');

    return (
        <div className="navContainer">
            <img className="navLogo" alt="Logo" src={podplistic} onClick={handleClick} />
            <h1 className="TitleText">{title}</h1>
            <img className='navBackgroundAccount' alt="Account" src={profile} />
        </div>
    );
};

export default Navbar;
