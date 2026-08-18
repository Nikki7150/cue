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
import { PiCardsThree, PiCards } from "react-icons/pi";
import { TbProgress } from "react-icons/tb";

const Home = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('newest');

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

    const totalDecks = decks.length;
    const totalCards = decks.reduce((sum, deck) => sum + (deck.cards?.length || 0), 0);
    const avgProgress = Math.round(decks.reduce((sum, d) => sum + (d.percent || 0), 0) / decks.length);

    const inProgressDecks = decks
        .filter((deck) => (deck.percent || 0) > 0 && (deck.percent || 0) < 100)
        .sort((a, b) => (b.percent || 0) - (a.percent || 0));

    const sortedDecks = [...decks].sort((a, b) => {
        const aTime = a.createdAt?.toMillis() || 0;
        const bTime = b.createdAt?.toMillis() || 0;
        return sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
    });

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
                        <PiCardsThree size={40} className="stats-icons" />
                        <div className="division">
                            <h1 className="stats-heading">Decks</h1>
                            <p className="stats-number">{totalDecks}</p>
                        </div>
                    </div>
                    <div className="cards-stats">
                        <PiCards size={40} className="stats-icons" />
                        <div className="division">
                            <h1 className="stats-heading">Cards</h1>
                            <p className="stats-number">{totalCards}</p>
                        </div>
                    </div>
                    <div className="progress-stats">
                        <TbProgress size={40} className="stats-icons" />
                        <div className="division">
                            <h1 className="stats-heading">Progress</h1>
                            <p className="stats-number">{avgProgress}%</p>
                        </div>
                    </div>
                </div>
                <div className="home-decks-heading">
                    <p className="home-subtitle-1">Continue Learning</p>
                </div>
                <div className="home-continue">
                    {inProgressDecks.length > 0 && (
                        <div className="home-decks">
                            {inProgressDecks.slice(0, 4).map((deck) => {
                                const tag = tags.find((t) => t.id === deck.tagId);
                                return (
                                    <div className="decks" key={deck.id}>
                                        <Deck deck={deck} onClick={() => navigate('/review/' + deck.id)} tagColor={tag ? tag.color : undefined} />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {inProgressDecks.length === 0 && (
                        <div className="info-div">
                            <p className="info">No decks in progress yet.</p>
                            <p className="info-click" onClick={() => navigate('/decks')}>go to decks and choose a deck to learn.</p>
                        </div>
                    )}
                </div>
                <div className="home-decks-heading">
                    <p className="home-subtitle-1">Your Decks</p>
                    <div className="hero-buttons">
                        <p className="add-decks" onClick={() => navigate('/upload')}>+</p>
                        <p className='see-all' onClick={() => navigate('/decks')}>See all</p>
                    </div>
                </div>
                <div className="home-decks">
                    {sortedDecks.slice(0, 4).map((deck) => {
                        const tag = tags.find((t) => t.id === deck.tagId);
                        return (
                            <div className="decks" key={deck.id}>
                                <Deck deck={deck} onClick={() => navigate('/review/' + deck.id)} tagColor={tag ? tag.color : undefined} />
                                <p className="deck-cards-length">{deck.cards?.length || 0} cards</p>
                                <ProgressBar percent={deck.percent || 0} color={tag ? tag.color : undefined} />
                            </div>
                        );
                    })}
                    {decks.length === 0 && (
                        <div className="info-div">
                            <p className="info">No decks yet.</p>
                            <p className="info-click" onClick={() => navigate('/upload')}>upload your first set of notes to get started.</p>
                        </div>
                    )}
                </div>
                {loading && <LoadingSpinner />}
            </div>
            {/*
            <button onClick={() => navigate('/login')} style={{ display: user ? 'none' : 'block' }} className='login-button'>Login</button>
            <button className="logout-button" style={{ display: user ? 'block' : 'none' }} onClick={logout}>Logout</button>*/}
        </div>
    );
};

export default Home;