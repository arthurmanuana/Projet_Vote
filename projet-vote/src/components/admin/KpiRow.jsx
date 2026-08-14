import { Users, Vote, Percent, Power } from 'lucide-react'

// La rangee de cartes KPI, calquee sur la maquette : la premiere
// porte l'accent (degrade rouge-or), les autres restent sobres.
export default function KpiRow({ voters, votes, participation, isOpen }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* La carte accent, comme "My balance" */}
      <div className="rounded-lg p-4 text-white bg-gradient-to-br from-brand to-gold shadow-[0_8px_30px_rgba(194,35,52,0.35)]">
        <div className="flex items-center justify-between mb-3">
          <span className="w-8 h-8 rounded-md bg-white/15 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </span>
          <span className="text-[10px] uppercase tracking-widest opacity-80">Votants</span>
        </div>
        <p className="text-2xl font-extrabold">{voters}</p>
        <p className="text-[11px] opacity-80 mt-1">Participations enregistrees</p>
      </div>

      <Card icon={Vote} label="Bulletins" value={votes} hint="Votes dans l'urne" />
      <Card icon={Percent} label="Participation" value={participation} hint="Sur l'effectif attendu" />
      <Card
        icon={Power}
        label="Etat"
        value={isOpen ? 'Ouvert' : 'Clos'}
        hint={isOpen ? 'Les etudiants votent' : 'Vote suspendu'}
      />
    </div>
  )
}

function Card({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="w-8 h-8 rounded-md bg-card border border-line text-gold flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </span>
        <span className="text-[10px] uppercase tracking-widest text-muted">{label}</span>
      </div>
      <p className="text-2xl font-extrabold text-ink">{value}</p>
      <p className="text-[11px] text-muted mt-1">{hint}</p>
    </div>
  )
}