import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f1117',
    padding: '16px',
    fontFamily: 'Inter, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#1a1d27',
    border: '1px solid #2a2d3e',
    borderRadius: '16px',
    padding: '32px',
  },
  logoWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '32px',
  },
  logoIcon: {
    width: '48px',
    height: '48px',
    backgroundColor: '#6366f1',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: 0,
  },
  errorBox: {
    backgroundColor: '#2d1b1b',
    border: '1px solid #7f1d1d',
    color: '#f87171',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  fieldWrapper: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#94a3b8',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #2a2d3e',
    backgroundColor: '#0f1117',
    color: '#e2e8f0',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },
  button: {
    width: '100%',
    padding: '11px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#6366f1',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'background-color 0.2s ease',
  },
  footer: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#94a3b8',
    marginTop: '24px',
  },
  link: {
    color: '#6366f1',
    fontWeight: '500',
    textDecoration: 'none',
  },
}

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
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
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', formData)
      login(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoWrapper}>
          <div style={styles.logoIcon}>V</div>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in to your VaultDesk account</p>
        </div>

        {/* Error */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Email address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={styles.input}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#2a2d3e'}
            />
          </div>

          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={styles.input}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#2a2d3e'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              backgroundColor: loading ? '#4338ca' : '#6366f1',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => { if (!loading) e.target.style.backgroundColor = '#4f46e5' }}
            onMouseLeave={e => { if (!loading) e.target.style.backgroundColor = '#6366f1' }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Footer */}
        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link
            to="/signup"
            style={styles.link}
            onMouseEnter={e => e.target.style.color = '#818cf8'}
            onMouseLeave={e => e.target.style.color = '#6366f1'}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login