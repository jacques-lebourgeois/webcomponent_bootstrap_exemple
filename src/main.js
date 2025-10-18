// point d'entrée : enregistre et utilise le web component isolé
import './components/isolated-card.js';

// exemple : interagir avec le composant depuis la page (optionnel)
const comp = document.querySelector('isolated-card');
if (comp) {
  // démonstration : mettre à jour le contenu après 2s
  setTimeout(() => {
    comp.setAttribute('subtitle', 'Sous-titre mis à jour depuis la page principale');
  }, 2000);
}