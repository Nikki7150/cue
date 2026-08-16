import { useEffect, useState, useRef } from 'react';
import { generateCards } from '../lib/generateCards';
import { useNavigate } from 'react-router-dom';
import { saveDeck } from '../lib/decks';
import { useAuth } from '../AuthContext';
import { extractPdfText } from '../lib/extractPdfText';
import '../styles/Upload.css';
import { MdClear } from "react-icons/md";

const Upload = () => {
    const [text, setText] = useState('');
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const fileInputRef = useRef(null);

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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.name.endsWith('.pdf')) {
                try {
                    const fileText = await extractPdfText(file);
                    setText(fileText);
                } catch (error) {
                    console.error('Pdf to Text convert failed: ', error);
                    setError('Failed to extract text from the PDF.');
                }
            } else {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const text = e.target.result;
                    setText(text);
                };
                reader.readAsText(file);
            }
        }
    };

    const handleClearFiles = () => {
        setText('');
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="upload-container">
            <div className="upload-header">
                <h1 className="upload-title">Upload</h1>
                <button className="clear-files" onClick={handleClearFiles} style={{display: text ? 'block' : 'none',}}><MdClear size={24} /></button>
            </div>
            <div className="upload-options">
                <textarea className="upload-text" placeholder="Enter your text here or..." value={text} onChange={(e) => setText(e.target.value)} />
                <div className="upload-box" onClick={() => document.querySelector('.upload-input').click()}>
                    <label htmlFor="image-file">+</label>
                    <h3>Click to upload a .txt or .pdf file</h3>
                </div>
                <input ref={fileInputRef} className="upload-input" type="file" accept=".txt, .pdf" onChange={handleFileChange} />
            </div>
            <button className="upload-button" onClick={handleGenerate} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Flashcards'}
            </button>
            {loading && <p className="loading">Generating flashcards...</p>}
            {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Upload;