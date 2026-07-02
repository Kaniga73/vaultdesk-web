import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faKey, faEye, faEyeSlash, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import logo from '../assets/logo.png'
import './Signup.css'



// ── Password Strength ─────────────────────────
const getPasswordStrength = (password) => {
  if (!password) return { level: 0, label: '', bars: [false, false, false] }
  if (password.length < 6) return { level: 1, label: 'Too short', bars: [true, false, false] }
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)
  const strong = hasUpper && hasNumber && hasSpecial && password.length >= 8
  const medium = (hasUpper || hasNumber || hasSpecial) && password.length >= 6
  if (strong) return { level: 3, label: 'Strong', bars: [true, true, true] }
  if (medium) return { level: 2, label: 'Medium', bars: [true, true, false] }
  return { level: 1, label: 'Weak', bars: [true, false, false] }
}

const strengthClass = (level) => {
  if (level === 1) return 'weak'
  if (level === 2) return 'medium'
  if (level === 3) return 'strong'
  return ''
}

// ── Component ─────────────────────────────────
const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const passwordStrength = getPasswordStrength(formData.password)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'At least 6 characters required'
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/signup', formData)
      login(data)
      navigate('/dashboard')
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo-section">
            <div className="auth-logo">
              <img src={logo} alt="VaultDesk Logo" />
            </div>
            <div className="auth-brand-name">VaultDesk</div>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Start organizing your knowledge today
          </p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="alert-error">
            <FontAwesomeIcon icon={faCircleExclamation} />
            {serverError}
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Name */}
          <div className="form-field">
            <label className="form-label">Full Name</label>
            <div className={`input-wrapper ${errors.name ? 'has-error' : ''}`}>
              <span className="input-icon"><FontAwesomeIcon icon={faUser} /></span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="form-input"
                autoComplete="name"
                autoFocus
              />
            </div>
            {errors.name && (
              <span className="field-error">{errors.name}</span>
            )}
          </div>

          {/* Email */}
          <div className="form-field">
            <label className="form-label">Email Address</label>
            <div className={`input-wrapper ${errors.email ? 'has-error' : ''}`}>
              <span className="input-icon"><FontAwesomeIcon icon={faEnvelope} /></span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="form-input"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-field">
            <label className="form-label">Password</label>
            <div className={`input-wrapper ${errors.password ? 'has-error' : ''}`}>
              <span className="input-icon"><FontAwesomeIcon icon={faKey} /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="input-icon-btn"
                onClick={() => setShowPassword(p => !p)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            {/* Password Strength */}
            {formData.password && (
              <>
                <div className="password-strength">
                  {passwordStrength.bars.map((active, i) => (
                    <div
                      key={i}
                      className={`strength-bar ${active
                        ? strengthClass(passwordStrength.level)
                        : ''}`}
                    />
                  ))}
                </div>
                <span className={`strength-label
                  ${strengthClass(passwordStrength.level)}`}>
                  {passwordStrength.label}
                </span>
              </>
            )}

            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: '4px' }}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Creating account...
              </>
            ) : (
              'Create Account →'
            )}
          </button>

        </form>

        

        {/* Footer */}
        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  )
}

export default Signup