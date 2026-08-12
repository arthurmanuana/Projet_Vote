import {
  collection, getDocs, doc, getDoc, setDoc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { normalizeEmail } from '../utils/email'

// La fiche de l'election : titre et etat ouvert/ferme.
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
// Maintenant on cherche par UID (identifiant propre fourni par Firebase).
export async function hasVoted(uid) {
  const snap = await getDoc(doc(db, 'voters', uid))
  return snap.exists()
}

// Le vote en deux temps :
// 1. la participation (clee par UID, avec l'email comme champ),
// 2. le bulletin anonyme (aucune information personnelle).
export async function castVote(user, candidateId) {
  const cleanEmail = normalizeEmail(user.email)

  try {
    await setDoc(doc(db, 'voters', user.uid), {
      email: cleanEmail,
      votedAt: serverTimestamp(),
    })
  } catch (error) {
    throw new Error('ETAPE1-participation : ' + (error.code || error.message))
  }

  try {
    await setDoc(doc(collection(db, 'votes')), {
      choice: candidateId,
      votedAt: serverTimestamp(),
    })
  } catch (error) {
    throw new Error('ETAPE2-bulletin : ' + (error.code || error.message))
  }
}