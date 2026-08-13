import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
const tooltipStyle = { background: '#0f172a', border: '1px solid #1e293b' }

// Trois lectures des memes donnees : barres, camembert, rythme.
export default function ChartsSection({ barData, pieData, hourData }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <p className="text-slate-400 text-sm mb-4">Voix par candidat</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData}>
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="votes" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <p className="text-slate-400 text-sm mb-4">Repartition des voix</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
              {pieData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <p className="text-slate-400 text-sm mb-4">Rythme des votes (par heure)</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={hourData}>
            <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
            <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="votes" stroke="#10b981" fill="#10b98133" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}