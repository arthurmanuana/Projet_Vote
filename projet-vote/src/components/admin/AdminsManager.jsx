import { useState } from 'react'
import { ShieldCheck, Trash2, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { addAdmin, removeAdmin } from '../../services/adminService'

const inputCls = 'flex-1 bg-card border border-line text-ink text-xs rounded-md px-3 h-10 outline-none focus:border-gold/50 placeholder:text-muted'

// Gerer l'equipe admin : la liste, l'ajout par email (la personne
// doit avoir laisse une carte dans l'annuaire), et les deux
// garde-fous : jamais soi-meme, jamais le dernier admin.
export default function AdminsManager({ admins, myEmail, onChange }) {
  const [email, setEmail] = useState('')

  const handleAdd = async () => {
    const clean = email.trim().toLowerCase()
    if (!clean.includes('@') || !clean.includes('.')) {
      toast.error('Entre un email valide.')
      return
    }
    if (admins.some((a) => a.email === clean)) {
      toast.error('Cet email est deja admin.')
      return
    }
    try {
      await addAdmin(clean)
      toast.success('Admin ajoute.')
      setEmail('')
      onChange()
    } catch (error) {
      console.error('Ajout admin impossible :', error)
      toast.error(error.message || 'Ajout impossible.')
    }
  }

  const handleRemove = async (target) => {
    if (target.email === myEmail) {
      toast.error('Tu ne peux pas te retirer toi-meme.')
      return
    }
    if (admins.length <= 1) {
      toast.error('Impossible de supprimer le dernier admin.')
      return
    }
    try {
      await removeAdmin(target.uid)
      toast.success('Admin retire.')
      onChange()
    } catch (error) {
      console.error('Suppression admin impossible :', error)
      toast.error('Suppression impossible.')
    }
  }

  return (
    <div className="rounded-lg border border-line bg-surface">
      <div className="flex items-center gap-3 p-4 border-b border-line">
        <span className="w-8 h-8 rounded-md bg-card border border-line text-gold flex items-center justify-center">
          <ShieldCheck className="w-4 h-4" />
        </span>
        <div>
          <p className="text-sm font-bold text-ink">Administrateurs</p>
          <p className="text-[11px] text-muted">{admins.length} compte(s) avec acces</p>
        </div>
      </div>

      <ul className="divide-y divide-line">
        {admins.map((a) => (
          <li key={a.uid} className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-8 h-8 rounded-md bg-card border border-line text-gold flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
                {(a.email || '?').slice(0, 2)}
              </span>
              <p className="text-xs text-ink truncate">
                {a.email}
                {a.email === myEmail && <span className="text-muted ml-2">(toi)</span>}
              </p>
            </div>
            <button
              onClick={() => handleRemove(a)}
              aria-label={`Retirer ${a.email}`}
              className="w-8 h-8 rounded-md border border-line text-muted hover:text-brand flex items-center justify-center transition shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </li>
        ))}
      </ul>

      <div className="p-4 border-t border-line">
        <div className="flex gap-2">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@ulc-icam.com"
            className={inputCls}
          />
          <button
            onClick={handleAdd}
            className="h-10 px-4 rounded-md bg-gradient-to-r from-brand to-gold text-white text-xs font-bold flex items-center gap-2 active:scale-[0.98] transition shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Ajouter
          </button>
        </div>
        <p className="text-[11px] text-muted mt-3">
          Pour promouvoir quelqu'un, cette personne doit avoir tente une connexion
          au moins une fois. Garde-fous : jamais toi-meme, jamais le dernier admin.
        </p>
      </div>
    </div>
  )
}