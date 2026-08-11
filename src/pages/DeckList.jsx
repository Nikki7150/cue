import { useEffect, useState } from 'react';

const DeckList = () => {
    const [decks, setDecks] = useState([]);

    useEffect(() => {
        // Fetch decks from your API or database
    }, []);

    return (
        <div>
        <h1>Deck List</h1>
        <ul>
            {decks.map((deck) => (
            <li key={deck.id}>{deck.name}</li>
            ))}
        </ul>
        </div>
    );
};

export default DeckList;