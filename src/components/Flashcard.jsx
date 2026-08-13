import '../styles/Flashcard.css';
import { CgEditFlipH } from "react-icons/cg";

const Flashcard = ({ question, answer, isAnswer, onFlip }) => {
    return (
        <div className="flashcard-container" onClick={onFlip}>
            <div className={`flashcard-inner ${isAnswer ? "flipped" : ""}`}>
                <div className="flashcard-front">
                    {question}
                    <button onClick={onFlip} className="flashcard-button">
                        <CgEditFlipH />
                    </button>
                </div>
                <div className="flashcard-back">
                    {answer}
                    <button onClick={onFlip} className="flashcard-button">
                        <CgEditFlipH />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Flashcard;