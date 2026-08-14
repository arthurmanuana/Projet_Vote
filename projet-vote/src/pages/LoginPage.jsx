import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ShieldCheck, UserX } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { homeRoute } from '../utils/routing'
import { APP_NAME } from '../config'
import GoogleButton from '../components/GoogleButton'
import LoadingScreen from '../components/LoadingScreen'
import NeonBackground from '../components/NeonBackground'
import ThemeToggle from '../components/ThemeToggle'
import CenteredLogo from '../components/CenteredLogo'

// L'ecran d'entree, pense mobile d'abord.
// Nouveaute : un compte refuse voit un message clair,
// plus jamais un chargement infini.
export default function LoginPage() {
  const { user, profile, loading, rejection, login } = useAuth()
  const [connecting, setConnecting] = useState(false)

  if (loading) return <LoadingScreen />
  if (user && profile) return <Navigate to={homeRoute(profile)} replace />

  const handleLogin = async () => {
    setConnecting(true)
    try {
      await login()
      // Si on arrive ici et que la page est encore montee,
      // c'est que le compte a ete refuse : on rend la main au bouton.
      setConnecting(false)
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Fenetre Google fermee avant la fin de la connexion.')
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup bloque par le navigateur. Autorise-les puis reessaie.')
      } else {
        toast.error('Connexion impossible pour le moment. Reessaie.')
      }
      setConnecting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-bg text-ink font-sans">
      <NeonBackground />
      <ThemeToggle />

      <main className="relative z-10 min-h-screen max-w-md mx-auto flex flex-col items-center justify-center px-6 py-12">
        <div className="relative mb-7">
          <div className="absolute inset-0 rounded-full bg-gold/40 blur-2xl" />
          <div className="relative w-28 h-28 rounded-full bg-card border border-line shadow-2xl flex items-center justify-center overflow-hidden">
            <CenteredLogo
              src="/logo-ulc.png"
              alt="Logo ULC ICAM"
              className="w-24 h-24 object-contain"
            />
          </div>
        </div>

        <p className="text-gold text-[11px] font-semibold tracking-[0.35em] uppercase mb-3">
          ULC — ICAM/Kinshasa
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-center mb-3">
          {APP_NAME}
        </h1>
        <p className="text-sm text-muted text-center leading-relaxed mb-8">
          Election des Délégués Facultaires 2026-2027.
          <br />
          Un étudiant, une voix. Un vote unique, secret et sécurisé.
        </p>

        {/* Message clair pour un compte refuse : plus de spinner infini */}
        {rejection && (
          <div className="w-full mb-6 rounded-md border border-brand/40 bg-brand/10 p-4 text-center">
            <UserX className="w-6 h-6 text-brand mx-auto mb-2" />
            <p className="text-sm font-bold mb-1">Compte non autorise</p>
            <p className="text-xs text-muted leading-relaxed">
              <span className="text-ink font-semibold">{rejection.email}</span>{' '}
              n'appartient pas a la communauté ULC ICAM. Veuillez utiliser un
              compte universitaire (@ulc-icam.com) ou vous rapprocher de la
              commission électorale.
            </p>
          </div>
        )}

        <div className="w-full">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-10 bg-line" />
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-semibold">
              Acces securise
            </p>
            <span className="h-px w-10 bg-line" />
          </div>

          <GoogleButton onClick={handleLogin} loading={connecting} />

          <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted mt-4">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            Reserve aux comptes universitaires @ulc-icam.com
          </p>
        </div>

        <p className="text-[11px] text-muted/70 mt-8">
          Commission electorale — 2026
        </p>
      </main>
    </div>
  )
}