# Au Pas de Saint Cloud — site vitrine (maquette)

Site vitrine one-page pour la boulangerie **Au Pas de Saint Cloud**,
4 place du Passage de Saint-Cloud, 92210 Saint-Cloud — 01 49 11 12 63.

Tout tient dans `index.html` : CSS et JavaScript sont inclus dans le fichier,
aucune dépendance à installer. Il suffit de l'ouvrir dans un navigateur, ou de
le déposer chez n'importe quel hébergeur.

Seules ressources externes : les polices Google Fonts (Fraunces + Karla, avec
polices de repli si le chargement échoue) et l'iframe Google Maps.

## Remplacer les visuels

Créer un dossier `photos/` à côté de `index.html`, puis :

| Emplacement | Où intervenir |
|---|---|
| Photo du hero | variable `--hero-photo` dans le CSS : `url('photos/hero.jpg')` — une seule ligne |
| Photo de l'équipe | section `À PROPOS`, remplacer le bloc `<div class="ph">…</div>` par `<img src="photos/equipe.jpg" alt="…">` |
| Photos produits (×6) | section `PRODUITS`, même principe |
| Photos galerie (×8) | section `GALERIE`, même principe |
| Logo / favicon | balise `<link rel="icon">` et bloc `.brand` du header |

Le cadre `.media` gère le recadrage (`object-fit: cover`) et les arrondis :
la photo prend automatiquement la bonne forme, quel que soit son format.

Format conseillé : JPEG optimisé, largeur 1600 px pour le hero, 900 px pour les
vignettes produits et galerie.

## Textes et placeholders

Chaque emplacement est signalé dans le code par un commentaire du type
`<!-- [TEXTE_A_PROPOS] -->`. Les mentions légales, en pied de page,
contiennent les placeholders `[RAISON_SOCIALE]`, `[SIRET]`, `[EMAIL]`,
`[HEBERGEUR]`, etc.

## À valider avec le commerçant avant mise en ligne

- [ ] **Horaires** — seule la fermeture à 20h est confirmée par la fiche Google ;
      le reste est provisoire (à corriger aussi dans le bloc JSON-LD en bas de page)
- [ ] **Gammes de produits** présentées et textes de description
- [ ] **Avis clients** — extraits repris de la fiche Google, à faire valider
- [ ] **Réseaux sociaux** — les liens Instagram / Facebook sont des `href="#"`
- [ ] Retirer la note de travail sous la grille produits (`.products-note`)
- [ ] Retirer la mention « Maquette de présentation » en pied de page
