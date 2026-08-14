import { LayoutDashboard, Trophy, Users, Vote, ShieldCheck, Power, RotateCcw } from 'lucide-react'
import CenteredLogo from '../CenteredLogo'

const NAV = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'resultats', label: 'Resultats', icon: Trophy },
  { id: 'votants', label: 'Votants', icon: Users },
  { id: 'candidats', label: 'Candidats', icon: Vote },
  { id: 'admins', label: 'Administrateurs', icon: ShieldCheck },
]

// La colonne vertebrale du panneau. En bas, la carte d'etat du vote
// reprend la place de la carte "Upgrade" de la maquette, mais en
// version utile : ouvrir/fermer et table rase, toujours sous la main.
export default function AdminSidebar({ current, onNavigate, election, onToggleOpen, onReset }) {
  return (
    <div className="flex flex-col h-full w-full bg-surface border-r border-line">
      <div className="flex items-center gap-3 px-4 h-16 border-b border-line shrink-0">
        <div className="w-9 h-9 rounded-md bg-card border border-line flex items-center justify-center overflow-hidden">
          <CenteredLogo src="/logo-ulc.png" alt="ULC" className="w-7 h-7 object-contain" />
        </div>
        <div>
          <p className="text-sm font-extrabold leading-tight">Projet VOTE</p>
          <p className="text-[10px] text-muted leading-tight">Panneau admin</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-2 text-[10px] tracking-[0.25em] uppercase text-muted mb-2">Pilotage</p>
        {NAV.map((item) => {
          const Icon = item.icon
          const active = current === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 h-10 rounded-md text-sm font-semibold transition ${
                active
                  ? 'bg-gold/10 text-gold border border-gold/20'
                  : 'text-muted hover:text-ink hover:bg-card border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="p-3 shrink-0">
        <div className="rounded-lg border border-line bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold">Etat du vote</p>
            <span className={`w-2 h-2 rounded-full ${election?.isOpen ? 'bg-emerald-400' : 'bg-brand'}`} />
          </div>
          <p className="text-[11px] text-muted mb-3">
            {election?.isOpen ? 'Le vote est ouvert aux etudiants.' : 'Le vote est actuellement clos.'}
          </p>
          <button
            onClick={onToggleOpen}
            className="w-full h-9 rounded-md bg-gradient-to-r from-brand to-gold text-white text-xs font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition"
          >
            <Power className="w-3.5 h-3.5" />
            {election?.isOpen ? 'Fermer le vote' : 'Rouvrir le vote'}
          </button>
          <button
            onClick={onReset}
            className="w-full h-9 mt-2 rounded-md border border-brand/40 text-brand text-xs font-bold flex items-center justify-center gap-2 hover:bg-brand/10 active:scale-[0.98] transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Table rase
          </button>
        </div>
      </div>
    </div>
  )
}