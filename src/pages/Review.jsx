import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDeck, updateDeckProgress, updateDeckCards } from '../lib/decks';
import LoadingSpinner from '../components/LoadingSpinner';
import Flashcard from '../components/Flashcard';
import '../styles/Review.css';
import { MdArrowBack, MdNavigateNext, MdClear } from "react-icons/md";
import { IoMdRefresh } from "react-icons/io";
import { PiShuffle } from "react-icons/pi";
import ProgressBar from '../components/ProgressBar';
import { useAuth } from '../AuthContext';
import { fetchTags } from '../lib/tags';
import Popup from '../components/Popup';
import { FaRegEdit } from "react-icons/fa";

const Review = () => {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [deck, setDeck] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cardIndex, setCardIndex] = useState(0);
    const [isAnswer, setIsAnswer] = useState(false);
    const [error, setError] = useState(null);
    const [isDeckDone, setIsDeckDone] = useState(false);
    const [cards, setCards] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        if (!deckId) {
            setLoading(false);
            return;
        }
        Promise.all([fetchDeck(deckId), fetchTags(user.uid)])
        .then(([deckResult, tagsResult]) => {
            setDeck(deckResult);
            setCards(deckResult.cards);
            setTags(tagsResult);
            setLoading(false);
        }).catch((error) => {
            setError(error);
            setLoading(false);
        });
    }, [user.uid, deckId]);

    const handleNext = () => {
        setIsAnswer(false);
        if (cardIndex < (deck?.cards.length || 0) - 1) {
            setCardIndex(cardIndex + 1);
        } else {
            setIsDeckDone(true);
            saveProgress();
        }
    };

    const handleFlip = () => {
        setIsAnswer(!isAnswer);
    };

    const handleDontKnow = () => {
        const newCards = [...cards];
        const removedCard = newCards.splice(cardIndex, 1)[0];
        newCards.push(removedCard);
        setCards(newCards);
        setIsAnswer(false);
    };

    const handleShuffle = () => {
        const newCards = [...cards];
        for (let i = newCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
        }
        setCards(newCards);
    };

    const saveProgress = async () => {
        const percent = Math.round(((cardIndex + 1) / cards.length) * 100);
        try {
            await updateDeckProgress(deckId, percent);
        } catch (error) {
            console.error('Failed to save progress: ', error);
        }
    } 

    const tag = tags.find((t) => t.id === deck?.tagId);
    const [isEditingCard, setIsEditingCard] = useState(false);

    const handleUpdateCard = async (newQuestion, newAnswer) => {
        if (!newQuestion.trim() || !newAnswer.trim()) {
            setError('Question and answer cannot be empty.');
            return;
        }
        try {
            const newCards = cards.map((card, i) => 
                i === cardIndex ? { question: newQuestion, answer: newAnswer} : card
            );
            await updateDeckCards(deckId, newCards);
            setCards(newCards);
            setIsEditingCard(false);
        } catch (error) {
            console.error('Failed to update card: ', error);
            setError(error);
        }
    };

    return (
        <div className="review-container">
            <div className="review-header">
                <div className="header-content">
                    <button onClick={() => navigate(-1)} className="back-button">
                        <MdArrowBack />
                    </button>
                    <h1 className="review-title">Review</h1>
                </div>
                <p className="deck-title">{deck?.title}</p>
                <div className="review-header-buttons">
                    <button className="shuffle-button" onClick={handleShuffle} style={{display: deck ? 'block' : 'none',}}>
                        <PiShuffle size={26} />
                    </button>
                    <button className="close-button" onClick={async () => {await saveProgress(); navigate('/decks');}} style={{display: deck ? 'block' : 'none',}}>
                        <MdClear size={26} />
                    </button>
                </div>
            </div>
            {!deckId &&
                <p className="review-text">go to Decks and pick a deck to review.</p>
            }
            {deck && isDeckDone && (
                <p className="review-text">Review complete!</p>
            )}
            {error && (
                <p className="review-text">Error: {error.message}</p>
            )}
            {loading && (
                <LoadingSpinner />
            )}
            {deck && !isDeckDone && (
                <div className="review-content">
                    <p className="review-page">Reviewing card {cardIndex + 1} of {deck.cards.length}</p>
                    <Flashcard 
                        question={cards[cardIndex].question} 
                        answer={cards[cardIndex].answer} 
                        isAnswer={isAnswer}
                        onFlip={handleFlip}
                    />
                    <div className="review-buttons">
                        <button className="again-button" onClick={handleDontKnow}>
                            <IoMdRefresh size={26} />
                        </button>
                        <button className='edit-button' onClick={() => setIsEditingCard(true)}>
                            <FaRegEdit size={26} />
                        </button>
                        <button className="next-button" onClick={handleNext}>
                            <MdNavigateNext size={26} />
                        </button>
                    </div>
                    <ProgressBar percent={Math.round(((cardIndex + 1) / cards.length) * 100)} color={tag ? tag.color : undefined}/>
                </div>
            )}
            {isEditingCard && (
                <Popup 
                    page="review"
                    currentCard={cards[cardIndex]}
                    onClose={() => setIsEditingCard(false)}
                    onUpdateCard={handleUpdateCard}
                />
            )}
        </div>
    );
};

export default Review;