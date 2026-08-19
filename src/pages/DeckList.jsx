import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { fetchDecks, updateTitle, deleteDeck, updateDeckTag } from '../lib/decks';
import LoadingSpinner from '../components/LoadingSpinner';
import Deck from '../components/Deck';
import { BsThreeDotsVertical } from "react-icons/bs";
import '../styles/DeckList.css';
import { createTag, fetchTags } from '../lib/tags';
import ProgressBar from '../components/ProgressBar';
import SearchBar from '../components/SearchBar';
import Popup from '../components/Popup';

const DeckList = () => {
    const [decks, setDecks] = useState([]);
    const [tags, setTags] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    const filteredDecks = decks.filter((deck) => {
        const query = searchQuery.toLowerCase();
        const result = deck.title.toLowerCase().includes(query) ||
            deck.cards.some((card) => 
                card.question.toLowerCase().includes(query) ||
                card.answer.toLowerCase().includes(query)
            );
        return result;
    });

    const sortedDecks = [...filteredDecks].sort((a, b) => {
        const aTime = a.createdAt?.toMillis() || 0;
        const bTime = b.createdAt?.toMillis() || 0;
        return sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
    });

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

    const [openPopupId, setOpenPopupId] = useState(null);
    const handleMenuClick = (e, deckId) => {
        e.stopPropagation();
        setOpenPopupId(deckId);
    };

    const handleUpdateTitle = async (deckId, newTitle) => {
        try {
            await updateTitle(deckId, newTitle);
            setDecks((prev) =>
                prev.map((d) => (d.id === deckId ? { ...d, title: newTitle } :d))
            );
        } catch (error) {
            console.error('Failed to update title: ', error);
            setError(error);
        }
    };

    const handleDeleteDeck = async (deckId) => {
        const confirmed = window.confirm("Are you sure you want to delete this deck? This action is permanent.");
        if (confirmed) {
            try {
                await deleteDeck(deckId);
                setDecks((prev) => prev.filter((d) => d.id !== deckId));
                setOpenPopupId(null);
            } catch (error) {
                console.error('Failed to delete deck: ', error);
                setError(error);
            }
        } else {
            console.log("Action Cancelled");
            return;
        }
    };

    const handleSelectTag = async (deckId, tagId) => {
        try {
            await updateDeckTag(deckId, tagId);
            setDecks((prev) => 
                prev.map((d) => (d.id === deckId ? {...d, tagId: tagId } :d))
            );
            setOpenPopupId(null);
        } catch (error) {
            console.error('Failed to update tag: ', error);
            setError(error);
        }
    }

    const handleCreateTag = async (deckId, tagName, tagColor) => {
        try {
            const tagId = await createTag(user.uid, tagName, tagColor);
            setTags([...tags, { id: tagId, name: tagName, color: tagColor, userId: user.uid }]);
            handleSelectTag(deckId, tagId);
        } catch (error) {
            console.error('Failed to create tag: ', error);
            setError(error);
        }
    };

    return (
        <div className="deck-list-container">
            <div className='deck-list-header'>
                <h1 className="deck-list-title">Deck List</h1>
                <button onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')} className='deck-list-filter'>
                    {sortOrder === 'newest' ? 'Newest to Oldest' : 'Oldest to Newest'}
                </button>
            </div>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            {loading && <LoadingSpinner />}
            <ul className="deck-list">
                {sortedDecks.map((deck) => {
                    const tag = tags.find((t) => t.id === deck.tagId);
                    return (
                        <div className="deck-item" key={deck.id}>
                            <Deck deck={deck} onClick={() => navigate('/review/' + deck.id)} tagColor={tag ? tag.color : undefined} searchQuery={searchQuery} />
                            <ProgressBar percent={deck.percent || 0} color={tag ? tag.color : undefined}/>
                            <button
                                className="deck-menu-button"
                                onClick={(e) => handleMenuClick(e, deck.id)}
                            >
                                <BsThreeDotsVertical size={20} />
                            </button>
                            {openPopupId === deck.id && (
                                <Popup 
                                    page='deck-list'
                                    deck={deck}
                                    tags={tags}
                                    onClose={() => setOpenPopupId(null)}
                                    onUpdateTitle={handleUpdateTitle}
                                    onDeleteDeck={handleDeleteDeck}
                                    onSelectTag={handleSelectTag}
                                    onCreateTag={handleCreateTag}
                                />
                            )}
                        </div>
                    );
                })}
            </ul>
            {searchQuery && sortedDecks.length === 0 && (
                <p className="no-results">No Decks or cards match "{searchQuery}".</p>
            )}
        </div>
    );
};

export default DeckList;