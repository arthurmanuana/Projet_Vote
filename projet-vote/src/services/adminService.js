import {
  collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc,
  writeBatch, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { normalizeEmail } from '../utils/email'

// Ce compte est-il admin ? (admins cles par UID maintenant)
export async function isAdminUid(uid) {
  try {
    const snapshot = await getDoc(doc(db, 'admins', uid))
    return snapshot.exists()
  } catch (error) {
    console.error('Verification admin impossible :', error)
    return false
  }
}

// Annuaire des personnes connectees au moins une fois.
export async function loadProfiles() {
  const snap = await getDocs(collection(db, 'profiles'))
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }))
}

export async function loadAdmins() {
  const snap = await getDocs(collection(db, 'admins'))
  return snap.docs
    .map((d) => ({ uid: d.id, email: d.data().email || d.id }))
    .sort((a, b) => a.email.localeCompare(b.email))
}

// Promouvoir par email : la personne doit s'etre connectee au moins
// une fois (son profil fournit l'UID). Un inconnu total ne peut pas
// devenir admin : c'est un garde-fou, pas un bug.
export async function addAdmin(email) {
  const clean = normalizeEmail(email)
  const profiles = await loadProfiles()
  const profile = profiles.find((p) => normalizeEmail(p.email) === clean)
  if (!profile) {
    throw new Error('Cette personne doit d\'abord se connecter une fois a l\'application.')
  }
  await setDoc(doc(db, 'admins', profile.uid), { email: clean, addedAt: serverTimestamp() })
}

export async function removeAdmin(uid) {
  await deleteDoc(doc(db, 'admins', uid))
}

export async function loadVoters() {
  const snap = await getDocs(collection(db, 'voters'))
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }))
}

export async function loadVotes() {
  const snap = await getDocs(collection(db, 'votes'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function setElectionOpen(isOpen) {
  await updateDoc(doc(db, 'config', 'election'), { isOpen })
}

export async function resetElection() {
  const [voters, votes] = await Promise.all([loadVoters(), loadVotes()])
  const refs = [
    ...voters.map((v) => doc(db, 'voters', v.uid)),
    ...votes.map((v) => doc(db, 'votes', v.id)),
  ]
  for (let i = 0; i < refs.length; i += 400) {
    const batch = writeBatch(db)
    refs.slice(i, i + 400).forEach((ref) => batch.delete(ref))
    await batch.commit()
  }
  return refs.length
}

export async function saveCandidate(data, id = null) {
  if (id) {
    await updateDoc(doc(db, 'candidates', id), data)
  } else {
    await setDoc(doc(collection(db, 'candidates')), data)
  }
}

export async function deleteCandidate(id) {
  await deleteDoc(doc(db, 'candidates', id))
}

export function tallyVotes(votes, candidates) {
  const counts = {}
  candidates.forEach((c) => { counts[c.id] = 0 })
  votes.forEach((v) => {
    if (counts[v.choice] !== undefined) counts[v.choice] += 1
  })
  return counts
}