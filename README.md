# Boosted + Web Component isolé (exemple)

Projet minimal montrant :
- une page d'accueil utilisant Boosted 5.2.0 (CDN)
- un Web Component encapsulé via Shadow DOM (styles isolés de la page)

Installation et exécution :
```bash
npm install
npm run dev
# ouvrir http://localhost:5173
```

Notes :
- Le composant `isolated-card` est complètement isolé (Shadow DOM). Le CSS Boosted chargé dans la page n'affecte pas les styles internes du composant.
- Si tu veux utiliser des styles Boosted à l'intérieur du composant, il faut soit importer les parties de CSS nécessaires dans le <style> du shadow root (copier/packer), soit utiliser CSS custom properties / parts exposés par le composant parent.
- Pour remplacer Boosted par Bootstrap, change les liens CDN dans `index.html`.