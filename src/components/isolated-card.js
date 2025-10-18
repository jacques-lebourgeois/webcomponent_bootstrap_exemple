// Web Component isolé : injection de Boosted 5.3.7 dans le Shadow DOM
class IsolatedCard extends HTMLElement {
  static _boostedCss = null; // cache partagé sur la page

  static async _loadBoostedCss() {
    if (IsolatedCard._boostedCss) return IsolatedCard._boostedCss;

    const url = 'https://cdn.jsdelivr.net/npm/@orange-opensource/boosted@5.3.7/dist/css/boosted.min.css';
    const res = await fetch(url, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`Impossible de charger Boosted CSS (${res.status})`);
    IsolatedCard._boostedCss = await res.text();
    return IsolatedCard._boostedCss;
  }

  static get observedAttributes() {
    return ['title', 'subtitle'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // conteneur temporaire pendant le chargement
    this._container = document.createElement('div');
    this._container.innerHTML = `<div class="loading">Chargement du composant...</div>`;
    this.shadowRoot.appendChild(this._container);

    this._onClick = this._onClick.bind(this);

    // initialisation asynchrone (ne pas bloquer le constructeur)
    this._init();
  }

  async _init() {
    const componentCss = `
      :host {
        display: block;
        max-width: 540px;
        margin: 0.5rem 0;
        font-family: inherit;
      }
      /* petits ajustements locaux supplémentaires */
      .card {
        border-radius: 0.5rem;
        overflow: hidden;
      }
      /* bouton local (si besoin d'override) */
      .btn--local {
        --btn-bg: #0d6efd;
        color: #fff;
      }
    `;

    try {
      const boostedCss = await IsolatedCard._loadBoostedCss();
      // Si le navigateur supporte adoptedStyleSheets pour shadow root
      if (this.shadowRoot.adoptedStyleSheets !== undefined && typeof CSSStyleSheet !== 'undefined') {
        try {
          const sheet = new CSSStyleSheet();
          // Try synchronous replace first (may throw in some contexts), fallback to async replace
          try {
            sheet.replaceSync(boostedCss + componentCss);
          } catch (e) {
            await sheet.replace(boostedCss + componentCss);
          }
          this.shadowRoot.adoptedStyleSheets = [sheet];
          // Injecter uniquement le template HTML dans le container
          this._container.innerHTML = this._templateHtml();
        } catch (err) {
          // fallback si adoptedStyleSheets rencontre un problème
          this.shadowRoot.innerHTML = `<style>${boostedCss}${componentCss}</style>` + this._templateHtml();
        }
      } else {
        // fallback simple : injecter <style> avec le CSS complet
        this.shadowRoot.innerHTML = `<style>${boostedCss}${componentCss}</style>` + this._templateHtml();
      }
    } catch (err) {
      // Si la récupération de Boosted échoue : afficher le composant avec styles locaux uniquement
      console.warn('Chargement de Boosted échoué, rendu avec styles locaux :', err);
      this.shadowRoot.innerHTML = `<style>${componentCss}</style>` + this._templateHtml();
    }

    // références et événements
    this._titleEl = this.shadowRoot.getElementById('title');
    this._subtitleEl = this.shadowRoot.getElementById('subtitle');
    this._action = this.shadowRoot.getElementById('action');

    if (this._action) this._action.addEventListener('click', this._onClick);
    this._render();
  }

  disconnectedCallback() {
    if (this._action) this._action.removeEventListener('click', this._onClick);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) this._render();
  }

  _templateHtml() {
    // Utilise des classes Boosted (card, btn, etc.) — elles seront valides car Boosted CSS a été injecté
    return `
      <div class="card" part="card">
        <div class="card-header" part="card-header">
          <slot name="header">Composant isolé</slot>
        </div>
        <div class="card-body">
          <h3 class="card-title" id="title"></h3>
          <div class="card-subtitle" id="subtitle"></div>
          <p><slot name="content">Contenu interne du composant. Les styles Boosted sont injectés dans le Shadow DOM.</slot></p>
          <button class="btn btn-primary btn--local" id="action" type="button">Action</button>
        </div>
      </div>
    `;
  }

  _render() {
    if (this._titleEl) this._titleEl.textContent = this.getAttribute('title') || 'Titre par défaut';
    if (this._subtitleEl) this._subtitleEl.textContent = this.getAttribute('subtitle') || '';
  }

  _onClick() {
    this.dispatchEvent(new CustomEvent('isolated-action', {
      detail: { time: Date.now() },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('isolated-card', IsolatedCard);