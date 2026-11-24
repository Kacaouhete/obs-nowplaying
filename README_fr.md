# 🎵 Apple Music Now Playing pour OBS

Un widget « now playing » pour afficher sur ton stream la musique jouée dans **Apple Music** (macOS) : titre, artiste, pochette, barre de progression et état lecture / pause.

Un seul fichier, **aucune dépendance** : un petit serveur Node lit Apple Music via AppleScript et sert une page HTML que tu ajoutes comme *Source navigateur* dans OBS.

## Prérequis

- macOS
- Apple Music (l'app « Musique »)
- [Node.js](https://nodejs.org) (version LTS)
- OBS Studio

## Installation

1. Installe Node.js :
   ```bash
   brew install node
   ```
   Sur Mac Apple Silicon, si Homebrew affiche une erreur Rosetta, utilise :
   ```bash
   arch -arm64 brew install node
   ```
   Tu peux aussi télécharger l'installeur sur [nodejs.org](https://nodejs.org).

2. Récupère le projet :
   ```bash
   git clone https://github.com/Kacaouhete/obs-nowplaying.git
   cd obs-nowplaying
   ```
   Ou télécharge simplement `nowplaying.js` et place-le dans un dossier.

3. Lance le serveur :
   ```bash
   node nowplaying.js
   ```
   Tu dois voir `OK → http://localhost:3939`. Laisse la fenêtre du Terminal ouverte pendant ton stream.

4. Au premier lancement, macOS demande l'autorisation « Terminal souhaite contrôler Musique ». Clique sur **OK**.

## Ajouter le widget dans OBS

1. Dans OBS : **Sources → + → Navigateur**
2. URL : `http://localhost:3939`
3. Largeur : `500`, hauteur : `120` (à ajuster)
4. Valide.

Pour tester sans OBS, ouvre `http://localhost:3939` dans ton navigateur pendant qu'un morceau joue.

## Fonctionnement

- Le widget s'affiche dès qu'un morceau est chargé dans Apple Music.
- En pause, il reste affiché avec l'icône ⏸ et la barre figée.
- Il disparaît en fondu quand la lecture est arrêtée.
- Les données sont mises à jour toutes les 2 secondes, et la barre de progression avance de façon fluide entre deux mises à jour.

## Personnalisation

Tout se trouve dans `nowplaying.js` :

| Quoi | Où |
|---|---|
| Couleurs, polices, tailles, arrondis | bloc `<style>` dans la constante `HTML` |
| Port du serveur | constante `PORT` en haut du fichier |
| Icônes lecture / pause | fonction `draw()` dans la constante `HTML` |

Après une modification : relance le script (`Ctrl+C` puis `node nowplaying.js`), puis dans OBS, clic droit sur la source → **Propriétés → Rafraîchir le cache de la page actuelle**.

## Dépannage

**Rien ne s'affiche**
Vérifie l'autorisation : Réglages Système → Confidentialité et sécurité → Automatisation → coche **Musique** sous **Terminal**.

**La pochette reste grise**
Certains titres en streaming n'exposent pas leur pochette via AppleScript. Le texte s'affiche normalement.

**`EADDRINUSE` au lancement**
Le port est déjà utilisé. Change `PORT` dans le fichier (par exemple `3940`) et mets la même valeur dans l'URL d'OBS.

**Le widget n'est pas à jour dans OBS**
Rafraîchis le cache de la source navigateur (voir plus haut).

**La barre de progression ne bouge pas**
Vérifie que le morceau est bien en lecture et que le script tourne toujours dans le Terminal.

## Lancer automatiquement (optionnel)

Pour éviter d'ouvrir le Terminal à chaque stream, tu peux créer un raccourci ou un lanceur qui exécute `node /chemin/vers/nowplaying.js`.

## Licence

À compléter (par exemple MIT).
