import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CheckCircle2, Lock, LogOut, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  hasVoted, castVote, subscribeElection, subscribeCandidates,
} from '../services/electionService'
import CandidateCard from '../components/CandidateCard'
import LoadingScreen from '../components/LoadingScreen'
import NeonBackground from '../components/NeonBackground'
import ThemeToggle from '../components/ThemeToggle'
import CenteredLogo from '../components/CenteredLogo'
import { APP_NAME } from '../config'

// La page de vote, pensee mobile d'abord : barre d'en-tete fine,
// candidats en lignes compactes, confirmation fixee en bas comme
// dans une app native. Toute la logique reste exactement la meme.
export default function VotePage() {
  const { user, profile, logout } = useAuth()
  const navigate = useNavigate()

  const [election, setElection] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [alreadyVoted, setAlreadyVoted] = useState(false)
  const [selected, setSelected] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

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

  const voteOpen = election?.isOpen

  return (
    <div className="relative min-h-screen bg-bg text-ink font-sans">
      <NeonBackground />

      <main className="relative z-10 max-w-md mx-auto px-4 pt-6 pb-40">
        {/* Barre du haut : boule-logo a gauche, controles a droite */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-card border border-line shadow-lg flex items-center justify-center overflow-hidden">
              <CenteredLogo src="/logo-ulc.png" alt="Logo ULC ICAM" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <p className="text-sm font-extrabold leading-tight">{APP_NAME}</p>
              <p className="text-[10px] text-muted leading-tight">Delegates Facultaires 2026-2027</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle floating={false} />
            <button
              onClick={handleLogout}
              aria-label="Se deconnecter"
              className="w-10 h-10 rounded-md bg-card border border-line text-muted hover:text-ink shadow-lg flex items-center justify-center active:scale-95 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Intitue de la section, comme sur l'ecran d'entree */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="h-px w-10 bg-line" />
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-semibold">
            Choisis ta liste
          </p>
          <span className="h-px w-10 bg-line" />
        </div>
        <h1 className="text-lg font-extrabold text-center mb-6">{election?.title}</h1>

        {profile.canAdmin && (
          <div className="flex justify-center mb-6">
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-[11px] font-semibold text-gold border border-line rounded-md px-3 py-1.5 bg-card/60 hover:border-gold/50 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Panneau admin
            </Link>
          </div>
        )}

        {alreadyVoted ? (
          <div className="rounded-md border border-line bg-surface p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-gold mx-auto mb-4" />
            <p className="font-bold mb-1">Ton vote est bien enregistre.</p>
            <p className="text-xs text-muted">Merci pour ta participation.</p>
          </div>
        ) : !voteOpen ? (
          <div className="rounded-md border border-line bg-surface p-8 text-center">
            <Lock className="w-12 h-12 text-brand mx-auto mb-4" />
            <p className="font-bold mb-1">Le vote est actuellement clos.</p>
            <p className="text-xs text-muted">Reviens quand les administrateurs le rouvriront.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {candidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                selected={selected === candidate.id}
                onSelect={() => setSelected(candidate.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Barre de confirmation fixee en bas, facon app native */}
      {!alreadyVoted && voteOpen && (
        <div className="fixed bottom-0 inset-x-0 z-20 bg-bg/85 backdrop-blur border-t border-line">
          <div className="max-w-md mx-auto px-4 py-4">
            <button
              onClick={handleConfirm}
              disabled={!selected || submitting}
              className="w-full h-12 rounded-md bg-gradient-to-r from-brand to-gold text-white font-bold flex items-center justify-center shadow-[0_8px_30px_rgba(194,35,52,0.35)] active:scale-[0.98] transition disabled:opacity-40"
            >
              {submitting ? 'Enregistrement...' : 'Confirmer mon vote'}
            </button>
            <p className="text-[10px] text-muted text-center mt-2">
              Choix unique et definitif. Un seul vote par etudiant.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}