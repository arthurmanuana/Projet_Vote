import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

// L'interrupteur jour/nuit. En mode floating il flotte (page de
// connexion) ; sinon il s'insere dans une barre d'en-tete.
export default function ThemeToggle({ floating = true }) {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label="Changer de theme"
      className={`${floating ? 'fixed top-4 right-4 z-50' : ''} w-10 h-10 rounded-md bg-card border border-line text-gold shadow-lg backdrop-blur flex items-center justify-center active:scale-95 transition`}
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}