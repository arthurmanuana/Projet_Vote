// Petite carte KPI : une valeur, un label, rien de plus.
export default function StatCard({ label, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-slate-400 text-sm mt-1">{label}</p>
    </div>
  )
}