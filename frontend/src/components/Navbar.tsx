import { useNavigate } from 'react-router-dom';

import './Navbar.css'
import rectangle from '../media/Rectangle-2.png'
import podplistic from '../media/podplistic.png'
import profile from '../media/account.png'
import Title from './Title'

const Navbar: React.FC<{ title: string }> = ({ title }) => {
    const navigate = useNavigate();
    const handleClick = () => navigate('/');

    return (
        <div>
            <div className="navBackground">
                <img className="navBackgroundLogo" alt="Logo" src={podplistic} onClick={handleClick} />
                <img className="navBackgroundRectangle" alt="Rectangle" src={rectangle} />
                <Title text={title} />
                <img className='navBackgroundAccount' alt="Account" src={profile} />
            </div>
        </div>
    );
};

export default Navbar;