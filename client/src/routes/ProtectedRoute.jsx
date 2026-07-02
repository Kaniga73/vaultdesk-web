import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  // Still checking localStorage - don't redirect yet
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0f1117' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }}>
        </div>
      </div>
    )
  }

 
  if (!user) {
    return <Navigate to="/login" replace />
  }

 
  return children
}

export default ProtectedRoute