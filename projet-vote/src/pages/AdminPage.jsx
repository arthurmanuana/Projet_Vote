import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, Vote } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Squelette provisoire du panneau. Le vrai (stats, resultats,
// gestion des admins) arrive en phase 4.
export default function AdminPage() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <header className="max-w-3xl mx-auto flex items-center justify-between mb-10">
        <div className="flex items-center gap-2 text-white font-semibold">
          <LayoutDashboard className="w-5 h-5 text-emerald-500" />
          Panneau administrateur
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition">
          <LogOut className="w-4 h-4" />
          Se deconnecter
        </button>
      </header>

      <main className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <p className="text-slate-400 mb-1">Administrateur connecte</p>
        <p className="text-white font-medium mb-8">{profile.email}</p>

        <div className="border border-dashed border-slate-700 rounded-xl p-6 text-slate-500 text-sm mb-8">
          Statistiques, resultats, gestion des admins : phase 4.
        </div>

        {profile.canVote && (
          <Link to="/vote" className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg py-2 px-4 transition">
            <Vote className="w-4 h-4" />
            Aller voter
          </Link>
        )}
      </main>
    </div>
  )
}