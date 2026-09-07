import yaml from 'js-yaml';

/* =========================================================
   EYE CENTER Mexicali — configuración de Eleventy
   ---------------------------------------------------------
   El sitio publicado sigue siendo HTML/CSS/JS estático y sin
   dependencias: Eleventy solo se usa en el momento del build
   para inyectar el contenido que edita Decap CMS.
   ========================================================= */
export default function (eleventyConfig) {
  /* ---------------------------------------------------------
     Los archivos de contenido son YAML (los que escribe Decap).
     Eleventy lee JSON de forma nativa, pero no YAML: hay que
     declararlo. Se lee todo lo que haya en src/_data/*.yml
     --------------------------------------------------------- */
  eleventyConfig.addDataExtension('yml,yaml', (contents) => yaml.load(contents));

  /* ---------------------------------------------------------
     Copia tal cual: hojas de estilo, scripts, imágenes subidas
     desde el CMS y el propio panel de administración.
     --------------------------------------------------------- */
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'src/admin': 'admin' });

  /* ---------------------------------------------------------
     Filtros
     --------------------------------------------------------- */

  // "686.555.6060" → "tel:+526865556060"
  // El editor escribe el número como quiere verlo en pantalla;
  // el enlace en formato E.164 se deduce, así nunca queda mal formado.
  eleventyConfig.addFilter('telHref', (numero) => {
    const digits = String(numero || '').replace(/\D/g, '');
    if (!digits) return '';
    // Si ya trae el 52 de México delante, no se duplica.
    const nacional = digits.startsWith('52') && digits.length > 10 ? digits.slice(2) : digits;
    return 'tel:+52' + nacional;
  });

  // "686.555.6060" → "Llamar al 686 555 6060"
  // Sin esto, varios lectores de pantalla leen los puntos como decimales.
  eleventyConfig.addFilter('telAria', (numero) => {
    return 'Llamar al ' + String(numero || '').replace(/[.\-()]/g, ' ').replace(/\s+/g, ' ').trim();
  });

  // Texto de dirección → URL de búsqueda de Google Maps.
  // Se quita la almohadilla de "Av. Madero #939": un "#" crudo cortaría la URL.
  eleventyConfig.addFilter('mapsUrl', (consulta) => {
    const limpio = String(consulta || '').replace(/#/g, '').replace(/\s+/g, ' ').trim();
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(limpio);
  });

  // Iniciales de un nombre de médico, para el marcador cuando aún no hay foto.
  eleventyConfig.addFilter('iniciales', (nombre) => {
    const palabras = String(nombre || '')
      .replace(/^(Dra?|Dr)\.?\s+/i, '')
      .split(/\s+/)
      .filter(Boolean);
    return palabras.slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  });

  // Primer valor no vacío. Útil para "la foto real si existe, si no el marcador".
  eleventyConfig.addFilter('oDefecto', (valor, alternativa) => {
    return valor === undefined || valor === null || valor === '' ? alternativa : valor;
  });

  // Quita la coma final de una línea de dirección, sin tocar las interiores.
  // "Av. Madero #939, Col. Segunda Sección," → "Av. Madero #939, Col. Segunda Sección"
  eleventyConfig.addFilter('sinComaFinal', (t) => String(t || '').replace(/,\s*$/, ''));

  // Busca un elemento de una lista por su campo `clave`.
  // Devuelve {} y no undefined: así el acceso a .foto nunca revienta el build
  // si alguien borra una entrada desde el CMS.
  eleventyConfig.addFilter('buscarPorClave', (lista, clave) => {
    if (!Array.isArray(lista)) return {};
    return lista.find((x) => x && x.clave === clave) || {};
  });

  /* ---------------------------------------------------------
     Las macros de Nunjucks dejan espacios al final de algunas
     líneas. Es invisible, pero ensucia el HTML entregado y lo
     marca cualquier validador: se limpia al escribir.
     --------------------------------------------------------- */
  eleventyConfig.addTransform('limpiarEspacios', function (contenido) {
    if (!(this.page.outputPath || '').endsWith('.html')) return contenido;
    return contenido.replace(/[ \t]+$/gm, '');
  });

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      data: '_data',
    },
    // Solo Nunjucks: el panel de Decap y los assets se copian sin procesar,
    // así ningún "{{ }}" de una librería externa se interpreta por error.
    templateFormats: ['njk'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
}
