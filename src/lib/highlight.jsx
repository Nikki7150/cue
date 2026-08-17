// src/lib/highlight.js
export const highlightMatch = (text, query) => {
    if (!query) return text;

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
            ? <mark key={i} className="search-highlight">{part}</mark>
            : <span key={i}>{part}</span>
    );
};