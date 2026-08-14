import '../styles/Deck.css';

const Deck = ({ deck, onClick }) => {
    return (
        <div className="deck" onClick={onClick}>
            <div className="deck-box">
                <div className="deck-cards"></div>
            </div>
            <div className="deck-lid">
                <h3 className="deck-name">{deck.title}</h3>
            </div>
        </div>
    );
};

export default Deck;