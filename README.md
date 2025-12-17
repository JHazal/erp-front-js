## ERP Frontend

Ce frontend sert à :

- Afficher l’interface des tuiles ERP.
- Récupérer automatiquement l’utilisateur connecté via `/currentUser`.
- Lancer les applications natives via le backend `.NET`.

---

## **Prérequis**

1. Un navigateur moderne (Chrome, Edge, Firefox).
2. Le backend `.NET` doit être en fonctionnement sur `http://localhost:5000`.
3. Tous les fichiers JS et images doivent être accessibles depuis le même dossier.

---

## **Installation**

1. Créer un dossier pour le frontend (ex: `erp-frontend`)
2. Copier les fichiers suivants :
   - `index.html`
   - `erp.js`
   - Les images référencées dans `tblInfoTuile`
3. La structure recommandée :

```
erp-frontend/
 ├─ index.html
 ├─ erp.js
 └─img/
      └─ test2.png

```

---

## **Lancer le frontend**

- Ouvrir le fichier `index.html` directement dans le navigateur.
- Le frontend fera automatiquement une requête GET sur `http://localhost:5000/currentUser` pour récupérer l’utilisateur.
- Les tuiles seront générées dynamiquement.
- Cliquer sur une tuile envoie une requête POST au backend pour lancer l’application correspondante.

---

## **Notes importantes**

- Le frontend **ne nécessite pas de serveur web** si ouvert directement via `file://` (mais CORS peut bloquer dans certains navigateurs, donc préférable d’ouvrir via un petit serveur local comme `Live Server` sur VS Code).
- Les droits d’accès aux tuiles sont gérés côté JS :
  - `"tous"` → tout le monde peut accéder
  - Liste d’initiales → seuls certains utilisateurs peuvent accéder
- Assurez-vous que les chemins des applications dans `tblInfoTuile` correspondent à l’installation réelle sur le serveur RDP.
