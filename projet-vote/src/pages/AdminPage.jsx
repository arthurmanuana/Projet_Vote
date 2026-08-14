import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import {
  loadCandidates, loadElectionConfig, subscribeElection, subscribeCandidates,
} from '../services/electionService'
import {
  loadAdmins, loadVoters, loadVotes, tallyVotes, setElectionOpen, resetElection,
  subscribeVoters, subscribeVotes, subscribeAdmins,
} from '../services/adminService'
import LoadingScreen from '../components/LoadingScreen'
import AdminLayout from '../components/admin/AdminLayout'
import KpiRow from '../components/admin/KpiRow'
import HourlyChart from '../components/admin/HourlyChart'
import RecentActivity from '../components/admin/RecentActivity'
import WinnerBanner from '../components/admin/WinnerBanner'
import CandidateResultBar from '../components/admin/CandidateResultBar'
import SharePie from '../components/admin/SharePie'
import VotersTable from '../components/admin/VotersTable'
import CandidatesManager from '../components/admin/CandidatesManager'
import AdminsManager from '../components/admin/AdminsManager'
import { hourLabel } from '../utils/dates'

const TITLES = {
  dashboard: 'Tableau de bord',
  resultats: 'Resultats',
  votants: 'Votants',
  candidats: 'Candidats',
  admins: 'Administrateurs',
}

// Le panneau admin, facon dashboard : sidebar de navigation,
// vues qui s'enchainent, donnees en temps reel partagees.
// Toute la logique metier reste dans les services et les regles.
export default function AdminPage() {
  const { user, profile, logout } = useAuth()
  const navigate = useNavigate()

  const [section, setSection] = useState('dashboard')
  const [election, setElection] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [voters, setVoters] = useState([])
  const [votes, setVotes] = useState([])
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)

  // Premier chargement complet.
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

  // Temps reel : tout se met a jour tout seul, partout.
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

  // ---- Depouillement et donnees derivees ----
  const counts = useMemo(() => tallyVotes(votes, candidates), [votes, candidates])
  const totalVotes = votes.length

  const winner = useMemo(() => {
    if (totalVotes === 0 || candidates.length === 0) return null
    const sorted = [...candidates].sort((a, b) => counts[b.id] - counts[a.id])
    if (sorted.length > 1 && counts[sorted[0].id] === counts[sorted[1].id]) return null
    return sorted[0]
  }, [candidates, counts, totalVotes])

  const pieData = useMemo(
    () => candidates
      .map((c) => ({ name: c.listName || c.name, value: counts[c.id] }))
      .filter((d) => d.value > 0),
    [candidates, counts]
  )

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

  // ---- Actions globales ----
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
    <AdminLayout
      current={section}
      title={TITLES[section]}
      onNavigate={setSection}
      election={election}
      onToggleOpen={toggleOpen}
      onReset={handleReset}
      onLogout={handleLogout}
    >
      {section === 'dashboard' && (
        <div className="space-y-4">
          <KpiRow
            voters={voters.length}
            votes={totalVotes}
            participation={participation}
            isOpen={election?.isOpen}
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <HourlyChart data={hourData} />
            <RecentActivity voters={voters} />
          </div>
        </div>
      )}

      {section === 'resultats' && (
        <div className="space-y-4">
          {winner && <WinnerBanner candidate={winner} votes={counts[winner.id]} />}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              {candidates.map((c) => (
                <CandidateResultBar
                  key={c.id}
                  candidate={c}
                  votes={counts[c.id]}
                  totalVotes={totalVotes}
                  isWinner={winner?.id === c.id}
                />
              ))}
            </div>
            <SharePie data={pieData} />
          </div>
        </div>
      )}

      {section === 'votants' && <VotersTable voters={voters} />}

      {section === 'candidats' && <CandidatesManager candidates={candidates} onChange={refresh} />}

      {section === 'admins' && <AdminsManager admins={admins} myEmail={profile.email} onChange={refresh} />}
    </AdminLayout>
  )
}