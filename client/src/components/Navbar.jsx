import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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
  const { user, logout } = useAuth()
  const navigate = useNavigate()

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
    <nav className="navbar">
      {/* Brand */}
      <Link to="/dashboard" className="navbar-brand">
        <div className="navbar-logo">
          <LockIcon />
        </div>
        <span className="navbar-brand-name">
          Vault<span>Desk</span>
        </span>
      </Link>

      {/* Right side */}
      <div className="navbar-right">
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
  )
}

export default Navbar