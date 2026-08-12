import { Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { homeRoute } from '../utils/routing'
import GoogleIcon from '../components/GoogleIcon'
import LoadingScreen from '../components/LoadingScreen'
import { APP_NAME } from '../config'

// Page d'entree provisoire (fil de fer).
// Le design definitif viendra quand tu me donneras tes styles.
export default function LoginPage() {
  const { user, profile, loading, login } = useAuth()

  if (loading) return <LoadingScreen />
  // Deja connecte ? On ne reste pas sur le paillasson.
  if (user && profile) return <Navigate to={homeRoute(profile)} replace />

  const handleLogin = async () => {
    try {
      await login()
      // La suite, c'est le contexte qui la gere : il calcule les
      // droits, et l'aiguilleur envoie la personne au bon endroit.
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Fenetre Google fermee avant la fin de la connexion.')
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup bloque par le navigateur. Autorise-les puis reessaie.')
      } else {
        toast.error('Connexion impossible pour le moment. Reessaie.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
        <img src="/logo-ulc.png" alt="Logo ULC ICAM" className="h-20 mx-auto mb-6 object-contain" />
        <h1 className="text-2xl font-bold text-white mb-2">{APP_NAME}</h1>
        <p className="text-slate-400 mb-8">
          Le vote est reserve a la communaute ULC ICAM.
          Connecte-toi avec ton compte universitaire.
        </p>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-medium rounded-lg py-3 px-4 hover:bg-slate-200 transition"
        >
          <GoogleIcon className="w-5 h-5" />
          Continuer avec Google
        </button>
      </div>
    </div>
  )
}