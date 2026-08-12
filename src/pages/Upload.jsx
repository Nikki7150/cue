import { useEffect, useState } from 'react';
import { generateCards } from '../lib/generateCards';
import { useNavigate } from 'react-router-dom';
import { saveDeck } from '../lib/decks';
import { useAuth } from '../AuthContext';

const Upload = () => {
    const [text, setText] = useState('');
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await generateCards(text);
            if (result.error === 'insufficient_content') {
                setError('The content you provided is not sufficient to generate flashcards.');
            } else if (result.error === 'generation_failed') {
                setError('An error occurred while generating the flashcards.');
            } else if (result.cards) {
                const deckId = await saveDeck(user.uid, result.title, result.cards);
                navigate('/review/' + deckId, { state: { cards: result.cards, title: result.title } });
            }
        } catch (error) {
            console.error('Error generating cards:', error);
            setError('An error occurred while generating the flashcards.');
        }
        finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                setText(text);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div>
            <h1>Upload</h1>
            <h2>Create a deck</h2>
            <textarea placeholder="Enter your text here..." value={text} onChange={(e) => setText(e.target.value)} />
            <input type="file" accept=".txt" onChange={handleFileChange} />
            <button onClick={handleGenerate} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Flashcards'}
            </button>
            {loading && <p>Generating flashcards...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Upload;