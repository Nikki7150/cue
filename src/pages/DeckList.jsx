import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { fetchDecks } from '../lib/decks';
import LoadingSpinner from '../components/LoadingSpinner';
import Deck from '../components/Deck';
import { BsThreeDotsVertical } from "react-icons/bs";
import '../styles/DeckList.css';

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

    const [openMenuId, setOpenMenuId] = useState(null);

    const handleMenuClick = (e, deckId) => {
        e.stopPropagation();
        setOpenMenuId((prev) => (prev === deckId ? null : deckId));
    };

    return (
        <div className="deck-list-container">
            <h1 className="deck-list-title">Deck List</h1>
            {loading && <LoadingSpinner />}
            <ul className="deck-list">
                {decks.map((deck) => (
                    <div className="deck-item" key={deck.id}>
                        <Deck deck={deck} onClick={() => navigate('/review/' + deck.id)} />
                        <button
                            className="deck-menu-button"
                            onClick={(e) => handleMenuClick(e, deck.id)}
                        >
                            <BsThreeDotsVertical size={20} />
                        </button>
                        {openMenuId === deck.id && (
                            <div className="menu-popover">
                                <p>Menu</p>
                            </div>
                        )}
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default DeckList;