import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LayoutDashboard, LogOut, Power, RotateCcw, Trophy, Vote } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  loadCandidates, loadElectionConfig, subscribeElection, subscribeCandidates,
} from '../services/electionService'
import {
  loadAdmins, loadVoters, loadVotes, tallyVotes, setElectionOpen, resetElection,
  subscribeVoters, subscribeVotes, subscribeAdmins,
} from '../services/adminService'
import LoadingScreen from '../components/LoadingScreen'
import StatCard from '../components/admin/StatCard'
import CandidateResultBar from '../components/admin/CandidateResultBar'
import ChartsSection from '../components/admin/ChartsSection'
import VotersTable from '../components/admin/VotersTable'
import AdminsManager from '../components/admin/AdminsManager'
import CandidatesManager from '../components/admin/CandidatesManager'
import { hourLabel } from '../utils/dates'

// Le vrai panneau admin. Fil de fer aujourd'hui, tes styles demain.
// Tout est en temps reel : les votes des etudiants montent en direct.
export default function AdminPage() {
  const { user, profile, logout } = useAuth()
  const navigate = useNavigate()

  const [election, setElection] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [voters, setVoters] = useState([])
  const [votes, setVotes] = useState([])
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)

  // Premier chargement complet (sert aussi apres certaines actions).
  const refresh = useCallback(async () => {
    try {
      const [cfg, cands, vot, bal, adm] = await Promise.all([
        loadElectionConfig(),
        loadCandidates(),
        loadVoters(),
        loadVotes(),
        loadAdmins(),
      ])
      setElection(cfg)
      setCandidates(cands)
      setVoters(vot)
      setVotes(bal)
      setAdmins(adm)
    } catch (error) {
      console.error('Chargement du panneau impossible :', error)
      toast.error('Chargement du panneau impossible.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  // Temps reel : le panneau se met a jour tout seul quand un etudiant
  // vote ou qu'un admin modifie candidats, etat du vote ou admins.
  useEffect(() => {
    const unsubscriptions = [
      subscribeElection(setElection),
      subscribeCandidates(setCandidates),
      subscribeVoters(setVoters),
      subscribeVotes(setVotes),
      subscribeAdmins(setAdmins),
    ]
    return () => unsubscriptions.forEach((un) => un())
  }, [])

  const counts = useMemo(() => tallyVotes(votes, candidates), [votes, candidates])
  const totalVotes = votes.length

  const winner = useMemo(() => {
    if (totalVotes === 0 || candidates.length === 0) return null
    const sorted = [...candidates].sort((a, b) => counts[b.id] - counts[a.id])
    if (sorted.length > 1 && counts[sorted[0].id] === counts[sorted[1].id]) return null
    return sorted[0]
  }, [candidates, counts, totalVotes])

  const barData = useMemo(
    () => candidates.map((c) => ({ name: c.listName || c.name, votes: counts[c.id] })),
    [candidates, counts]
  )
  const pieData = useMemo(() => barData.filter((d) => d.votes > 0), [barData])
  const hourData = useMemo(() => {
    const byHour = {}
    votes.forEach((v) => {
      const h = hourLabel(v.votedAt)
      if (!h) return
      byHour[h] = (byHour[h] || 0) + 1
    })
    return Object.entries(byHour)
      .sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10))
      .map(([hour, count]) => ({ hour, votes: count }))
  }, [votes])

  const participation = election?.expectedVoters
    ? `${Math.min(100, Math.round((voters.length / election.expectedVoters) * 100))}%`
    : '—'

  const toggleOpen = async () => {
    const next = !election?.isOpen
    try {
      await setElectionOpen(next)
      toast.success(next ? 'Vote rouvert.' : 'Vote ferme.')
      refresh()
    } catch (error) {
      console.error('Changement d\'etat impossible :', error)
      toast.error('Changement impossible.')
    }
  }

  const handleReset = async () => {
    if (!window.confirm('Table rase : supprimer TOUTES les participations et TOUS les bulletins ?')) return
    if (!window.confirm('Derniere confirmation. Cette action est irreversible.')) return
    try {
      const n = await resetElection()
      toast.success(`Table rase effectuee : ${n} documents supprimes.`)
      refresh()
    } catch (error) {
      console.error('Table rase impossible :', error)
      toast.error('Table rase impossible.')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <header className="max-w-5xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-white font-semibold">
          <LayoutDashboard className="w-5 h-5 text-emerald-500" />
          Panneau administrateur
        </div>
        <div className="flex items-center gap-4">
          {profile.canVote && (
            <Link to="/vote" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition text-sm">
              <Vote className="w-4 h-4" />
              Voir le vote
            </Link>
          )}
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm">
            <LogOut className="w-4 h-4" />
            Se deconnecter
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={toggleOpen}
            className={`flex items-center gap-2 text-sm rounded-lg px-4 py-2 transition ${
              election?.isOpen
                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
            }`}
          >
            <Power className="w-4 h-4" />
            {election?.isOpen ? 'Fermer le vote' : 'Rouvrir le vote'}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 text-sm rounded-lg px-4 py-2 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Table rase
          </button>
          <span className="text-slate-500 text-sm ml-auto">{election?.title}</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Votants" value={voters.length} />
          <StatCard label="Bulletins" value={totalVotes} />
          <StatCard label="Participation" value={participation} />
          <StatCard label="Etat du vote" value={election?.isOpen ? 'Ouvert' : 'Clos'} />
        </div>

        <section className="space-y-3">
          {winner && (
            <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-4 flex items-center gap-3">
              <Trophy className="w-5 h-5 text-emerald-400" />
              <p className="text-emerald-300 text-sm">
                Gagnant actuel : {winner.name} (Liste {winner.listName}) — {counts[winner.id]} voix
              </p>
            </div>
          )}
          {candidates.map((c) => (
            <CandidateResultBar
              key={c.id}
              candidate={c}
              votes={counts[c.id]}
              totalVotes={totalVotes}
              isWinner={winner?.id === c.id}
            />
          ))}
        </section>

        <ChartsSection barData={barData} pieData={pieData} hourData={hourData} />

        <VotersTable voters={voters} />

        <CandidatesManager candidates={candidates} onChange={refresh} />

        <AdminsManager admins={admins} myEmail={profile.email} onChange={refresh} />
      </main>
    </div>
  )
}