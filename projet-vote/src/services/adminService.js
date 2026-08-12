import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { normalizeEmail } from '../utils/email'

// Va demander a Firestore : "est-ce que cet email est dans la
// collection admins ?". Si la collection n'existe pas encore,
// getDoc repond simplement "non" sans faire planter l'app.
export async function isAdminEmail(email) {
  try {
    const snapshot = await getDoc(doc(db, 'admins', normalizeEmail(email)))
    return snapshot.exists()
  } catch (error) {
    // Si le reseau tousse, on ne bloque pas tout le monde :
    // la personne entrera en utilisateur normal, admin plus tard.
    console.error('Verification admin impossible :', error)
    return false
  }
}