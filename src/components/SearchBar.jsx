import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";
import '../styles/SearchBar.css';

const SearchBar = ({ value, onChange}) => {
    const handleClear = () => {

    }
    return (
        <div className="search-bar-container">
            <div className="search-bar">
                <IoSearchOutline size={20} />
                <input 
                    type="text"
                    placeholder="Search decks and cards..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="search-input"
                />
                {value && (
                    <button type="button" className="clear-button" onClick={() => onChange('')}><IoCloseOutline /></button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;