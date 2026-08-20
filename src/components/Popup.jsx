import '../styles/Popup.css';
import { IoIosCheckmark } from "react-icons/io";
import { useState } from 'react';
import { IoTrashOutline } from "react-icons/io5";

const Popup = ({ page, deck, tags, currentCard, onClose, onUpdateTitle, onDeleteDeck, onSelectTag, onCreateTag, onUpdateCard, onDeleteTag }) => {
    const [newTitle, setNewTitle] = useState('');
    const [isCreatingTag, setIsCreatingTag] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('#729aad')

    const [editQuestion, setEditQuestion] = useState(currentCard?.question || '');
    const [editAnswer, setEditAnswer] = useState(currentCard?.answer || '');

    return (
        <div className='popup-container' onClick={onClose}>
            <div className='popup' onClick={(e) => e.stopPropagation()}>
                {page === 'deck-list' && (
                    <div className='deck-list-popup'>
                        <h1 className='decklist-popup-heading'>Edit Deck</h1>
                        <div className='edit-name-div'>
                            <h3 className='edit-name-title'>Edit Name: </h3>
                            <div className="edit-name-box">
                                <input className="input-edit-title" type="text" placeholder={deck.title} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                                <button className="edit-name-done" onClick={() => onUpdateTitle(deck.id, newTitle)}><IoIosCheckmark size={40}/></button>
                            </div>
                        </div>
                        <div className='tags-div'>
                            <h3 className='tag-title'>Tags: </h3>
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
                                        <button className='delete-tag' onClick={(e) => {e.stopPropagation(); onDeleteTag(tag.id);}}><IoTrashOutline size={20}/></button>
                                    </div>
                                ))}
                                {tags.length === 0 && (
                                    <p className="no-tags">No tags created yet.</p>
                                )}
                            </ul>
                        </div>
                        <h3 className="delete-button" onClick={() => onDeleteDeck(deck.id)}>Delete</h3>
                    </div>
                )}
                {page === 'review' && (
                    <div className="review-popup">
                        <h1 className='review-popup-heading'>Edit Flashcard</h1>
                        <div className='edit-question-div'>
                            <h3 className='edit-question-title'>Edit question</h3>
                            <textarea 
                                value={editQuestion}
                                onChange={(e) => setEditQuestion(e.target.value)}
                                className='question-input'
                            />
                        </div>
                        <div className='edit-answer-div'>
                            <h3 className='edit-answer-title'>Edit answer</h3>
                            <textarea 
                                value={editAnswer}
                                onChange={(e) => setEditAnswer(e.target.value)}
                                className='answer-input'
                            />
                        </div>
                        <p className='save-button' onClick={() => onUpdateCard(editQuestion, editAnswer)}>Save changes</p>
                    </div>
                )}
            </div>
        </div>
    )
};

export default Popup;