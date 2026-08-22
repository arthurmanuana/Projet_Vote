import { Link, useNavigate } from 'react-router-dom'
import { Info, LogOut, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import NeonBackground from '../components/NeonBackground'
import ThemeToggle from '../components/ThemeToggle'

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
    <div className="relative min-h-screen bg-bg text-ink font-sans flex items-center justify-center p-6">
      <NeonBackground />
      <ThemeToggle />
      <div className="relative z-10 max-w-md w-full rounded-lg border border-line bg-surface p-8 text-center">
        <Info className="w-10 h-10 text-gold mx-auto mb-4" />
        <h1 className="text-xl font-extrabold mb-3">Le vote est reserve aux etudiants</h1>
        <p className="text-sm text-muted mb-8">
          {profile?.isAdmin
            ? 'Ton compte est un compte administrateur : il ne participe pas au vote.'
            : 'Ton compte ne permet pas de voter pour le moment.'}
        </p>
        {profile?.canAdmin ? (
          <Link
            to="/admin"
            className="inline-flex h-11 px-6 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-brand to-gold text-white text-sm font-bold active:scale-[0.98] transition"
          >
            <ShieldCheck className="w-4 h-4" />
            Ouvrir le panneau admin
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="inline-flex h-11 px-6 items-center justify-center gap-2 rounded-md border border-line text-ink text-sm font-semibold hover:border-gold/50 transition"
          >
            <LogOut className="w-4 h-4" />
            Se deconnecter
          </button>
        )}
      </div>
    </div>
  )
}