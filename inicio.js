const STORAGE_KEY = 'el-audiovisual-posts';

function getPosts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function formatDate(dateStr) {
  if (!dateStr) return new Date().toLocaleDateString('es-CO');
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function createPostElement(post, index) {
  const article = document.createElement('article');
  article.className = 'article post-card';
  article.innerHTML = `
    <div class="article-meta">
      <span class="tag">${post.category}</span>
      <span class="author">${escapeHtml(post.author)}</span>
      · ${formatDate(post.date)}
    </div>
    <h3 class="article-title">${escapeHtml(post.title)}</h3>
    <div class="article-body">
      <p>${escapeHtml(post.body)}</p>
    </div>
    <button class="btn btn-danger delete-btn" data-index="${index}">Eliminar</button>
  `;
  return article;
}

function renderPosts() {
  const container = document.getElementById('user-posts');
  if (!container) return;

  const posts = getPosts();
  container.querySelectorAll('.post-card, .empty-state').forEach(el => el.remove());

  if (posts.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Aún no hay publicaciones. ¡Sé el primero en escribir una noticia!';
    container.appendChild(empty);
    return;
  }

  posts.slice().reverse().forEach((post, displayIndex) => {
    const realIndex = posts.length - 1 - displayIndex;
    container.appendChild(createPostElement(post, realIndex));
  });

  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      const updated = getPosts();
      updated.splice(idx, 1);
      savePosts(updated);
      renderPosts();
    });
  });
}

function initInicio() {
  const toggleBtn = document.getElementById('toggle-publish');
  const form = document.getElementById('publish-form');
  const cancelBtn = document.getElementById('cancel-publish');
  const dateInput = document.getElementById('post-date');

  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  if (toggleBtn && form) {
    toggleBtn.addEventListener('click', () => {
      form.classList.toggle('visible');
      toggleBtn.textContent = form.classList.contains('visible') ? '✕ Cerrar formulario' : '+ Nueva publicación';
    });
  }

  if (cancelBtn && form && toggleBtn) {
    cancelBtn.addEventListener('click', () => {
      form.reset();
      form.classList.remove('visible');
      toggleBtn.textContent = '+ Nueva publicación';
      if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const post = {
        id: Date.now(),
        title: document.getElementById('post-title').value.trim(),
        category: document.getElementById('post-category').value,
        author: document.getElementById('post-author').value.trim(),
        date: document.getElementById('post-date').value,
        body: document.getElementById('post-body').value.trim()
      };

      const posts = getPosts();
      posts.push(post);
      savePosts(posts);

      form.reset();
      form.classList.remove('visible');
      if (toggleBtn) toggleBtn.textContent = '+ Nueva publicación';
      if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

      renderPosts();
    });
  }

  renderPosts();
}

document.addEventListener('pageReady', (e) => {
  if (e.detail.page === 'inicio') initInicio();
});
