import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Menu, Vote, X } from 'lucide-react'
import ThemeToggle from '../ThemeToggle'
import AdminSidebar from './AdminSidebar'

// L'enveloppe du panneau, comme la maquette : sidebar a gauche sur
// ordinateur, tiroir sur mobile, barre du haut avec fil d'Ariane
// et actions. Le contenu vit dans children.
export default function AdminLayout({
  current,
  title,
  onNavigate,
  election,
  onToggleOpen,
  onReset,
  onLogout,
  children,
}) {
  const [drawer, setDrawer] = useState(false)

  const navigate = (id) => {
    onNavigate(id)
    setDrawer(false)
  }

  return (
    <div className="relative min-h-screen bg-bg text-ink font-sans">
      {/* Sidebar fixe, md et plus */}
      <aside className="hidden md:block fixed inset-y-0 left-0 w-60 z-30">
        <AdminSidebar
          current={current}
          onNavigate={navigate}
          election={election}
          onToggleOpen={onToggleOpen}
          onReset={onReset}
        />
      </aside>

      {/* Tiroir mobile */}
      {drawer && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-64 shadow-2xl">
            <AdminSidebar
              current={current}
              onNavigate={navigate}
              election={election}
              onToggleOpen={onToggleOpen}
              onReset={onReset}
            />
          </div>
          <button
            onClick={() => setDrawer(false)}
            aria-label="Fermer le menu"
            className="absolute top-4 right-4 w-10 h-10 rounded-md bg-card border border-line text-muted flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Colonne principale */}
      <div className="md:pl-60">
        <header className="sticky top-0 z-20 h-16 bg-bg/85 backdrop-blur border-b border-line flex items-center gap-3 px-4 md:px-6">
          <button
            onClick={() => setDrawer(true)}
            aria-label="Ouvrir le menu"
            className="md:hidden w-10 h-10 rounded-md bg-card border border-line text-muted flex items-center justify-center"
          >
            <Menu className="w-4 h-4" />
          </button>
          <p className="text-xs text-muted">
            Admin <span className="mx-1 opacity-50">/</span>
            <span className="text-ink font-semibold">{title}</span>
          </p>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/vote"
              aria-label="Voir le vote"
              className="w-10 h-10 rounded-md bg-card border border-line text-muted hover:text-ink flex items-center justify-center transition"
            >
              <Vote className="w-4 h-4" />
            </Link>
            <ThemeToggle floating={false} />
            <button
              onClick={onLogout}
              aria-label="Se deconnecter"
              className="w-10 h-10 rounded-md bg-card border border-line text-muted hover:text-ink flex items-center justify-center transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}