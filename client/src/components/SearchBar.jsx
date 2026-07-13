import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchNotes } from '../services/noteService'
import './SearchBar.css'

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const searchTimer = useRef(null)
  const navigate = useNavigate()

  // Focus input on open
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Debounced search
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current)

    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    searchTimer.current = setTimeout(async () => {
      try {
        const data = await searchNotes(query)
        setResults(data)
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(searchTimer.current)
  }, [query])

  const handleResultClick = (note) => {
    navigate(`/note/${note._id}`)
    onClose()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  }

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>

        {/* Search Input */}
        <div className="search-input-row">
          <span className="search-icon"><SearchIcon /></span>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search notes, titles, tags..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className="search-kbd">ESC</span>
        </div>

        {/* Results */}
        <div className="search-results">
          {loading && (
            <div className="search-empty">Searching...</div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="search-empty">
              No results found for "{query}"
            </div>
          )}

          {!loading && !query && (
            <div className="search-empty">
              Start typing to search your notes...
            </div>
          )}

          {!loading && results.map(note => (
            <div
              key={note._id}
              className="search-result-item"
              onClick={() => handleResultClick(note)}
            >
              <div className="search-result-icon">📝</div>
              <div className="search-result-body">
                <div className="search-result-title">{note.title}</div>
                <div className="search-result-meta">
                  {formatDate(note.updatedAt)}
                </div>
                {note.tags && note.tags.length > 0 && (
                  <div className="search-result-tags">
                    {note.tags.map(tag => (
                      <span key={tag} className="note-tag">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer hints */}
        <div className="search-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>ESC</kbd> close</span>
        </div>

      </div>
    </div>
  )
}

export default SearchBar