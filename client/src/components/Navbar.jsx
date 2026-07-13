import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SearchBar from './SearchBar'
import './Navbar.css'
import { useTheme } from '../context/ThemeContext'
import logo from "../assets/logo.png";

// Inside Navbar component:


const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)


const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme()

  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showSearch, setShowSearch] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
    <nav className="navbar">
      {/* Brand */}
      <Link to="/dashboard" className="navbar-brand">
        <div className="navbar-logo">
          <img src={logo} alt="VaultDesk logo" />
        </div>
        <span className="navbar-brand-name">
          Vault<span>Desk</span>
        </span>
      </Link>

      <div className="navbar-right">
          {/* Search Button */}
          <button
            className="navbar-search-btn"
            onClick={() => setShowSearch(true)}
            title="Search notes (Ctrl+K)"
          >
            <SearchIcon />
            <span>Search notes...</span>
            <span className="search-shortcut">Ctrl K</span>
          </button>

          <button
  className="navbar-theme-btn"
  onClick={toggleTheme}
  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
  {isDark ? '☀️' : '🌙'}
</button>
           <div className="navbar-user">
            <div className="navbar-avatar">
              {getInitials(user?.name)}
            </div>
            <span className="navbar-username">{user?.name}</span>
          </div>

          <button className="navbar-logout" onClick={handleLogout}>
            <LogoutIcon />
            Logout
          </button>
        </div>
      </nav>
 
      {showSearch && (
        <SearchBar onClose={() => setShowSearch(false)} />
      )}
  </>
  )
}

export default Navbar