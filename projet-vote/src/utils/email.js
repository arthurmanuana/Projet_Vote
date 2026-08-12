import { UNIVERSITY_DOMAIN, YEAR_MIN, YEAR_MAX } from '../config'

// Google est genereux mais on ne parie jamais : on nettoie
// (pas d'espaces, tout en minuscules) avant toute comparaison.
export function normalizeEmail(email) {
  return (email || '').trim().toLowerCase()
}

// Detail technique inevitable : dans une regex, un point veut dire
// "n'importe quel caractere". Pour chercher de vrais points comme
// ceux du domaine, il faut les "escaper".
function domainForRegex() {
  return UNIVERSITY_DOMAIN.replace(/\./g, '\\.')
}

// Email etudiant : quelque-chose@2029.ulc-icam.com
// On verifie deux choses : la forme de l'email, puis que l'annee
// tombe bien dans la plage autorisee par la config.
export function isStudentEmail(email) {
  const pattern = new RegExp(`^[a-z0-9._-]+@(20\\d{2})\\.${domainForRegex()}$`)
  const result = pattern.exec(normalizeEmail(email))
  if (!result) return false

  const year = Number(result[1])
  return year >= YEAR_MIN && year <= YEAR_MAX
}

// Email staff : quelque-chose@ulc-icam.com (sans annee)
export function isStaffEmail(email) {
  const pattern = new RegExp(`^[a-z0-9._-]+@${domainForRegex()}$`)
  return pattern.test(normalizeEmail(email))
}