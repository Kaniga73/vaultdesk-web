import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import './Signup.css'

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters')
    }

    setLoading(true)
    try {
      const { data } = await api.post('/auth/signup', formData)
      login(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-card">

        {/* Logo */}
        <div className="signup-logo-wrapper">
          <div className="signup-logo-icon">V</div>
          <h1 className="signup-title">Create your account</h1>
          <p className="signup-subtitle">
            Start organizing your knowledge today
          </p>
        </div>

        {/* Error */}
        {error && <div className="signup-error">{error}</div>}

        {/* Form */}
        <form className="signup-form" onSubmit={handleSubmit}>

          <div className="form-field">
            <label className="form-label">Full name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="form-input"
            />
            <span className="form-hint">Minimum 6 characters</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

        </form>

        {/* Footer */}
        <p className="signup-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  )
}

export default Signup