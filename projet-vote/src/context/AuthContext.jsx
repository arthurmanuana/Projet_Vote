import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'
import { loginWithGoogle, logout } from '../services/authService'
import { isAdminEmail } from '../services/adminService'
import { isStudentEmail, isStaffEmail, normalizeEmail } from '../utils/email'
import { STAFF_CAN_LOGIN, STAFF_CAN_VOTE } from '../config'

// Le contexte, c'est la memoire du projet : il sait a tout moment
// qui est connecte, et ce que cette personne a le droit de faire.
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)           // le compte Google brut
  const [profile, setProfile] = useState(null)     // ce qu'on en deduit (etudiant ? staff ? admin ?)
  const [loading, setLoading] = useState(true)     // pendant que Firebase restaure la session
  const [rejection, setRejection] = useState(null) // l'email refuse, pour pouvoir expliquer pourquoi

  useEffect(() => {
    // Firebase nous rappelle a chaque changement : connexion,
    // deconnexion, rechargement de page...
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setProfile(null)
        setLoading(false)
        return
      }

      const email = normalizeEmail(firebaseUser.email)
      const student = isStudentEmail(email)
      const staff = isStaffEmail(email)
      const admin = await isAdminEmail(email)

      // Question 1 : cette personne a-t-elle le droit d'entrer ?
      const canEnter = student || (staff && STAFF_CAN_LOGIN) || admin

      if (!canEnter) {
        // On memorise le refus pour que la page "non autorise"
        // puisse expliquer pourquoi, puis on ferme la porte proprement.
        setRejection({ email })
        setUser(null)
        setProfile(null)
        setLoading(false)
        await logout()
        return
      }

      // Questions 2 et 3 : voter ? administrer ?
      const canVote = student || (staff && STAFF_CAN_VOTE)

      setUser(firebaseUser)
      setProfile({
        email,
        isStudent: student,
        isStaff: staff,
        isAdmin: admin,
        canVote,
        canAdmin: admin,
      })
      setRejection(null)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = { user, profile, loading, rejection, login: loginWithGoogle, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Petit hook de confort, pour ne jamais manipuler le contexte a la main.
export function useAuth() {
  return useContext(AuthContext)
}