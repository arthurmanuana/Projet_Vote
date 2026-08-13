// Petits formatages de dates partages par tout le panneau.

export function formatWhen(timestamp) {
  if (!timestamp) return '—'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleString('fr-FR')
}

export function hourLabel(timestamp) {
  if (!timestamp) return null
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return `${date.getHours()}h`
}