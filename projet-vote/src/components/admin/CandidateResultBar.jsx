// La barre que tu as imaginee : la photo du candidat a gauche,
// et une ligne horizontale qui se remplit comme une barre de
// chargement, proportionnelle a ses voix.
export default function CandidateResultBar({ candidate, votes, totalVotes, isWinner }) {
  const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0

  return (
    <div className={`bg-slate-900 border rounded-2xl p-4 ${isWinner ? 'border-emerald-500' : 'border-slate-800'}`}>
      <div className="flex items-center gap-4">
        <img
          src={candidate.photoUrl}
          alt={candidate.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white text-sm font-medium">
              {candidate.name}
              <span className="text-slate-500 ml-2">Liste {candidate.listName}</span>
            </p>
            <p className="text-slate-300 text-sm">{votes} voix — {pct}%</p>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isWinner ? 'bg-emerald-500' : 'bg-blue-600'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}