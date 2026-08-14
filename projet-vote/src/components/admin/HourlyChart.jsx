import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

// Le "Cash Flow" de la maquette, version election :
// les bulletins par heure, en barres dorees qui suivent le theme.
export default function HourlyChart({ data }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="mb-4">
        <p className="text-sm font-bold text-ink">Rythme des votes</p>
        <p className="text-[11px] text-muted">Bulletins par heure</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <XAxis dataKey="hour" stroke="var(--muted)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} stroke="var(--muted)" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: 'var(--card)' }}
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 8,
              color: 'var(--ink)',
            }}
          />
          <Bar dataKey="votes" fill="var(--gold)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}