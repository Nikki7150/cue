import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/Home.css';
import { FaUserCircle } from 'react-icons/fa';
import Deck from '../components/Deck';
import { fetchDecks } from '../lib/decks';
import { fetchTags } from '../lib/tags';
import ProgressBar from '../components/ProgressBar';
import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const [decks, setDecks] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        setLoading(true);
        if (!user) {
            setLoading(false);
            return;
        }
        Promise.all([fetchDecks(user.uid), fetchTags(user.uid)])
        .then(([decks, tags]) => {
            setDecks(decks);
            setTags(tags);
            setLoading(false);
        }).catch((error) => {
            setError(error);
            setLoading(false);
        });
    }, [user.uid]);

    return (
        <div className="home-container">
            <div className="home-header">
                <div className="home-div">
                    <h1 className="home-greeting">{getGreeting()}, {user ? user?.displayName : 'Guest'}!</h1>
                    <p className="home-subtitle">Ready to cue your brain?</p>
                </div>
                <FaUserCircle size={54} className="profile-icon" />
            </div>
            <div className="home-content">
                <div className="home-stats">
                    <div className="decks-stats">
                        <h1>Decks</h1>
                        <p>24</p>
                    </div>
                    <div className="cards-stats">
                        <h1>Cards</h1>
                        <p>54</p>
                    </div>
                    <div className="decks-stats">
                        <h1>Decks</h1>
                        <p>24</p>
                    </div>
                    <div className="cards-stats">
                        <h1>Cards</h1>
                        <p>54</p>
                    </div>
                </div>
                <p className="home-subtitle">Your Decks</p>
                <div className="home-decks">
                    {decks.slice(0, 4).map((deck) => {
                        const tag = tags.find((t) => t.id === deck.tagId);
                        return (
                            <div className="decks" key={deck.id}>
                                <Deck deck={deck} onClick={() => navigate('/review/' + deck.id)} tagColor={tag ? tag.color : undefined} />
                            </div>
                        );
                    })}
                </div>
            </div>
            {/*
            <button onClick={() => navigate('/login')} style={{ display: user ? 'none' : 'block' }} className='login-button'>Login</button>
            <button className="logout-button" style={{ display: user ? 'block' : 'none' }} onClick={logout}>Logout</button>*/}
        </div>
    );
};

export default Home;