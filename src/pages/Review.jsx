import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDeck } from '../lib/decks';
import LoadingSpinner from '../components/LoadingSpinner';
import Flashcard from '../components/Flashcard';
import '../styles/Review.css';
import { MdArrowBack, MdNavigateNext } from "react-icons/md";
import { IoMdRefresh } from "react-icons/io";

const Review = () => {
    const { deckId } = useParams();
    const navigate = useNavigate();

    const [deck, setDeck] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cardIndex, setCardIndex] = useState(0);
    const [isAnswer, setIsAnswer] = useState(false);
    const [error, setError] = useState(null);
    const [isDeckDone, setIsDeckDone] = useState(false);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        if (!deckId) {
            setLoading(false);
            return;
        }
        fetchDeck(deckId).then((result) => {
            setDeck(result);
            setCards(result.cards);
            setLoading(false);
        }).catch((error) => {
            setError(error);
            setLoading(false);
        });
    }, [deckId]);

    const handleNext = () => {
        setIsAnswer(false);
        if (cardIndex < (deck?.cards.length || 0) - 1) {
            setCardIndex(cardIndex + 1);
        } else {
            setIsDeckDone(true);
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

    return (
        <div className="review-container">
            <div className="review-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <MdArrowBack />
                </button>
                <h1 className="review-title">Review</h1>
            </div>
            {!deckId &&
                <p className="review-page">go to Decks and pick a deck to review.</p>
            }
            {deck && isDeckDone && (
                <p className="review-page">Review complete!</p>
            )}
            {error && (
                <p className="review-page">Error: {error.message}</p>
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
                            <IoMdRefresh />
                        </button>
                        <button onClick={handleNext}>
                            <MdNavigateNext />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Review;