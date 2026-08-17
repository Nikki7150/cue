import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/Home.css';

const Home = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="home-container">
            <div className="home-header">
                <h1>{getGreeting()}, {user ? user?.displayName : 'Guest'}!</h1>
                <p>Ready to cue your brain?</p>
            </div>
            <button onClick={() => navigate('/login')} style={{ display: user ? 'none' : 'block' }}>Login</button>
            <button className="logout-button" style={{ display: user ? 'block' : 'none' }} onClick={logout}>Logout</button>
        </div>
    );
};

export default Home;