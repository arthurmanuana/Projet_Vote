import { Link, useNavigate } from 'react-router-dom'
import { Info, LogOut, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Pour les personnes qui peuvent entrer mais pas voter :
// staff sans droit de vote, ou admin venu voir la page de vote.
export default function NoVotePage() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
        <Info className="w-10 h-10 text-amber-400 mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-white mb-3">Le vote est reserve aux etudiants</h1>
        <p className="text-slate-400 mb-8">
          {profile?.isAdmin
            ? 'Ton compte est un compte administrateur : il ne participe pas au vote.'
            : 'Ton compte ne permet pas de voter pour le moment.'}
        </p>

        {profile?.canAdmin ? (
          <Link to="/admin" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 px-4 transition">
            <ShieldCheck className="w-4 h-4" />
            Ouvrir le panneau admin
          </Link>
        ) : (
          <button onClick={handleLogout} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition">
            <LogOut className="w-4 h-4" />
            Se deconnecter
          </button>
        )}
      </div>
    </div>
  )
}