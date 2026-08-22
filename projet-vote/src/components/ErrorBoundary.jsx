import { Component } from 'react'

// Le filet de securite de l'interface : si un composant crashe,
// plus jamais de page blanche muette. Un ecran propre s'affiche,
// avec un bouton de rechargement et un message humain.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Erreur interface :', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg text-ink font-sans flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-lg border border-line bg-surface p-8 text-center">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-semibold mb-3">
              Incident technique
            </p>
            <h1 className="text-xl font-extrabold mb-2">Quelque chose s'est mal passe.</h1>
            <p className="text-sm text-muted mb-6">
              L'application a rencontre une erreur inattendue. Recharge la page ;
              si cela persiste, rapproche-toi de la commission electorale.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full h-12 rounded-md bg-gradient-to-r from-brand to-gold text-white font-bold active:scale-[0.98] transition"
            >
              Recharger la page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}