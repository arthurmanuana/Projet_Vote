import { Link } from 'react-router-dom'
import { UserX } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { UNIVERSITY_DOMAIN } from '../config'
import NeonBackground from '../components/NeonBackground'
import ThemeToggle from '../components/ThemeToggle'

// La porte se ferme poliment, dans la charte : on explique
// pourquoi, et comment faire mieux.
export default function UnauthorizedPage() {
  const { rejection } = useAuth()

  return (
    <div className="relative min-h-screen bg-bg text-ink font-sans flex items-center justify-center p-6">
      <NeonBackground />
      <ThemeToggle />
      <div className="relative z-10 max-w-md w-full rounded-lg border border-line bg-surface p-8 text-center">
        <UserX className="w-10 h-10 text-brand mx-auto mb-4" />
        <h1 className="text-xl font-extrabold mb-3">Acces non autorise</h1>
        <p className="text-sm text-muted mb-2">
          {rejection
            ? `Le compte ${rejection.email} n'appartient pas a la communaute ULC ICAM.`
            : "Ce compte n'appartient pas a la communaute ULC ICAM."}
        </p>
        <p className="text-xs text-muted mb-8">
          Reconnecte-toi avec ton compte universitaire (qui se termine par .{UNIVERSITY_DOMAIN}).
        </p>
        <Link
          to="/"
          className="inline-flex h-11 px-6 items-center justify-center rounded-md bg-gradient-to-r from-brand to-gold text-white text-sm font-bold active:scale-[0.98] transition"
        >
          Retour a l'accueil
        </Link>
      </div>
    </div>
  )
}