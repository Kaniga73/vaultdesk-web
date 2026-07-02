import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './routes/ProtectedRoute'


const Dashboard = () => (
  <div className="min-h-screen flex items-center justify-center"
    style={{ backgroundColor: '#0f1117' }}>
    <h1 className="text-2xl font-bold text-white">
      Dashboard — Coming Day 4 🚀
    </h1>
  </div>
)

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

       
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App