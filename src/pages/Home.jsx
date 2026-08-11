import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home">
            <h1>Welcome to the Home Page</h1>
            <button onClick={() => navigate('/login')}>Login</button>
        </div>
    );
};

export default Home;