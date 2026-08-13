import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { fetchDecks } from '../lib/decks';
import LoadingSpinner from '../components/LoadingSpinner';

const DeckList = () => {
    const [decks, setDecks] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        if (!user) {
            setLoading(false);
            return;
        }
        fetchDecks(user.uid).then((decks) => {
            setDecks(decks);
            setLoading(false);
        }).catch((error) => {
            setError(error);
            setLoading(false);
        });
    }, [user.uid]);

    return (
        <div>
            <h1>Deck List</h1>
            {loading && <LoadingSpinner />}
            <ul>
                {decks.map((deck) => (
                    <li key={deck.id} onClick={() => navigate('/review/' + deck.id)}>{deck.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default DeckList;