import '../styles/Flashcard.css';

const Flashcard = ({ question, answer, isAnswer, onFlip }) => {
    return (
        <div className="flashcard-container" onClick={onFlip}>
            <div className={`flashcard-inner ${isAnswer ? "flipped" : ""}`}>
                <div className="flashcard-front">
                    {question}
                </div>
                <div className="flashcard-back">
                    {answer}
                </div>
            </div>
        </div>
    );
};

export default Flashcard;