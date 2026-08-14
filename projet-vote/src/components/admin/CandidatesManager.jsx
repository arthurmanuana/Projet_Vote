import { useState } from 'react'
import { Pencil, Save, Trash2, Upload, Users, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { saveCandidate, deleteCandidate } from '../../services/adminService'
import { fileToDataUrl } from '../../utils/images'

const inputCls = 'w-full bg-card border border-line text-ink text-xs rounded-md px-3 h-10 outline-none focus:border-gold/50 placeholder:text-muted'

const EMPTY = {
  name: '',
  course: '',
  level: '',
  listName: '',
  listMeaning: '',
  photoUrl: '/profil-homme.jpg',
}

// Gerer les candidats sans toucher au code : liste en haut,
// formulaire en bas, photo compressee cote navigateur.
export default function CandidatesManager({ candidates, onChange }) {
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await fileToDataUrl(file)
      if (dataUrl.length > 900000) {
        toast.error('Image trop lourde meme compressee. Choisis une photo plus simple.')
        return
      }
      setForm({ ...form, photoUrl: dataUrl })
      toast.success('Photo prete. Pense a enregistrer le candidat.')
    } catch (error) {
      console.error('Photo impossible a compresser :', error)
      toast.error('Lecture de la photo impossible.')
    }
  }

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
    <div className="rounded-lg border border-line bg-surface">
      <div className="flex items-center gap-3 p-4 border-b border-line">
        <span className="w-8 h-8 rounded-md bg-card border border-line text-gold flex items-center justify-center">
          <Users className="w-4 h-4" />
        </span>
        <div>
          <p className="text-sm font-bold text-ink">Candidats</p>
          <p className="text-[11px] text-muted">{candidates.length} liste(s) en lice</p>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {candidates.map((c) => (
          <div key={c.id} className="flex items-center justify-between bg-card border border-line rounded-md px-3 py-2">
            <div className="flex items-center gap-3 min-w-0">
              <img src={c.photoUrl} alt={c.name} className="w-9 h-9 rounded-md object-cover border border-line shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink truncate">{c.name}</p>
                <p className="text-[11px] text-muted truncate">
                  Liste {c.listName} — {c.course} {c.level}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button onClick={() => startEdit(c)} aria-label={`Modifier ${c.name}`} className="w-8 h-8 rounded-md border border-line text-muted hover:text-gold flex items-center justify-center transition">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(c)} aria-label={`Retirer ${c.name}`} className="w-8 h-8 rounded-md border border-line text-muted hover:text-brand flex items-center justify-center transition">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-line">
        <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-3">
          {editingId ? 'Modification du candidat' : 'Nouveau candidat'}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={form.name} onChange={set('name')} placeholder="Nom complet *" className={inputCls} />
          <input value={form.course} onChange={set('course')} placeholder="Parcours (ex : Genie Informatique)" className={inputCls} />
          <input value={form.level} onChange={set('level')} placeholder="Niveau (ex : X2)" className={inputCls} />
          <input value={form.listName} onChange={set('listName')} placeholder="Nom de la liste *" className={inputCls} />
          <input value={form.listMeaning} onChange={set('listMeaning')} placeholder="Signification de la liste" className={inputCls} />
          <div className="flex items-center gap-2">
            <input value={form.photoUrl} onChange={set('photoUrl')} placeholder="Photo (ex : /profil-homme.jpg)" className={inputCls} />
            <label className="h-10 px-3 rounded-md bg-card border border-line text-ink text-xs font-semibold flex items-center gap-2 cursor-pointer whitespace-nowrap hover:border-gold/50 transition">
              <Upload className="w-3.5 h-3.5 text-gold" />
              Photo
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </label>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSave}
            className="h-10 px-4 rounded-md bg-gradient-to-r from-brand to-gold text-white text-xs font-bold flex items-center gap-2 active:scale-[0.98] transition"
          >
            <Save className="w-3.5 h-3.5" />
            {editingId ? 'Enregistrer les modifications' : 'Ajouter le candidat'}
          </button>
          {editingId && (
            <button
              onClick={() => { setEditingId(null); setForm(EMPTY) }}
              className="h-10 px-4 rounded-md bg-card border border-line text-ink text-xs font-semibold flex items-center gap-2 hover:border-gold/50 transition"
            >
              <X className="w-3.5 h-3.5" />
              Annuler
            </button>
          )}
        </div>
      </div>
    </div>
  )
}