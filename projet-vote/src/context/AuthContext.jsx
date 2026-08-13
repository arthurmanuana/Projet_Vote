import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { loginWithGoogle, logout } from '../services/authService'
import { isAdminUid } from '../services/adminService'
import { isStudentEmail, isStaffEmail, normalizeEmail } from '../utils/email'
import { STAFF_CAN_LOGIN, STAFF_CAN_VOTE } from '../config'

// La memoire du projet : qui est connecte, et avec quels droits.
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rejection, setRejection] = useState(null)

  useEffect(() => {
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
      const admin = await isAdminUid(firebaseUser.uid)

      const canEnter = student || (staff && STAFF_CAN_LOGIN) || admin

      if (!canEnter) {
        setRejection({ email })
        setUser(null)
        setProfile(null)
        setLoading(false)
        await logout()
        return
      }

      // Annuaire : qui s'est connecte au moins une fois.
      // Servira au panneau pour promouvoir un admin par email.
      try {
        await setDoc(doc(db, 'profiles', firebaseUser.uid), { email }, { merge: true })
      } catch (error) {
        console.error('Profil non enregistre :', error)
      }

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

export function useAuth() {
  return useContext(AuthContext)
}