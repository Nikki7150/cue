import { NavLink } from 'react-router-dom';
import { PiCardsThree } from "react-icons/pi";
import { MdOutlineRateReview } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { IoHomeOutline } from "react-icons/io5";
import '../styles/Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
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
        </nav>
    );
};

export default Navbar;