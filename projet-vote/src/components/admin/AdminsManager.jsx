import { useState } from 'react'
import { Trash2, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { addAdmin, removeAdmin } from '../../services/adminService'

const inputCls = 'bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500 flex-1'

// Ajouter / retirer des admins. Garde-fous :
// jamais te retirer toi-meme, jamais supprimer le dernier admin.
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <p className="text-white font-medium mb-4">Administrateurs ({admins.length})</p>

      <div className="space-y-2 mb-4">
        {admins.map((a) => (
          <div key={a.uid} className="flex items-center justify-between bg-slate-800/60 rounded-lg px-3 py-2">
            <p className="text-slate-200 text-sm">
              {a.email}
              {a.email === myEmail && <span className="text-slate-500 ml-2">(toi)</span>}
            </p>
            <button onClick={() => handleRemove(a)} className="text-slate-400 hover:text-red-400 transition p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@ulc-icam.com"
          className={inputCls}
        />
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg px-4 py-2 transition"
        >
          <UserPlus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      <p className="text-slate-500 text-xs mt-3">
        Pour promouvoir quelqu'un, cette personne doit s'etre connectee au moins une fois.
      </p>
    </div>
  )
}