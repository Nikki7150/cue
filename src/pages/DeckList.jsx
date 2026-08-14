import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { fetchDecks, updateTitle } from '../lib/decks';
import LoadingSpinner from '../components/LoadingSpinner';
import Deck from '../components/Deck';
import { BsThreeDotsVertical } from "react-icons/bs";
import '../styles/DeckList.css';
import { IoIosCheckmark } from "react-icons/io";

const DeckList = () => {
    const [decks, setDecks] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newTitle, setNewTitle] = useState('');

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

    const [openEditId, setOpenEditId] = useState(null);
    const handleEditClick = (e, deckId) => {
        e.stopPropagation();
        setOpenEditId((prev) => (prev === deckId ? null: deckId));
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (openMenuId && !e.target.closest('.deck-item')) {
                if (openEditId && !e.target.closest('.deck-item')){
                    setOpenEditId(null);
                }
                setOpenMenuId(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [openMenuId, openEditId]);

    const handleUpdateTitle = async (deckId, newTitle) => {
        try {
            await updateTitle(deckId, newTitle);
            setDecks((prev) =>
                prev.map((d) => (d.id === deckId ? { ...d, title: newTitle } :d))
            );
            setNewTitle('');
            setOpenEditId(null);
        } catch (error) {
            console.error('Failed to update title: ', error);
            setError(error);
        }
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
                                <p className="menu-item" onClick={(e) => handleEditClick(e, deck.id)}>Edit Name</p>
                                {openEditId === deck.id && (
                                    <div className="edit-name-box">
                                        <input className="input-edit-title" type="text" placeholder={deck.title} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                                        <button className="edit-name-done" onClick={() => handleUpdateTitle(deck.id, newTitle)}><IoIosCheckmark size={15}/></button>
                                    </div>
                                )}
                                <p className="menu-item">Tag</p>
                                <p className="menu-item">Delete</p>
                            </div>
                        )}
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default DeckList;