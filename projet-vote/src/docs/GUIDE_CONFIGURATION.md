# Guide de configuration - Projet VOTE

Toute la customisation se passe dans `src/config.js`.
Apres chaque changement : enregistrer, et Vite recharge tout seul.

## Les interrupteurs

| Interrupteur | Role | Defaut |
|---|---|---|
| `STAFF_CAN_LOGIN` | Le staff peut entrer dans l'app | true |
| `STAFF_CAN_VOTE` | Le staff peut voter | true |
| `YEAR_MIN` / `YEAR_MAX` | Annees d'admission acceptees | 2015 / 2040 |

Scenario "le staff ne vote pas" : passer `STAFF_CAN_VOTE` a `false`. Une ligne.

## Checklist de tests (a rejouer apres chaque changement de config)

| Test | Manipulation | Attendu |
|---|---|---|
| 1 | Connexion email etudiant (@2029.ulc-icam.com) | Atterrit sur /vote |
| 2 | Connexion staff (@ulc-icam.com), STAFF_CAN_VOTE=true | Atterrit sur /vote |
| 3 | Connexion staff, STAFF_CAN_VOTE=false | Atterrit sur /no-vote avec message |
| 4 | Connexion staff, STAFF_CAN_LOGIN=false | Refuse, page /unauthorized |
| 5 | Connexion Gmail admin | Atterrit sur /admin directement |
| 6 | Connexion Gmail lambda | Refuse, page /unauthorized avec message pedagogique |
| 7 | Etudiant aussi dans admins | /vote + bouton Panneau admin visible |
| 8 | Rechargement de page en etant connecte | Session restauree, pas de re-login |

Les tests staff (2, 3, 4) necessitent un vrai compte staff ou un compte
de test : a jouer le jour ou un compte staff est disponible.