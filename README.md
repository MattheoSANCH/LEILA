# EYE CENTER Mexicali

Sitio vitrina de la clínica de oftalmología EYE CENTER Mexicali, con panel de
contenido en `/admin/` (Decap CMS) para que la clínica edite textos y fotos sin
tocar código.

El sitio publicado sigue siendo HTML, CSS y JavaScript estáticos, sin
dependencias en el navegador salvo Google Fonts. Eleventy solo interviene en el
momento del build: inyecta el contenido en las páginas y desaparece. Por eso el
texto viaja en el código fuente y el sitio funciona con JavaScript desactivado.

---

## Puesta en marcha (una sola vez)

El panel usa **Netlify Identity + Git Gateway**, que solo funcionan si el sitio
de Netlify está **conectado a este repositorio de GitHub**. Un sitio creado
arrastrando un ZIP no sirve: no tiene repositorio detrás y Decap no tendría
dónde guardar.

### 1. Conectar el sitio a GitHub

En Netlify: **Add new site → Import an existing project → GitHub**, elegir este
repositorio, y dejar que `netlify.toml` fije el build (`npm run build`,
publicación en `_site`).

**Comprobar la rama.** Netlify publica una rama concreta; `src/admin/config.yml`
tiene que apuntar exactamente a la misma en `backend.branch`. Si no coinciden,
el editor guarda, ve «publicado» y no cambia nada en el sitio. Es el fallo más
frecuente y no aparece ningún error.

### 2. Activar Netlify Identity

**Site configuration → Identity → Enable Identity.**

En **Registration**, poner **Invite only**: si se deja abierto, cualquiera puede
registrarse y editar el sitio de la clínica.

### 3. Activar Git Gateway

**Site configuration → Identity → Services → Git Gateway → Enable.**
Es el puente que deja a Decap escribir en GitHub en nombre de quien edita, sin
darle a esa persona una cuenta de GitHub.

### 4. Invitar a la clínica

**Identity → Invite users**, con su correo. Recibe un enlace, elige contraseña y
ya entra en `https://<dominio>/admin/`.

El enlace de invitación llega a la raíz del sitio con un token en la URL; una
línea de JavaScript en el `<head>` lo reenvía a `/admin/`. Así ninguna página
pública carga el script de identidad y los pacientes no pagan ese peso.

---

## Qué se puede editar desde `/admin/`

| Sección del panel | Qué contiene |
|---|---|
| Página de Inicio | Presentación, historia, los 3 bloques destacados, fotos de portada |
| Oftalmólogos | Nombre, especialidades, biografía, cédulas, formación, retrato, PDF del currículum |
| Óptica · Monturas | Introducción, aviso y las fichas de monturas (foto, nombre, marca, precio) |
| Contacto | Teléfonos, correo, dirección, Facebook |
| Fotos de los tratamientos | Una imagen por especialidad |

Al guardar, Decap hace un commit, Netlify reconstruye y el cambio aparece en un
par de minutos.

### Cosas que el panel hace solo

- **Los enlaces `tel:`.** Se escribe el número como se quiere ver
  (`686.555.6060`) y el enlace en formato internacional se deduce. Nunca queda
  mal formado.
- **Los marcadores de foto.** Mientras un bloque no tiene imagen se muestra un
  degradado con la etiqueta «Foto de sustitución». En cuanto se sube una foto,
  el marcador y la etiqueta desaparecen solos.
- **El botón de currículum.** Si el campo del PDF está vacío, el botón no se
  genera. Nunca hay que poner `#`.
- **El enlace de Facebook.** Si se vacía el campo, el icono desaparece de la
  cabecera y del pie en todo el sitio.
- **Los datos estructurados de Google.** El bloque schema.org se construye con
  los mismos teléfonos, correo y dirección del panel: se editan una vez.

### Qué NO se edita desde el panel, a propósito

Los **textos médicos de las 7 especialidades** viven en
`src/_data/especialidades.yml` y solo se cambian en el repositorio. Son
afirmaciones clínicas revisadas (qué promete y qué no promete cada tratamiento)
y no deberían poder modificarse por accidente desde una interfaz.

---

## Trabajar en local

```bash
npm install
npm start          # servidor de desarrollo con recarga
npm run build      # genera _site/
```

Para producir un ZIP como los de antes: `npm run build` y comprimir el
contenido de `_site/` (los archivos en la raíz del ZIP, sin carpeta encima).

---

## Estructura

```
src/
  _data/            contenido: lo que edita Decap (*.yml) + iconos y schema (*.js)
  _includes/        base.njk (cabecera, pie, <head>) y macros.njk
  admin/            panel Decap: index.html + config.yml
  assets/           CSS, JS e imágenes subidas
  *.njk             las tres páginas
netlify.toml        build de Netlify
_site/              resultado del build (no se versiona)
```

### Al añadir contenido nuevo

Decap **reescribe el archivo YAML completo** a partir de los campos declarados
en `src/admin/config.yml`. Cualquier clave que exista en `src/_data/*.yml` y no
esté declarada allí se borra en la primera edición desde el panel. Al añadir un
campo, hay que declararlo en los dos sitios.

---

## Pendiente con la clínica

- **URL de Facebook.** La que hay (`facebook.com/eyecentermexicali`) es una
  suposición, nunca confirmada. Es el único enlace del sitio cuyo destino no
  está verificado. Confirmarlo o vaciar el campo en el panel.
- **Fotos reales.** Todos los visuales son de sustitución y lo dicen en
  pantalla. Sustituirlos antes de dar la dirección a los pacientes.
- **Marcas de las monturas.** Cinco de las ocho fichas dicen «Marca por
  confirmar».
- **Horarios de atención.** No se facilitaron; hay un comentario en
  `src/contacto.njk` donde colocarlos.
- **Dominios distintos.** El correo está en `eyecentermexico.com` y los PDF de
  los currículos en `eyecentermexicali.com`. Se han respetado los dos tal cual,
  sin «corregir» uno para que coincida con el otro.
