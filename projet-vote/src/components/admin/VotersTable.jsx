import { useMemo, useState } from 'react'
import { Download, Search, Users } from 'lucide-react'
import { downloadCSV } from '../../utils/csv'
import { formatWhen } from '../../utils/dates'

// La table des votants, facon "Recent Activities" : en-tete avec
// recherche et export CSV, lignes fines, initiales en medaillon.
// On ne montre que QUI a vote : le secret de l'urne reste intact.
export default function VotersTable({ voters }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const sorted = [...voters].sort(
      (a, b) => (b.votedAt?.toMillis?.() || 0) - (a.votedAt?.toMillis?.() || 0)
    )
    const q = query.trim().toLowerCase()
    if (!q) return sorted
    return sorted.filter((v) => (v.email || '').toLowerCase().includes(q))
  }, [voters, query])

  const exportCSV = () => {
    downloadCSV('participation.csv', [
      ['Email', 'Date du vote'],
      ...filtered.map((v) => [v.email, formatWhen(v.votedAt)]),
    ])
  }

  return (
    <div className="rounded-lg border border-line bg-surface">
      <div className="flex items-center gap-3 p-4 border-b border-line">
        <span className="w-8 h-8 rounded-md bg-card border border-line text-gold flex items-center justify-center">
          <Users className="w-4 h-4" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold text-ink">Votants</p>
          <p className="text-[11px] text-muted">{filtered.length} participation(s)</p>
        </div>
        <div className="relative hidden sm:block">
          <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un email..."
            className="bg-card border border-line text-ink text-xs rounded-md pl-8 pr-3 h-9 w-48 outline-none focus:border-gold/50 placeholder:text-muted"
          />
        </div>
        <button
          onClick={exportCSV}
          className="h-9 px-3 rounded-md bg-gradient-to-r from-brand to-gold text-white text-xs font-bold flex items-center gap-1.5 active:scale-[0.98] transition"
        >
          <Download className="w-3.5 h-3.5" />
          CSV
        </button>
      </div>

      {/* Recherche en plein écran sur mobile */}
      <div className="p-3 border-b border-line sm:hidden">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un email..."
            className="w-full bg-card border border-line text-ink text-xs rounded-md pl-8 pr-3 h-9 outline-none focus:border-gold/50 placeholder:text-muted"
          />
        </div>
      </div>

      <ul className="divide-y divide-line">
        {filtered.length === 0 && (
          <li className="p-6 text-center text-xs text-muted">Aucun votant pour le moment.</li>
        )}
        {filtered.map((v) => (
          <li key={v.uid} className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-8 h-8 rounded-md bg-card border border-line text-gold flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
                {(v.email || '?').slice(0, 2)}
              </span>
              <p className="text-xs text-ink truncate">{v.email}</p>
            </div>
            <p className="text-[11px] text-muted shrink-0 ml-3">{formatWhen(v.votedAt)}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}