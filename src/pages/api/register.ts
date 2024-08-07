import type { APIRoute } from 'astro';
import { db } from '../../lib/client';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    // Datos del apoderado
    const apoderadoNombres = formData.get('apoderado-nombres');
    const apoderadoApellidos = formData.get('apoderado-apellidos');
    const apoderadoTelefono = formData.get('apoderado-telefono');
    const apoderadoDireccion = formData.get('apoderado-direccion');
    const apoderadoDni = formData.get('apoderado-dni');
    
    // Datos del estudiante
    const estudianteNombres = formData.get('estudiante-nombres');
    const estudianteApellidos = formData.get('estudiante-apellidos');
    const estudianteFechaNacimiento = formData.get('estudiante-fecha-nacimiento');
    const estudianteGrado = formData.get('estudiante-grado');
    const estudianteSeccion = formData.get('estudiante-seccion');
    const estudianteDni = formData.get('estudiante-dni');
    const estudianteNacionalidad = formData.get('estudiante-nacionalidad');

    // Verificar que todos los campos estén presentes
    if (
      !apoderadoNombres || !apoderadoApellidos || !apoderadoTelefono || !apoderadoDireccion || !apoderadoDni ||
      !estudianteNombres || !estudianteApellidos || !estudianteFechaNacimiento || !estudianteGrado || !estudianteSeccion || !estudianteDni || !estudianteNacionalidad
    ) {
      return new Response(JSON.stringify({ success: false, message: 'Todos los campos son obligatorios' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const collection = db.collection('matriculas');
    await collection.insertOne({
      apoderado: {
        nombres: apoderadoNombres,
        apellidos: apoderadoApellidos,
        telefono: apoderadoTelefono,
        direccion: apoderadoDireccion,
        dni: apoderadoDni,
      },
      estudiante: {
        nombres: estudianteNombres,
        apellidos: estudianteApellidos,
        fechaNacimiento: estudianteFechaNacimiento,
        grado: estudianteGrado,
        seccion: estudianteSeccion,
        dni: estudianteDni,
        nacionalidad: estudianteNacionalidad,
      },
    });

    return new Response(JSON.stringify({ success: true, message: 'Registro exitoso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ success: false, message: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
