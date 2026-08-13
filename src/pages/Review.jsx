import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDeck } from '../lib/decks';
import LoadingSpinner from '../components/LoadingSpinner';
import Flashcard from '../components/Flashcard';
import '../styles/Review.css';

const Review = () => {
    const { deckId } = useParams();
    const navigate = useNavigate();

    const [deck, setDeck] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cardIndex, setCardIndex] = useState(0);
    const [isAnswer, setIsAnswer] = useState(false);
    const [error, setError] = useState(null);
    const [isDeckDone, setIsDeckDone] = useState(false);

    useEffect(() => {
        if (!deckId) {
            setLoading(false);
            return;
        }
        fetchDeck(deckId).then((result) => {
            setDeck(result);
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

    return (
        <div className="review-container">
            <h1>Review</h1>
            {!deckId &&
                <p>go to Decks and pick a deck to review.</p>
            }
            {deck && isDeckDone && (
                <p>Review complete!</p>
            )}
            {error && (
                <p>Error: {error.message}</p>
            )}
            {loading && (
                <LoadingSpinner />
            )}
            {deck && !isDeckDone && (
                <div className="review-content">
                    <p>Reviewing card {cardIndex + 1} of {deck.cards.length}</p>
                    <Flashcard 
                        question={deck.cards[cardIndex].question} 
                        answer={deck.cards[cardIndex].answer} 
                        isAnswer={isAnswer}
                        onFlip={handleFlip}
                    />
                    <button onClick={handleFlip}>Flip</button>
                    <button onClick={handleNext}>Next</button>
                </div>
            )}
        </div>
    );
};

export default Review;