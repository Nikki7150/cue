import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { fetchDecks, updateTitle, deleteDeck, updateDeckTag } from '../lib/decks';
import LoadingSpinner from '../components/LoadingSpinner';
import Deck from '../components/Deck';
import { BsThreeDotsVertical } from "react-icons/bs";
import '../styles/DeckList.css';
import { IoIosCheckmark } from "react-icons/io";
import { createTag, fetchTags } from '../lib/tags';
import ProgressBar from '../components/ProgressBar';
import SearchBar from '../components/SearchBar';

const DeckList = () => {
    const [decks, setDecks] = useState([]);
    const [tags, setTags] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [isCreatingTag, setIsCreatingTag] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('#7C9F81')
    const [searchQuery, setSearchQuery] = useState('');

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

    const [openTagId, setOpenTagId] = useState(null);
    const handleTagClick = async (e, deckId) => {
        e.stopPropagation();
        setOpenTagId((prev) => (prev === deckId ? null: deckId));
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (openMenuId && !e.target.closest('.deck-item')) {
                if (openEditId && !e.target.closest('.deck-item')){
                    setOpenEditId(null);
                }
                if (openTagId && !e.target.closest('.deck-item')){
                    setOpenTagId(null);
                }
                setOpenMenuId(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [openMenuId, openEditId, openTagId]);

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

    const handleDeleteDeck = async (deckId) => {
        const confirmed = window.confirm("Are you sure you want to delete this deck? This action is permanent.");
        if (confirmed) {
            try {
                await deleteDeck(deckId);
                setDecks((prev) => prev.filter((d) => d.id !== deckId));
                setOpenMenuId(null);
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
            setOpenTagId(null);
            setOpenMenuId(null);
        } catch (error) {
            console.error('Failed to update tag: ', error);
            setError(error);
        }
    }

    const handleCreateTag = async (deckId) => {
        try {
            const tagId = await createTag(user.uid, newTagName, newTagColor);
            setTags([...tags, { id: tagId, name: newTagName, color: newTagColor, userId: user.uid }]);
            handleSelectTag(deckId, tagId);
            setIsCreatingTag(false);
            setNewTagColor('#7C9F8182');
            setNewTagName('');
        } catch (error) {
            console.error('Failed to create tag: ', error);
            setError(error);
        }
    };

    const filteredDecks = decks.filter((deck) => {
        const query = searchQuery.toLowerCase();
        const result = deck.title.toLowerCase().includes(query) ||
            deck.cards.some((card) => 
                card.question.toLowerCase().includes(query) ||
                card.answer.toLowerCase().includes(query)
            );
        return result;
    });

    return (
        <div className="deck-list-container">
            <h1 className="deck-list-title">Deck List</h1>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            {loading && <LoadingSpinner />}
            <ul className="deck-list">
                {filteredDecks.map((deck) => {
                    const tag = tags.find((t) => t.id === deck.tagId);
                    return (
                        <div className="deck-item" key={deck.id}>
                            <Deck deck={deck} onClick={() => navigate('/review/' + deck.id)} tagColor={tag ? tag.color : undefined} />
                            <ProgressBar percent={deck.percent || 0} color={tag ? tag.color : undefined}/>
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
                                            <button className="edit-name-done" onClick={() => handleUpdateTitle(deck.id, newTitle)}><IoIosCheckmark size={24}/></button>
                                        </div>
                                    )}
                                    <p className="menu-item" onClick={(e) => handleTagClick(e, deck.id)}>Tag</p>
                                    {openTagId === deck.id && (
                                        <div className="tag-box">
                                            <button className="add-tag" onClick={() => setIsCreatingTag(!isCreatingTag)}>+ Add tag</button>
                                            {isCreatingTag && (
                                                <div className="new-tag-form">
                                                    <div className="tag-inputs">
                                                        <input type="color" className="color-input" value={newTagColor} onChange={(e) => setNewTagColor(e.target.value)} />
                                                        <input type="text" className="name-input" placeholder="Tag Name" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} />
                                                    </div>
                                                    <button className="tag-create-submit" onClick={() => handleCreateTag(deck.id)}>Confirm</button>
                                                </div>
                                            )}
                                            <ul className="tags">
                                                {tags.map((tag) => (
                                                    <div className="tag-item" key={tag.id} onClick={() => handleSelectTag(deck.id, tag.id)}>
                                                        <div style={{ backgroundColor: tag.color }} className="tag-swatch" />
                                                        <p className="tag-name">{tag.name}</p>
                                                    </div>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <p className="menu-item" onClick={() => handleDeleteDeck(deck.id)}>Delete</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </ul>
            {searchQuery && filteredDecks.length === 0 && (
                <p className="no-results">No Decks or cards match "{searchQuery}".</p>
            )}
        </div>
    );
};

export default DeckList;