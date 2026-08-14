import { Check } from 'lucide-react'

// Le candidat se presente en ligne horizontale compacte, comme sur
// le croquis : photo carree a rayons serres, infos, et case de
// selection qui s'allume en or quand on la choisit.
export default function CandidateCard({ candidate, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full flex items-center gap-3 p-3 rounded-md border text-left transition active:scale-[0.99] ${
        selected
          ? 'border-gold bg-gold/10 shadow-[0_0_20px_rgba(224,168,60,0.15)]'
          : 'border-line bg-surface hover:border-gold/40'
      }`}
    >
      <img
        src={candidate.photoUrl}
        alt={candidate.name}
        className="w-14 h-14 rounded-md object-cover border border-line shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-ink truncate">{candidate.name}</p>
        <p className="text-[11px] text-muted truncate">
          {candidate.course} — {candidate.level}
        </p>
        <p className="text-[11px] text-gold font-semibold mt-1 truncate">
          Liste {candidate.listName}
          {candidate.listMeaning ? ` · ${candidate.listMeaning}` : ''}
        </p>
      </div>
      <div
        className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition ${
          selected
            ? 'bg-gold border-gold text-[#1a1005]'
            : 'border-line text-transparent'
        }`}
      >
        <Check className="w-4 h-4" />
      </div>
    </button>
  )
}