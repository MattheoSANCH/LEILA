# Sites vitrines — Boulangeries de Saint-Cloud (92210)

Quatre maquettes de démonstration prêtes à présenter, une par prospect.
Chaque site est **un fichier HTML autonome** (CSS/JS inclus, aucune dépendance
hors Google Fonts) : il suffit d'ouvrir `index.html` dans un navigateur, ou de
déployer le dossier tel quel.

> `index.html` à la racine de ce dossier = page d'index interne pour naviguer
> entre les 4 démos (à ne PAS mettre en ligne chez un client).

## Les 4 prospects

| Site | Dossier | Note Google | Différenciateur mis en avant |
|---|---|---|---|
| Au Pas de Saint Cloud | `au-pas-de-saint-cloud/` | 3,5/5 (446 avis) | Institution de la place · traiteur & gâteaux sur commande |
| Le Fournil de Saint-Cloud | `le-fournil-de-saint-cloud/` | 4,0/5 (115 avis) | **Ouvert le dimanche matin** · pain cuit matin et après-midi |
| La Boulangerie d'Odile | `la-boulangerie-d-odile/` | **4,7/5** (157 avis) | Levain naturel, farines meulées · salon de thé · Instagram réel |
| Le Moulin de Buzenval | `le-moulin-de-buzenval/` | 4,1/5 (143 avis) | **Ouvert 7j/7** · ingrédients bio / bien-être animal |

Chaque site a une identité visuelle distincte (palette, typographies, mise en
page) pour éviter l'effet « template » si deux commerçants comparent.

## Ce qui est RÉEL (vérifié sur annuaires + fiches Google, sept. 2026)

- **Noms, adresses, téléphones (NAP)** — à re-vérifier à la lettre contre la
  fiche Google Business de chaque client avant mise en ligne (SEO local).
- **Horaires** :
  - Au Pas de Saint Cloud : lun–sam 6h30–20h, dim fermé
  - Le Fournil : lun–sam 7h30–13h30 / 15h–20h (⚠️ 20h30 selon certains
    annuaires), dim 8h–14h
  - Odile : lun–ven 7h–14h30 / 16h–20h (⚠️ 16h30 selon une source), sam
    7h30–13h30, dim fermé (stand au marché — lequel ? à préciser)
  - Moulin de Buzenval : 7j/7, 7h–20h
- **Avis clients** : uniquement des extraits d'avis réellement publiés
  (Google / Pages Jaunes), cités avec attribution. Aucun avis inventé.
- **Faits maison** : Odile Canet / Coteaux / levain / meule de pierre Val
  d'Oise / salon de thé (source : article de la ville de Saint-Cloud) ;
  traiteur (Au Pas) ; positionnement bio / bien-être animal (Moulin, repris de
  leur propre description annuaire) ; croissant à 1,60 € (Au Pas, relevé dans
  un avis).
- **Instagram d'Odile** : [@la_boulangerie_dodile](https://www.instagram.com/la_boulangerie_dodile/)

## Ce qui est PLACEHOLDER (à remplir avec chaque client)

Tous les emplacements sont balisés par des commentaires HTML `[EN_CAPITALES]`
dans le code — chercher `[` dans chaque fichier pour la liste complète.

1. **Photos** — toutes les images sont des illustrations SVG de substitution
   (tons chauds, jamais de gris terne). Emplacements : `[PHOTO_HERO]`,
   `[PHOTO_EQUIPE]`, `[PHOTOS_PRODUITS]`, `[PHOTOS_GALERIE]`.
2. **Prix** — indicatifs partout (mention « prix indicatifs » visible sur le
   site), sauf le croissant d'Au Pas (1,60 €, relevé).
3. **Textes « Notre histoire » et slogans** — propositions à réécrire avec les
   mots du commerçant.
4. **Mentions légales** — SIRET, forme juridique, gérant, hébergeur.
5. **Réseaux sociaux** — seul l'Instagram d'Odile a été trouvé.

## Points légaux intégrés (France)

- **Allergènes** : mention visible dans chaque section produits (« liste
  disponible en boutique et sur demande »). Si un module click & collect est
  ajouté en V2, chaque fiche produit devra lister ses allergènes.
- **« Pain de tradition française »** : appellation volontairement évitée
  (décret n°93-1074) — ne l'ajouter que si le client confirme la conformité.
  Chez Odile, « tradition sur levain » est repris de l'article municipal, avec
  commentaire de vérification dans le code.
- **Prix** : affichage des tarifs par grande catégorie + renvoi à l'affichage
  en boutique.
- **Logo AB** : ne pas l'ajouter chez le Moulin sans certification vérifiée.

## Technique

- SEO local : title/description « métier + ville », OG tags, **JSON-LD
  schema.org type `Bakery`** avec NAP + horaires réels.
- Mobile-first, responsive, menu burger, statut « Ouvert · ferme à 20h00 »
  calculé en JS depuis les horaires réels (config `HORAIRES` en bas de chaque
  fichier — garder synchronisée avec le tableau HTML).
- Accessibilité : skip-link, aria, focus visible, `prefers-reduced-motion`,
  fallback `noscript` pour les animations.
- Liens 100 % fonctionnels : ancres, `tel:`, itinéraire + carte Google Maps
  embarquée (iframe sans clé API).
- Click & collect : non inclus en V1 (optionnel) — emplacement commenté
  `[OPTIONNEL — V2]` dans chaque fichier, CTA téléphone en attendant.

## Étapes suivantes par client (checklist rendez-vous)

- [ ] Valider la forme exacte du NAP contre la fiche Google Business
- [ ] Trancher les horaires ambigus (Fournil 20h/20h30 · Odile 16h/16h30)
- [ ] Récupérer 8 à 12 photos (vitrine, équipe, produits en gros plan)
- [ ] Faire raconter l'histoire de la maison (dates, prénoms, fierté)
- [ ] Relever la vraie carte des prix
- [ ] SIRET + infos mentions légales
- [ ] Confirmer décret « tradition » / certification bio le cas échéant
- [ ] Choisir le nom de domaine et l'hébergement
- [ ] Option : click & collect en V2
