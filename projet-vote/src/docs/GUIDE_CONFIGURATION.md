# Guide de configuration — Projet VOTE ULC

Toute la customisation vit dans `src/config.js` (cote client) et dans
les regles Firestore (cote serveur). Les deux cotes sont jumeaux :
ils doivent toujours dire la meme chose.

## 1. Interrupteurs cote client (src/config.js)

| Interrupteur | Role | Defaut |
|---|---|---|
| `UNIVERSITY_DOMAIN` | Domaine de l'universite | ulc-icam.com |
| `YEAR_MIN` / `YEAR_MAX` | Annees d'admission acceptees | 2015 / 2040 |
| `STAFF_CAN_LOGIN` | Le staff peut entrer dans l'app | true |
| `STAFF_CAN_VOTE` | Le staff peut voter | true |

Scenario "le staff ne vote plus" : passer `STAFF_CAN_VOTE` a false
dans `config.js`, ET `staffCanVote()` a false dans les regles Firestore.
Une ligne de chaque cote, puis rejouer les tests 4 et 5 ci-dessous.

## 2. Cote serveur (regles Firestore)

Memes fonctions : `isStudent()`, `isStaff()`, `staffCanVote()`,
`staffCanLogin()`. Toute modification client doit etre miroiree ici.

## 3. L'election (Firestore, document config/election)

| Champ | Role |
|---|---|
| `title` | Titre affiche partout |
| `isOpen` | Interrupteur ouvert/clos (panneau admin) |
| `expectedVoters` | Effectif attendu (taux de participation) |

## 4. Admins (collection admins, clee par UID)

- Promotion depuis le panneau : la personne doit avoir tente une
  connexion au moins une fois (annuaire profiles).
- Garde-fous : jamais se retirer soi-meme, jamais le dernier admin.
- Amorçage du tout premier admin : document cle par UID, cree en console.

## 5. Table rase

Panneau > carte basse de la sidebar > Table rase (deux confirmations).
Supprime voters et votes ; garde candidats, config, admins.

## 6. Checklist de non-regression (apres chaque changement)

| # | Manipulation | Attendu |
|---|---|---|
| 1 | Connexion etudiant | Page de vote, candidats affiches |
| 2 | Voter | Toast vert, documents voters + votes |
| 3 | Revoter | Impossible (etat deja vote) |
| 4 | Staff avec STAFF_CAN_VOTE=true | Peut voter |
| 5 | Staff avec STAFF_CAN_VOTE=false (deux cotes) | Entre, message /no-vote |
| 6 | Gmail lambda | Refuse, message clair sur la page de connexion |
| 7 | Admin Gmail | Panneau dashboard |
| 8 | Fermer le vote | Cote etudiant bascule sur "clos" en temps reel |
| 9 | Table rase | Tout le monde peut revoter |