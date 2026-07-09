# El Audiovisual — Periódico SENA

Sitio web estilo periódico organizado por componentes.

## ⚠️ Cómo abrir correctamente

**No abras** archivos como `components/inicio/inicio.html` directamente — son **parciales** sin CSS ni JS.

Abre siempre las páginas de la **raíz**:

| Página | Archivo |
|--------|---------|
| Inicio | `index.html` |
| Nosotros | `nosotros.html` |
| Contenido | `contenido.html` |
| Galería | `galeria.html` |
| Contacto | `contacto.html` |

## Probar localmente

```bash
npx serve .
```

Luego abre: **http://localhost:3000/index.html**

## Estructura

```
index.html, contacto.html...   ← páginas principales (con CSS/JS)
components/
├── layout/     → header, footer, estilos base
├── inicio/     → inicio.html, inicio.css, inicio.js
├── nosotros/
├── contenido/
├── galeria/
└── contacto/
```

## GitHub Pages

1. Sube el repo a GitHub
2. **Settings → Pages → GitHub Actions** (workflow incluido)
3. URL: `https://TU-USUARIO.github.io/NOMBRE-REPO/`
