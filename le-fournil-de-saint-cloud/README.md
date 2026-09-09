# Le Fournil de Saint-Cloud — site vitrine (maquette)

Site vitrine one-page pour **Le Fournil de Saint-Cloud**,
19 rue du Mont Valérien, 92210 Saint-Cloud — 01 46 02 86 06.

Tout tient dans `index.html` : CSS et JavaScript sont inclus dans le fichier,
aucune dépendance à installer. Il suffit de l'ouvrir dans un navigateur, ou de
le déposer chez n'importe quel hébergeur.

Seules ressources externes : les polices Google Fonts (Cormorant Garamond +
Jost, avec polices de repli) et l'iframe Google Maps.

Identité volontairement distincte de la maquette « Au Pas de Saint Cloud » —
les deux commerces sont à quelques centaines de mètres l'un de l'autre :
ivoire et vert bouteille rehaussés de laiton (la devanture de boulangerie
parisienne), photo du hero en arche, bandeau défilant, produits en cartes
photo et galerie en bandeau horizontal.

## Remplacer les visuels

Créer un dossier `photos/` à côté de `index.html`, puis remplacer chaque bloc

```html
<div class="ph" data-tone="…"><svg …></svg></div>
```

par

```html
<img src="photos/ma-photo.jpg" alt="Description de la photo">
```

Le cadre `.media` gère le recadrage (`object-fit: cover`), les arrondis, la
forme en arche du hero et les voiles de lisibilité des cartes produits :
la photo prend automatiquement la bonne forme, quel que soit son format.

| Emplacement | Nombre |
|---|---|
| Photo du hero (arche) | 1 |
| Devanture + détail (à propos) | 2 |
| Cartes produits | 6 |
| Bandeau galerie (3 formats larges) | 8 |

Format conseillé : JPEG optimisé, 1400 px de large pour le hero et la galerie,
900 px pour les cartes produits.

## Textes et placeholders

Chaque emplacement est signalé dans le code par un commentaire du type
`<!-- [TEXTE_A_PROPOS] -->`. Les mentions légales, en pied de page,
contiennent les placeholders `[RAISON_SOCIALE]`, `[SIRET]`, `[EMAIL]`,
`[HEBERGEUR]`, etc.

## À valider avec le commerçant avant mise en ligne

- [ ] **Horaires** — seule la fermeture à 20h est confirmée par la fiche Google ;
      le reste est provisoire (à corriger aussi dans le bloc JSON-LD en bas de page)
- [ ] **Gammes de produits** présentées et textes de description
- [ ] **Témoignage** — un seul avis positif était disponible publiquement
      (Pages Jaunes). En demander 1 ou 2 autres : le bloc
      `<figure class="testimonial">` se duplique tel quel
- [ ] **Réseaux sociaux** — les liens Instagram / Facebook sont des `href="#"`
- [ ] Retirer la note de travail sous les cartes produits (`.dishes-note`)
- [ ] Retirer la mention « Maquette de présentation » en pied de page
