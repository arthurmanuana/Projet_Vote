import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../firebase/config'

// Ouvre la fenetre Google. Le contexte s'occupe de tout le reste.
export function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider)
}

export function logout() {
  return signOut(auth)
}