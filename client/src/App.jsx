import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import WorkspacePage from './pages/WorkspacePage'
import TopicPage from './pages/TopicPage'
import NotePage from './pages/NotePage'
import ProtectedRoute from './routes/ProtectedRoute'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/workspace/:id" element={
          <ProtectedRoute><WorkspacePage /></ProtectedRoute>
        } />
        <Route path="/topic/:topicId" element={
          <ProtectedRoute><TopicPage /></ProtectedRoute>
        } />
        <Route path="/note/:noteId" element={
          <ProtectedRoute><NotePage /></ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App