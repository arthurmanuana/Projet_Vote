import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

// Les couleurs du donut : notre charte d'abord, quelques teintes
// d'appoint si beaucoup de listes. Elles suivent le theme actif.
const COLORS = ['var(--gold)', 'var(--brand)', 'var(--muted)', '#7c3aed', '#0ea5e9']

// Le camembert de repartition, en donut sobre avec legende.
export default function SharePie({ data }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <p className="text-sm font-bold text-ink mb-1">Repartition des voix</p>
      <p className="text-[11px] text-muted mb-4">Part de chaque liste</p>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            stroke="var(--bg)"
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 8,
              color: 'var(--ink)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-3 mt-3">
        {data.map((entry, index) => (
          <span key={entry.name} className="flex items-center gap-1.5 text-[11px] text-muted">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ background: COLORS[index % COLORS.length] }}
            />
            {entry.name}
          </span>
        ))}
      </div>
    </div>
  )
}