import {
  collection, getDocs, doc, getDoc, writeBatch, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { normalizeEmail } from '../utils/email'

// La fiche de l'election : titre et etat ouvert/ferme.
// Si le document n'existe pas, on prefere fermer la porte qu'ouvrir grand.
export async function loadElectionConfig() {
  const snap = await getDoc(doc(db, 'config', 'election'))
  return snap.exists() ? snap.data() : { title: 'Election', isOpen: false }
}

// Tous les candidats, tries par nom pour un affichage stable.
export async function loadCandidates() {
  const snap = await getDocs(collection(db, 'candidates'))
  const candidates = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return candidates.sort((a, b) => a.name.localeCompare(b.name))
}

// Est-ce que la personne connectee a deja vote ?
export async function hasVoted(email) {
  const snap = await getDoc(doc(db, 'voters', normalizeEmail(email)))
  return snap.exists()
}

// Le geste central : participation + bulletin ecrits ENSEMBLE.
// Soit les deux passent, soit rien ne passe. Pas d'entre-deux possible.
export async function castVote(email, candidateId) {
  const batch = writeBatch(db)

  // 1. La participation, ID = email de la personne (bloque le double vote)
  batch.set(doc(db, 'voters', normalizeEmail(email)), {
    email: normalizeEmail(email),
    votedAt: serverTimestamp(),
  })

  // 2. Le bulletin, ID aleatoire, sans aucune information personnelle
  batch.set(doc(collection(db, 'votes')), {
    choice: candidateId,
    votedAt: serverTimestamp(),
  })

  await batch.commit()
}