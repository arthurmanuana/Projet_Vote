import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { homeRoute } from '../utils/routing'
import LoadingScreen from '../components/LoadingScreen'

// Le videur a l'entree des pages protegees.
// need="vote"  -> reserve aux votants
// need="admin" -> reserve aux admins
// need="enter" -> toute personne qui a le droit d'entrer
export default function ProtectedRoute({ need, children }) {
  const { user, profile, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user || !profile) return <Navigate to="/" replace />

  const allowed =
    need === 'admin' ? profile.canAdmin :
    need === 'vote' ? profile.canVote :
    true // "enter" : avoir un profil signifie deja que la porte est ouverte

  // Si tu n'as pas le bon badge, on te ramene gentiment chez toi.
  if (!allowed) return <Navigate to={homeRoute(profile)} replace />

  return children
}