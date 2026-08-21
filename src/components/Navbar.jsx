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

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isUserPopup, setIsUserPopup] = useState(false);
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <NavLink to="/">
                    <h2>Cue</h2>
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
                {user?.photoURL ? (
                    <img className="profile-picture" src={user.photoURL} alt="Profile" />
                ) : (
                    <FaUserCircle className="profile-picture" />
                )}
                <p className="user-name">{user ? user?.displayName : 'Guest'}</p>
                <button className="open-button" onClick={() => setIsUserPopup(!isUserPopup)}>{isUserPopup ? <IoIosArrowUp size={25} /> : <IoIosArrowDown size={25} /> }</button>
            </div>
        </nav>
    );
};

export default Navbar;