import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

/* =========================================================
   Datos estructurados schema.org (JSON-LD) de la página de inicio.
   ---------------------------------------------------------
   Se construyen a partir de los MISMOS archivos que edita Decap CMS,
   no de una copia pegada a mano: cambiar un teléfono o la dirección
   en /admin/ actualiza a la vez la página y los datos estructurados.

   Regla que se respeta aquí: no se inventa nada. Sin valoraciones,
   sin horarios, sin coordenadas, sin imágenes y sin URL que la clínica
   no haya facilitado. Una propiedad sin dato real se omite.
   ========================================================= */
const dir = path.dirname(fileURLToPath(import.meta.url));
const leer = (nombre) => yaml.load(fs.readFileSync(path.join(dir, nombre), 'utf8'));

export default function () {
  const contacto = leer('contacto.yml');
  const medicos = leer('medicos.yml');
  const especialidades = leer('especialidades.yml');

  const telefonos = (contacto.telefonos || [])
    .map((t) => String(t.numero || '').replace(/\D/g, ''))
    .filter(Boolean)
    .map((d) => '+52 ' + d.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3'));

  const datos = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: 'EYE CENTER Mexicali',
    description:
      'Clínica de oftalmología en Mexicali, Baja California, fundada en 2006. Contamos con médicos con la más alta especialidad en tratar las Enfermedades de Retina, Córnea, Cataratas y Glaucoma, siempre dispuestos a atenderte.',
    slogan: 'CUIDA TUS OJOS, HAY MUCHO POR VER',
    foundingDate: '2006',
    medicalSpecialty: 'Ophthalmologic',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Madero #939, Col. Segunda Sección, entre calle "A" y "B" (a un lado de canal 66)',
      addressLocality: 'Mexicali',
      addressRegion: 'Baja California',
      postalCode: '21100',
      addressCountry: 'MX',
    },
    telephone: telefonos,
    email: contacto.email,
    availableService: (especialidades.lista || []).map((e) => ({
      '@type': 'MedicalProcedure',
      name: e.titulo,
    })),
    physician: (medicos.lista || []).map((m) => ({
      '@type': 'Physician',
      name: m.nombre,
      medicalSpecialty: 'Ophthalmologic',
      description: m.bio,
    })),
  };

  // La página de Facebook solo se declara si la clínica la ha confirmado.
  if (contacto.facebook) datos.sameAs = [contacto.facebook];

  return datos;
}
