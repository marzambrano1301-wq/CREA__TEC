const App = {
  page: null,

  getBasePath() {
    const path = window.location.pathname;
    const lastSlash = path.lastIndexOf('/');
    return lastSlash >= 0 ? path.substring(0, lastSlash + 1) : '/';
  },

  resolve(path) {
    return `${this.getBasePath()}${path.replace(/^\//, '')}`;
  },

  async init(page) {
    this.page = page;
    await this.loadLayout();
    this.setDate();
    this.setActiveNav();
    await this.loadPageContent();
    document.dispatchEvent(new CustomEvent('pageReady', { detail: { page } }));
  },

  async loadPartial(url, slotId) {
    const slot = document.getElementById(slotId);
    if (!slot) return;

    try {
      const response = await fetch(this.resolve(url));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      slot.innerHTML = await response.text();
    } catch (error) {
      slot.innerHTML = `<p style="padding:2rem;text-align:center;color:#8b0000;">
        Error al cargar ${url}. Abre el sitio con un servidor local (<code>npx serve .</code>) o GitHub Pages, no directamente el archivo HTML.
      </p>`;
      console.error(`No se pudo cargar ${url}:`, error);
    }
  },

  async loadLayout() {
    await Promise.all([
      this.loadPartial('components/layout/header.html', 'header-slot'),
      this.loadPartial('components/layout/footer.html', 'footer-slot')
    ]);
  },

  async loadPageContent() {
    await this.loadPartial(`components/${this.page}/${this.page}.html`, 'content-slot');
  },

  setDate() {
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      dateEl.textContent = new Date().toLocaleDateString('es-CO', options);
    }
  },

  setActiveNav() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    const pageFiles = {
      inicio: 'index.html',
      nosotros: 'nosotros.html',
      contenido: 'contenido.html',
      galeria: 'galeria.html',
      contacto: 'contacto.html'
    };

    nav.querySelectorAll('a').forEach(link => {
      const page = link.dataset.page;
      if (page && pageFiles[page]) {
        link.href = this.resolve(pageFiles[page]);
      }
      link.classList.toggle('active', page === this.page);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page) App.init(page);
});
