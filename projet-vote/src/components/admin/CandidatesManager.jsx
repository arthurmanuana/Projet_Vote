import { useState } from 'react'
import { Pencil, Save, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { saveCandidate, deleteCandidate } from '../../services/adminService'

const inputCls = 'bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500'

const EMPTY = {
  name: '',
  course: '',
  level: '',
  listName: '',
  listMeaning: '',
  photoUrl: '/profil-homme.jpg',
}

// Ajouter, modifier, retirer des candidats : plus besoin de la console.
export default function CandidatesManager({ candidates, onChange }) {
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSave = async () => {
    if (!form.name.trim() || !form.listName.trim()) {
      toast.error('Le nom du candidat et le nom de la liste sont obligatoires.')
      return
    }
    try {
      await saveCandidate({ ...form, name: form.name.trim() }, editingId)
      toast.success(editingId ? 'Candidat modifie.' : 'Candidat ajoute.')
      setForm(EMPTY)
      setEditingId(null)
      onChange()
    } catch (error) {
      console.error('Enregistrement candidat impossible :', error)
      toast.error('Enregistrement impossible.')
    }
  }

  const startEdit = (candidate) => {
    setEditingId(candidate.id)
    setForm({
      name: candidate.name || '',
      course: candidate.course || '',
      level: candidate.level || '',
      listName: candidate.listName || '',
      listMeaning: candidate.listMeaning || '',
      photoUrl: candidate.photoUrl || '/profil-homme.jpg',
    })
  }

  const handleDelete = async (candidate) => {
    if (!window.confirm(`Retirer ${candidate.name} de l'election ?`)) return
    try {
      await deleteCandidate(candidate.id)
      toast.success('Candidat retire.')
      if (editingId === candidate.id) {
        setEditingId(null)
        setForm(EMPTY)
      }
      onChange()
    } catch (error) {
      console.error('Suppression candidat impossible :', error)
      toast.error('Suppression impossible.')
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <p className="text-white font-medium mb-4">Gestion des candidats</p>

      <div className="space-y-2 mb-6">
        {candidates.map((c) => (
          <div key={c.id} className="flex items-center justify-between bg-slate-800/60 rounded-lg px-3 py-2">
            <div className="flex items-center gap-3">
              <img src={c.photoUrl} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="text-slate-200 text-sm">{c.name}</p>
                <p className="text-slate-500 text-xs">Liste {c.listName} — {c.course} {c.level}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => startEdit(c)} className="text-slate-400 hover:text-white transition p-1">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(c)} className="text-slate-400 hover:text-red-400 transition p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-slate-400 text-sm mb-3">
        {editingId ? 'Modification du candidat' : 'Ajouter un candidat'}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={form.name} onChange={set('name')} placeholder="Nom complet *" className={inputCls} />
        <input value={form.course} onChange={set('course')} placeholder="Parcours (ex : Genie Informatique)" className={inputCls} />
        <input value={form.level} onChange={set('level')} placeholder="Niveau (ex : X2)" className={inputCls} />
        <input value={form.listName} onChange={set('listName')} placeholder="Nom de la liste *" className={inputCls} />
        <input value={form.listMeaning} onChange={set('listMeaning')} placeholder="Signification de la liste" className={inputCls} />
        <input value={form.photoUrl} onChange={set('photoUrl')} placeholder="Photo (ex : /profil-homme.jpg)" className={inputCls} />
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg px-4 py-2 transition"
        >
          <Save className="w-4 h-4" />
          {editingId ? 'Enregistrer les modifications' : 'Ajouter le candidat'}
        </button>
        {editingId && (
          <button
            onClick={() => { setEditingId(null); setForm(EMPTY) }}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-lg px-4 py-2 transition"
          >
            <X className="w-4 h-4" />
            Annuler
          </button>
        )}
      </div>
    </div>
  )
}