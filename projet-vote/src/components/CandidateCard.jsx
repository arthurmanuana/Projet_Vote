// Carte candidat provisoire (fil de fer).
// Le design definitif viendra avec tes styles, la logique restera.
export default function CandidateCard({ candidate, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`text-left bg-slate-900 border rounded-2xl p-6 transition ${
        selected
          ? 'border-blue-500 ring-2 ring-blue-500/40'
          : 'border-slate-800 hover:border-slate-600'
      }`}
    >
      <img
        src={candidate.photoUrl}
        alt={candidate.name}
        className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
      />
      <p className="text-white font-semibold text-center mb-1">{candidate.name}</p>
      <p className="text-slate-400 text-sm text-center mb-3">
        {candidate.course} — {candidate.level}
      </p>
      <p className="text-center text-sm">
        <span className="bg-slate-800 text-slate-200 rounded-full px-3 py-1">
          Liste {candidate.listName}
        </span>
      </p>
      {candidate.listMeaning && (
        <p className="text-slate-500 text-xs text-center mt-2">{candidate.listMeaning}</p>
      )}
    </button>
  )
}