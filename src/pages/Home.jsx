import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    return (
        <div className="home">
            <h1>Welcome to the Home Page</h1>
            <p>Hello, {user ? user?.displayName : 'Guest'}!</p>
            <button onClick={() => navigate('/login')} style={{ display: user ? 'none' : 'block' }}>Login</button>
            <button className="logout-button" style={{ display: user ? 'block' : 'none' }} onClick={logout}>Logout</button>
        </div>
    );
};

export default Home;