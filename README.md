# Stencil + Bootstrap multi-version example

But : page principale utilise Bootstrap 5.2.0, web component utilise Bootstrap 5.3.8 pour Dropdown & Popover (isolé dans Shadow DOM).

Installation
1. npm install
   - postinstall copie automatiquement le CSS bootstrap 5.3.8 vers src/components/my-bootstrap/bootstrap.css
2. npm start
   - démarre le serveur de développement Stencil (build/watch/serve).
3. Ouvre http://localhost:3333 (par défaut) pour voir la page.

Notes importantes
- La page principale charge Bootstrap 5.2.0 via CDN (CSS + JS).
- Le composant <my-bootstrap> utilise Shadow DOM. Le CSS de bootstrap 5.3.8 est injecté dans le shadow root via styleUrl (copié par postinstall).
- Le JS de bootstrap 5.3.8 est importé via import('bootstrap538/dist/js/bootstrap.esm.js') et les composants sont instanciés manuellement (new Dropdown / new Popover) dans componentDidLoad.
- Limitations : certains composants de Bootstrap (modal, backdrop, offcanvas) injectent des éléments dans document.body ; si tu veux tout garder absolument encapsulé, tu devras implémenter ces interactions en natif dans le composant ou créer un portail spécial.

Si tu veux, je peux :
- remplacer la copie postinstall par un import direct CSS via constructable stylesheet (adoptedStyleSheets) pour un exemple plus avancé,
- réduire le CSS embarqué en compilant une version SCSS minimaliste contenant seulement les classes nécessaires,
- ou générer un repo GitHub prêt à cloner avec ce setup.