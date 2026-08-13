import {
  collection, getDocs, doc, getDoc, setDoc, serverTimestamp, onSnapshot,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { normalizeEmail } from '../utils/email'

export async function loadElectionConfig() {
  const snap = await getDoc(doc(db, 'config', 'election'))
  return snap.exists() ? snap.data() : { title: 'Election', isOpen: false }
}

export async function loadCandidates() {
  const snap = await getDocs(collection(db, 'candidates'))
  const candidates = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return candidates.sort((a, b) => a.name.localeCompare(b.name))
}

export async function hasVoted(uid) {
  const snap = await getDoc(doc(db, 'voters', uid))
  return snap.exists()
}

// Le vote en deux temps : participation clee par UID, bulletin anonyme.
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

// ---- Temps reel : le serveur pousse les changements vers nous ----

export function subscribeElection(cb) {
  return onSnapshot(doc(db, 'config', 'election'), (snap) => {
    cb(snap.exists() ? snap.data() : { title: 'Election', isOpen: false })
  }, (error) => console.error('Suivi de l\'election impossible :', error))
}

export function subscribeCandidates(cb) {
  return onSnapshot(collection(db, 'candidates'), (snap) => {
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    cb(list.sort((a, b) => a.name.localeCompare(b.name)))
  }, (error) => console.error('Suivi des candidats impossible :', error))
}