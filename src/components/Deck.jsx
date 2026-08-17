import '../styles/Deck.css';
import { highlightMatch } from '../lib/highlight.jsx';

const Deck = ({ deck, onClick, tagColor, searchQuery }) => {
    return (
        <div className="deck" onClick={onClick}>
            <div className="deck-box">
                <div className="deck-cards"></div>
            </div>
            <div className="deck-lid">
                <h3 className="deck-name" style={{backgroundColor: tagColor,}}>
                    {highlightMatch(deck.title, searchQuery)}
                </h3>
            </div>
        </div>
    );
};

export default Deck;