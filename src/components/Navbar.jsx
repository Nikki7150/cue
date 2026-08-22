import { NavLink } from 'react-router-dom';
import { PiCardsThree } from "react-icons/pi";
import { MdOutlineRateReview } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { IoHomeOutline } from "react-icons/io5";
import '../styles/Navbar.css';
import UserProfilePopup from './UserProfilePopup';
import { useAuth } from '../AuthContext';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Profile from '../assets/pfp.jpeg';
import CueLogo from '../assets/cue-logo.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isUserPopup, setIsUserPopup] = useState(false);
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <NavLink to="/">
                    <img className="cue-logo" src={CueLogo} alt="Logo" />
                </NavLink>
            </div>
            <div className="navbar-links">
                <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                    <span className="nav-icon"><IoHomeOutline size={25} /></span>
                    <span className="nav-label">Home</span>
                </NavLink>
                <NavLink to="/upload" className={({ isActive }) => (isActive ? 'active' : '')}>
                    <span className="nav-icon"><FiUpload size={25} /></span>
                    <span className="nav-label">Upload</span>
                </NavLink>
                <NavLink to="/review" className={({ isActive }) => (isActive ? 'active' : '')}>
                    <span className="nav-icon"><MdOutlineRateReview size={25} /></span>
                    <span className="nav-label">Review</span>
                </NavLink>
                <NavLink to="/decks" className={({ isActive }) => (isActive ? 'active' : '')}>
                    <span className="nav-icon"><PiCardsThree size={25} /></span>
                    <span className="nav-label">Decks</span>
                </NavLink>
            </div>
            {isUserPopup && (
                <UserProfilePopup 
                    user={user}
                    logout={logout}
                />
            )}
            <div className={`navbar-profile ${isUserPopup ? 'active' : ''}`}>
                <img className="profile-picture" src={Profile} alt="Profile" />
                <p className="user-name">{user ? user?.displayName : 'Guest'}</p>
                <button className="open-button" onClick={() => setIsUserPopup(!isUserPopup)}>{isUserPopup ? <IoIosArrowUp size={25} /> : <IoIosArrowDown size={25} /> }</button>
            </div>
        </nav>
    );
};

export default Navbar;