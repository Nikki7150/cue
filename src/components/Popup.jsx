import '../styles/Popup.css';
import { IoIosCheckmark } from "react-icons/io";
import { useState } from 'react';

const Popup = ({ page, deck, tags, onClose, onUpdateTitle, onDeleteDeck, onSelectTag, onCreateTag, }) => {
    const [newTitle, setNewTitle] = useState('');
    const [isCreatingTag, setIsCreatingTag] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('#7C9F81')

    return (
        <div className='popup-container' onClick={onClose}>
            <div className='popup' onClick={(e) => e.stopPropagation()}>
                {page === 'deck-list' && (
                    <div className='deck-list-popup'>
                        <h1>Edit Deck</h1>
                        <div className='edit-name-div'>
                            <h3>Edit Name: </h3>
                            <div className="edit-name-box">
                                <input className="input-edit-title" type="text" placeholder={deck.title} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                                <button className="edit-name-done" onClick={() => onUpdateTitle(deck.id, newTitle)}><IoIosCheckmark size={24}/></button>
                            </div>
                        </div>
                        <div className='tags-div'>
                            <button className="add-tag" onClick={() => setIsCreatingTag(!isCreatingTag)}>+ Add tag</button>
                            {isCreatingTag && (
                                <div className='new-tag-form'>
                                    <div className='tag-inputs'>
                                        <input type="color" className="color-input" value={newTagColor} onChange={(e) => setNewTagColor(e.target.value)} />
                                        <input type="text" className="name-input" placeholder="Tag Name" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} />
                                    </div>
                                    <button className="tag-create-submit" onClick={() => onCreateTag(deck.id, newTagName, newTagColor)}>Confirm</button>
                                </div>
                            )}
                            <ul className="tags">
                                {tags.map((tag) => (
                                    <div className="tag-item" key={tag.id} onClick={() => onSelectTag(deck.id, tag.id)}>
                                        <div style={{ backgroundColor: tag.color }} className="tag-swatch" />
                                        <p className="tag-name">{tag.name}</p>
                                    </div>
                                ))}
                            </ul>
                        </div>
                        <p className="delete-button" onClick={() => onDeleteDeck(deck.id)}>Delete</p>
                    </div>
                )}
                {page === 'review' && (
                    <div className="review-popup">
                        <h1>Edit Flashcard</h1>
                        <div className='edit-question-div'>
                            <p>Edit question</p>
                        </div>
                        <div className='edit-answer-div'>
                            <p>Edit answer</p>
                        </div>
                        <p className='save-button'>Save changes</p>
                    </div>
                )}
            </div>
        </div>
    )
};

export default Popup;