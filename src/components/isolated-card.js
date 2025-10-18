// Web Component isolé : utilise Shadow DOM et ses propres styles internes
class IsolatedCard extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'subtitle'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 540px;
          margin: 0.5rem 0;
          font-family: inherit;
        }
        .card {
          border: 1px solid #dee2e6;
          border-radius: 0.5rem;
          background: white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.04);
          overflow: hidden;
        }
        .card-header {
          padding: 0.75rem 1rem;
          background: linear-gradient(90deg,#f8f9fa,#ffffff);
          border-bottom: 1px solid #e9ecef;
          font-weight: 600;
        }
        .card-body {
          padding: 1rem;
        }
        .card-title {
          margin: 0 0 0.5rem;
          font-size: 1.125rem;
        }
        .card-subtitle {
          color: #6c757d;
          margin: 0 0 1rem;
          font-size: 0.95rem;
        }
        .btn {
          --btn-bg: #0d6efd;
          display: inline-block;
          padding: 0.375rem 0.75rem;
          color: white;
          background-color: var(--btn-bg);
          border-radius: 0.375rem;
          text-decoration: none;
          cursor: pointer;
        }
        .btn:active { transform: translateY(1px); }
      </style>

      <div class="card" part="card">
        <div class="card-header" part="card-header">
          <slot name="header">Composant isolé</slot>
        </div>
        <div class="card-body">
          <h3 class="card-title" id="title"></h3>
          <div class="card-subtitle" id="subtitle"></div>
          <p><slot name="content">Contenu interne du composant. Ce style est défini dans le Shadow DOM et n'est pas affecté par le CSS de la page.</slot></p>
          <a class="btn" id="action">Action</a>
        </div>
      </div>
    `;

    this._titleEl = this.shadowRoot.getElementById('title');
    this._subtitleEl = this.shadowRoot.getElementById('subtitle');
    this._action = this.shadowRoot.getElementById('action');

    this._onClick = this._onClick.bind(this);
  }

  connectedCallback() {
    this._render();
    this._action.addEventListener('click', this._onClick);
  }

  disconnectedCallback() {
    this._action.removeEventListener('click', this._onClick);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) this._render();
  }

  _render() {
    this._titleEl.textContent = this.getAttribute('title') || 'Titre par défaut';
    this._subtitleEl.textContent = this.getAttribute('subtitle') || '';
  }

  _onClick(e) {
    // Émettre un événement personnalisé pour que la page parent puisse réagir
    this.dispatchEvent(new CustomEvent('isolated-action', {
      detail: { time: Date.now() },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('isolated-card', IsolatedCard);