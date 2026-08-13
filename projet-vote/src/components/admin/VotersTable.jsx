import { useMemo, useState } from 'react'
import { Download, Search } from 'lucide-react'
import { downloadCSV } from '../../utils/csv'
import { formatWhen } from '../../utils/dates'

// Qui a vote, quand, avec recherche et export CSV.
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-white font-medium">Liste des votants ({filtered.length})</p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un email..."
              className="bg-slate-800 text-slate-200 text-sm rounded-lg pl-9 pr-3 py-2 outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 transition"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 border-b border-slate-800">
              <th className="text-left py-2 pr-4 font-medium">Email</th>
              <th className="text-left py-2 font-medium">Date du vote</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={2} className="text-slate-500 py-4 text-center">
                  Aucun votant pour le moment.
                </td>
              </tr>
            )}
            {filtered.map((v) => (
              <tr key={v.uid} className="border-b border-slate-800/60">
                <td className="py-2 pr-4 text-slate-200">{v.email}</td>
                <td className="py-2 text-slate-400">{formatWhen(v.votedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}