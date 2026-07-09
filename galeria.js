const GALLERY_KEY = 'el-audiovisual-gallery';

function getGalleryItems() {
  try {
    return JSON.parse(localStorage.getItem(GALLERY_KEY)) || [];
  } catch {
    return [];
  }
}

function saveGalleryItems(items) {
  localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
}

function renderGallery() {
  const container = document.getElementById('user-gallery');
  if (!container) return;

  const items = getGalleryItems();
  container.innerHTML = '';

  items.slice().reverse().forEach((item, displayIndex) => {
    const realIndex = items.length - 1 - displayIndex;
    const figure = document.createElement('figure');
    figure.className = 'gallery-item';
    figure.innerHTML = `
      <img src="${item.url}" alt="${item.caption}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Imagen+no+disponible'">
      <figcaption>${item.category} — ${item.caption}</figcaption>
      <button class="btn btn-danger delete-btn" data-index="${realIndex}">Eliminar</button>
    `;
    container.appendChild(figure);
  });

  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      const updated = getGalleryItems();
      updated.splice(idx, 1);
      saveGalleryItems(updated);
      renderGallery();
    });
  });
}

function initGaleria() {
  const form = document.getElementById('gallery-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const item = {
      id: Date.now(),
      url: document.getElementById('gallery-url').value.trim(),
      caption: document.getElementById('gallery-caption').value.trim(),
      category: document.getElementById('gallery-category').value
    };

    const items = getGalleryItems();
    items.push(item);
    saveGalleryItems(items);

    form.reset();
    renderGallery();
  });

  renderGallery();
}

document.addEventListener('pageReady', (e) => {
  if (e.detail.page === 'galeria') initGaleria();
});
