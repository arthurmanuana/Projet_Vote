import { Loader2 } from 'lucide-react'

// Ecran d'attente unique, pour ne pas avoir de page qui "clignote"
// pendant que Firebase restaure la session.
export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  )
}