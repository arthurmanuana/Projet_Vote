import { Link } from 'react-router-dom'
import { UserX } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { UNIVERSITY_DOMAIN } from '../config'

// La porte se ferme poliment : on explique pourquoi, et comment faire mieux.
export default function UnauthorizedPage() {
  const { rejection } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
        <UserX className="w-10 h-10 text-red-400 mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-white mb-3">Acces non autorise</h1>
        <p className="text-slate-400 mb-2">
          {rejection
            ? `Le compte ${rejection.email} n'appartient pas a la communaute ULC ICAM.`
            : "Ce compte n'appartient pas a la communaute ULC ICAM."}
        </p>
        <p className="text-slate-500 text-sm mb-8">
          Reconnecte-toi avec ton compte universitaire (qui se termine par .{UNIVERSITY_DOMAIN}).
        </p>
        <Link to="/" className="text-blue-400 hover:text-blue-300 transition">
          Retour a l'accueil
        </Link>
      </div>
    </div>
  )
}