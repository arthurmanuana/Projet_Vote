// Le petit aiguilleur du projet : a partir d'un profil, il dit
// sur quelle page la personne doit atterrir naturellement.
export function homeRoute(profile) {
  if (!profile) return '/'
  if (profile.canVote) return '/vote'     // etudiant, ou staff avec droit de vote
  if (profile.canAdmin) return '/admin'   // admin qui ne vote pas : sa maison, c'est le panneau
  return '/no-vote'                       // peut entrer, mais ne vote pas
}