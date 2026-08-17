import { IoSearchOutline } from "react-icons/io5";
import '../styles/SearchBar.css';

const SearchBar = ({ value, onChange}) => {
    return (
        <div className="search-bar">
            <IoSearchOutline size={20} />
            <input 
                type="text"
                placeholder="Search decks and cards..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;