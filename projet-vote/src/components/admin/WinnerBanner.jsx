import { Trophy } from 'lucide-react'

// Le bandeau du leader, facon ruban officiel : fond dore discret,
// trophee en medaillon, nom et liste en avant, voix a droite.
export default function WinnerBanner({ candidate, votes }) {
  return (
    <div className="rounded-lg border border-gold/30 bg-gold/10 p-4 flex items-center gap-4">
      <span className="w-10 h-10 rounded-md bg-gold text-[#1a1005] flex items-center justify-center shrink-0">
        <Trophy className="w-5 h-5" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-0.5">
          Gagnant actuel
        </p>
        <p className="text-sm font-extrabold text-ink truncate">
          {candidate.name}
          <span className="text-muted font-semibold ml-2">Liste {candidate.listName}</span>
        </p>
      </div>
      <p className="ml-auto text-sm font-extrabold text-gold shrink-0">{votes} voix</p>
    </div>
  )
}