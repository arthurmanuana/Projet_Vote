import { formatWhen } from '../../utils/dates'

// Comme "Recent Activities" : les dernieres participations,
// les plus recentes d'abord. On ne montre que QUI a vote,
// jamais POUR QUI : le secret de l'urne reste intact.
export default function RecentActivity({ voters, limit = 6 }) {
  const recent = [...voters]
    .sort((a, b) => (b.votedAt?.toMillis?.() || 0) - (a.votedAt?.toMillis?.() || 0))
    .slice(0, limit)

  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <p className="text-sm font-bold text-ink mb-3">Activite recente</p>
      {recent.length === 0 ? (
        <p className="text-xs text-muted py-4 text-center">Aucune participation pour le moment.</p>
      ) : (
        <ul className="divide-y divide-line">
          {recent.map((v) => (
            <li key={v.uid} className="flex items-center justify-between py-2.5">
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
      )}
    </div>
  )
}