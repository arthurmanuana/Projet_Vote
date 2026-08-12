import { Link, useNavigate } from 'react-router-dom'
import { LogOut, ShieldCheck, Vote } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { APP_NAME } from '../config'

// Page de vote provisoire. La vraie interface attend tes styles,
// et la logique de vote elle-meme arrive en phase 3.
export default function VotePage() {
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
          <Vote className="w-5 h-5 text-blue-500" />
          {APP_NAME}
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition">
          <LogOut className="w-4 h-4" />
          Se deconnecter
        </button>
      </header>

      <main className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <p className="text-slate-400 mb-1">Connecte en tant que</p>
        <p className="text-white font-medium mb-4">{profile.email}</p>

        <div className="flex gap-2 mb-8">
          {profile.isStudent && <Badge label="Etudiant" />}
          {profile.isStaff && <Badge label="Staff" />}
          {profile.isAdmin && <Badge label="Admin" />}
        </div>

        <div className="border border-dashed border-slate-700 rounded-xl p-6 text-slate-500 text-sm">
          Interface definitive de vote : bientot (elle attend tes styles).
          Logique de vote : phase 3.
        </div>

        {/* Le fameux bouton : il n'existe que pour les admins */}
        {profile.canAdmin && (
          <Link
            to="/admin"
            className="mt-8 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 px-4 transition"
          >
            <ShieldCheck className="w-4 h-4" />
            Panneau admin
          </Link>
        )}
      </main>
    </div>
  )
}

// Petit badge de role, provisoire lui aussi
function Badge({ label }) {
  return (
    <span className="text-xs bg-slate-800 text-slate-300 rounded-full px-3 py-1">
      {label}
    </span>
  )
}