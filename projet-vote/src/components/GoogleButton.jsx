import { Loader2 } from 'lucide-react'
import GoogleIcon from './GoogleIcon'

// Le bouton d'action principal : large, rayons serres,
// degrade rouge-vers-or. Pendant la connexion, il affiche
// un spinner et se verrouille.
export default function GoogleButton({ onClick, disabled, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full h-14 rounded-md bg-gradient-to-r from-brand to-gold text-white font-bold text-base flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(194,35,52,0.35)] active:scale-[0.98] transition disabled:opacity-60"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Connexion en cours...
        </>
      ) : (
        <>
          <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
            <GoogleIcon className="w-4 h-4" />
          </span>
          Continuer avec Google
        </>
      )}
    </button>
  )
}