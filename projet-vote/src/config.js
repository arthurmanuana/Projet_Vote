// -----------------------------------------------------
// Le pupitre de commande du projet.
// Tout ce qui peut changer un jour vit ici, et seulement ici.
// Si les contraintes de filtre changent, c'est le seul fichier a ouvrir.
// -----------------------------------------------------

// Le domaine de l'universite. Tout le reste (emails etudiants,
// emails staff) est deduit automatiquement a partir de lui.
export const UNIVERSITY_DOMAIN = 'ulc-icam.com'

// Les annees d'admission acceptees. Un email en @2014. ou @2041.
// sera refuse. Il suffit de changer ces valeurs pour etendre ou reduire la periode.
export const YEAR_MIN = 2015
export const YEAR_MAX = 2040

// Les deux interrupteurs.
// true = le staff peut entrer dans l'application
export const STAFF_CAN_LOGIN = true

// true = le staff peut voter.
// Le jour ou on te dit "le staff ne vote pas", cette ligne
// passe a false, et c'est tout. Une ligne.
export const STAFF_CAN_VOTE = true

// Nom du projet affiché ici
export const APP_NAME = 'Projet VOTE ULC'