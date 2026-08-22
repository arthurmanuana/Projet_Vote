import { Loader2 } from 'lucide-react'

// L'ecran d'attente unique, dans la charte : fond du theme,
// spinner dore, petit intitule discret.
export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 text-gold animate-spin" />
      <p className="text-[11px] text-muted tracking-widest uppercase">Chargement</p>
    </div>
  )
}