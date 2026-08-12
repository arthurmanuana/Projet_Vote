import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CheckCircle2, Lock, LogOut, ShieldCheck, Vote } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  loadCandidates, loadElectionConfig, hasVoted, castVote,
} from '../services/electionService'
import CandidateCard from '../components/CandidateCard'
import LoadingScreen from '../components/LoadingScreen'
import { APP_NAME } from '../config'

// Page de vote (logique definitive, habillage provisoire).
// Trois etats possibles : deja vote, vote clos, ou choix des candidats.
export default function VotePage() {
  const { user, profile, logout } = useAuth()
  const navigate = useNavigate()

  const [election, setElection] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [alreadyVoted, setAlreadyVoted] = useState(false)
  const [selected, setSelected] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  // On charge tout en une fois : config, candidats, et "ai-je vote ?"
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [cfg, cands, voted] = await Promise.all([
          loadElectionConfig(),
          loadCandidates(),
          hasVoted(user.uid),
        ])
        setElection(cfg)
        setCandidates(cands)
        setAlreadyVoted(voted)
      } catch (error) {
        console.error('Chargement du vote impossible :', error)
        toast.error('Impossible de charger le vote. Verifie ta connexion.')
      } finally {
        setLoading(false)
      }
    }
    if (user) loadAll()
  }, [user])

  const handleConfirm = async () => {
    if (!selected || submitting) return
    setSubmitting(true)
    try {
      await castVote(user, selected)
      setAlreadyVoted(true)
      toast.success('Vote bien enregistre. Merci !')
    } catch (error) {
      console.error('Vote refuse par le serveur :', error)
      toast.error(error.message || 'Le serveur a refuse le vote.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <header className="max-w-3xl mx-auto flex items-center justify-between mb-10">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Vote className="w-5 h-5 text-blue-500" />
          {APP_NAME}
        </div>
        <div className="flex items-center gap-4">
          {profile.canAdmin && (
            <Link to="/admin" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition">
              <ShieldCheck className="w-4 h-4" />
              Panneau admin
            </Link>
          )}
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition">
            <LogOut className="w-4 h-4" />
            Se deconnecter
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto">
        <h1 className="text-xl font-semibold text-white text-center mb-8">
          {election?.title}
        </h1>

        {alreadyVoted ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Ton vote est bien enregistre.</p>
            <p className="text-slate-400 text-sm">Merci pour ta participation.</p>
          </div>
        ) : !election?.isOpen ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
            <Lock className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Le vote est actuellement clos.</p>
            <p className="text-slate-400 text-sm">Reviens quand les administrateurs le rouvriront.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 mb-8">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  selected={selected === candidate.id}
                  onSelect={() => setSelected(candidate.id)}
                />
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selected || submitting}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg py-3 transition"
            >
              {submitting ? 'Enregistrement...' : 'Confirmer mon vote'}
            </button>
            <p className="text-slate-500 text-xs text-center mt-3">
              Choix unique et definitif. Un seul vote par etudiant.
            </p>
          </>
        )}
      </main>
    </div>
  )
}