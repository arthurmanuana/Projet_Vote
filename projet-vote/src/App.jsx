import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './guards/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import VotePage from './pages/VotePage'
import AdminPage from './pages/AdminPage'
import NoVotePage from './pages/NoVotePage'
import UnauthorizedPage from './pages/UnauthorizedPage'

// La carte routiere du projet. Chaque page protegee est enveloppee
// par le videur, avec son badge requis.
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/vote" element={<ProtectedRoute need="vote"><VotePage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute need="admin"><AdminPage /></ProtectedRoute>} />
          <Route path="/no-vote" element={<ProtectedRoute need="enter"><NoVotePage /></ProtectedRoute>} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}