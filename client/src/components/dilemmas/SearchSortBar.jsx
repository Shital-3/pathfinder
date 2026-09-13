import "./SearchSortBar.css";

const SORT_OPTIONS = ["Recommended", "Most experiences", "Most recent", "Most viewed"];

export default function SearchSortBar({ query, onQueryChange, sort, onSortChange }) {
  return (
    <div className="search-sort">
      <div className="search-sort__input">
        <span className="search-sort__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search dilemmas, tags, topics..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Search dilemmas"
        />
      </div>

      <div className="search-sort__sort">
        
        <select value={sort} onChange={(e) => onSortChange(e.target.value)} aria-label="Sort dilemmas">
          {SORT_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    </div>
  );
}