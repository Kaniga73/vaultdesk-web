import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-page)',
      padding: '24px',
      textAlign: 'center',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        fontSize: '72px',
        marginBottom: '16px',
      }}>
        🔒
      </div>
      <h1 style={{
        fontSize: '48px',
        fontWeight: '700',
        color: 'var(--text-primary)',
        letterSpacing: '-0.03em',
        marginBottom: '8px',
      }}>
        404
      </h1>
      <p style={{
        fontSize: '18px',
        color: 'var(--text-secondary)',
        marginBottom: '8px',
      }}>
        Page not found
      </p>
      <p style={{
        fontSize: '14px',
        color: 'var(--text-muted)',
        marginBottom: '32px',
        maxWidth: '300px',
        lineHeight: '1.6',
      }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          padding: '12px 24px',
          borderRadius: '10px',
          border: 'none',
          background: 'linear-gradient(135deg, #0ABFBC, #0EA8A5)',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(10, 191, 188, 0.35)',
        }}
      >
        Back to Dashboard
      </button>
    </div>
  )
}

export default NotFound