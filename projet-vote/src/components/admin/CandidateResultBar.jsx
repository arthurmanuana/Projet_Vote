// La ligne resultat, fidele a ton idee d'origine : photo carree,
// nom et liste, puis la barre horizontale qui se remplit comme un
// chargement. Doree pour le leader, rouge pour les autres.
export default function CandidateResultBar({ candidate, votes, totalVotes, isWinner }) {
  const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0

  return (
    <div className={`rounded-lg border p-3 bg-surface ${isWinner ? 'border-gold/40' : 'border-line'}`}>
      <div className="flex items-center gap-3">
        <img
          src={candidate.photoUrl}
          alt={candidate.name}
          className="w-11 h-11 rounded-md object-cover border border-line shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-bold text-ink truncate">
              {candidate.name}
              <span className="text-muted font-semibold ml-2">Liste {candidate.listName}</span>
            </p>
            <p className="text-xs font-extrabold text-ink shrink-0 ml-2">
              {votes} <span className="text-muted font-semibold">· {pct}%</span>
            </p>
          </div>
          <div className="h-2 rounded-sm bg-card overflow-hidden">
            <div
              className={`h-full rounded-sm transition-all ${isWinner ? 'bg-gold' : 'bg-brand'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}