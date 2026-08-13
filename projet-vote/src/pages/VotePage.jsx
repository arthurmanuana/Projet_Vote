import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CheckCircle2, Lock, LogOut, ShieldCheck, Vote } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  hasVoted, castVote, subscribeElection, subscribeCandidates,
} from '../services/electionService'
import CandidateCard from '../components/CandidateCard'
import LoadingScreen from '../components/LoadingScreen'
import { APP_NAME } from '../config'

// Page de vote (logique definitive, habillage provisoire).
// Trois etats possibles : deja vote, vote clos, ou choix des candidats.
// Tout est en temps reel : plus jamais besoin de F5.
export default function VotePage() {
  const { user, profile, logout } = useAuth()
  const navigate = useNavigate()

  const [election, setElection] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [alreadyVoted, setAlreadyVoted] = useState(false)
  const [selected, setSelected] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Verification "ai-je deja vote", puis abonnements temps reel :
  // quand l'admin ferme/rouvre le vote ou modifie les candidats,
  // cette page bascule toute seule.
  useEffect(() => {
    if (!user) return undefined

    hasVoted(user.uid)
      .then(setAlreadyVoted)
      .catch((error) => {
        console.error('Verification deja-vote impossible :', error)
        toast.error('Verification du vote impossible.')
      })
      .finally(() => setLoading(false))

    const unsubscriptions = [
      subscribeElection(setElection),
      subscribeCandidates(setCandidates),
    ]
    return () => unsubscriptions.forEach((un) => un())
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

  if (loading || !election) return <LoadingScreen />

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