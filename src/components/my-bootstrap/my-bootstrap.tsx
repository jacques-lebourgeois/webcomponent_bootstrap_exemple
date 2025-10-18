import { Component, h, Element } from '@stencil/core';

@Component({
  tag: 'my-bootstrap',
  styleUrl: 'bootstrap.css', // bootstrap 5.3.8 CSS will be copied here by postinstall
  shadow: true
})
export class MyBootstrap {
  @Element() el!: HTMLElement;

  async componentDidLoad() {
    // Importer le bundle ESM de bootstrap 5.3.8 installé sous l'alias bootstrap538
    // Le script postinstall a copié le CSS dans styleUrl pour l'injection dans le shadowRoot.
    const bs = await import('bootstrap538/dist/js/bootstrap.esm.js');

    const root = this.el.shadowRoot as ShadowRoot;

    // Initialiser les dropdowns présents dans le shadow root
    root.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
      // @ts-ignore
      new bs.Dropdown(toggle);
    });

    // Initialiser les popovers
    root.querySelectorAll('[data-bs-toggle="popover"]').forEach((el) => {
      // @ts-ignore
      new bs.Popover(el, {
        container: root // tenter d'attacher le popover dans le shadow root (peut varier selon Popper)
      });
    });
  }

  render() {
    return (
      <div class="p-3">
        <h4>Composant isolé — Bootstrap 5.3.8 (Dropdown & Popover)</h4>

        <div class="mb-3">
          <div class="dropdown">
            <button class="btn btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown">
              Dropdown (dans le shadow DOM)
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Action 1</a></li>
              <li><a class="dropdown-item" href="#">Action 2</a></li>
            </ul>
          </div>
        </div>

        <div>
          <button type="button" class="btn btn-outline-primary" data-bs-toggle="popover" title="Titre"
            data-bs-content="Contenu du popover généré dans le shadow DOM">
            Popover (dans le shadow DOM)
          </button>
        </div>
      </div>
    );
  }
}