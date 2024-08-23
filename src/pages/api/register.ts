import type { APIRoute } from 'astro';
import { ObjectId } from 'mongodb';
import { db } from '../../lib/client';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    // Datos del Apoderado
    const apoderadoNombres = formData.get('apoderado-nombres')?.toString();
    const apoderadoApellidos = formData.get('apoderado-apellidos')?.toString();
    const apoderadoTelefono = formData.get('apoderado-telefono')?.toString();
    const apoderadoDireccion = formData.get('apoderado-direccion')?.toString();
    const apoderadoDni = formData.get('apoderado-dni')?.toString();

    // Datos del Estudiante
    const estudianteNombres = formData.get('estudiante-nombres')?.toString();
    const estudianteApellidos = formData.get('estudiante-apellidos')?.toString();
    const estudianteFechaNacimiento = formData.get('estudiante-fecha-nacimiento')?.toString();
    const estudianteGrado = formData.get('estudiante-grado')?.toString();
    const estudianteSeccion = formData.get('estudiante-seccion')?.toString();
    const estudianteDni = formData.get('estudiante-dni')?.toString();
    const estudianteNacionalidad = formData.get('estudiante-nacionalidad')?.toString();

    // Validar que todos los campos estén presentes
    if (
      !apoderadoNombres || !apoderadoApellidos || !apoderadoTelefono || !apoderadoDireccion || !apoderadoDni ||
      !estudianteNombres || !estudianteApellidos || !estudianteFechaNacimiento || !estudianteGrado || !estudianteSeccion || !estudianteDni || !estudianteNacionalidad
    ) {
      return new Response(JSON.stringify({ success: false, message: 'Todos los campos son obligatorios' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Concatenar Grado y Sección
    let gradoEscolar;
    if (estudianteGrado.includes("Años")) {
      const años = estudianteGrado.charAt(0);
      gradoEscolar = `${años}I_${estudianteSeccion}`;
    } else {
      const nivel = estudianteGrado.split(' ')[1].charAt(0).toUpperCase(); // P (Primaria) o S (Secundaria)
      const grado = estudianteGrado.split(' ')[0].charAt(0);
      gradoEscolar = `${grado}${nivel}_${estudianteSeccion}`;
    }

    // Crear un documento en la colección 'Apoderados'
    const apoderadoId = new ObjectId();
    await db.collection('Apoderados').insertOne({
      _id: apoderadoId,
      nombres: apoderadoNombres,
      apellidos: apoderadoApellidos,
      telefono: apoderadoTelefono,
      direccion: apoderadoDireccion,
      dni: apoderadoDni,
    });

    // Crear un documento en la colección 'Estudiantes' con referencia al Apoderado
    const estudianteId = new ObjectId();
    await db.collection('Estudiantes').insertOne({
      _id: estudianteId,
      dni: estudianteDni,
      nombres: estudianteNombres,
      apellidos: estudianteApellidos,
      fechaNacimiento: new Date(estudianteFechaNacimiento),
      nacionalidad: estudianteNacionalidad,
      apoderado_id: apoderadoId,
      gradoEscolar, // Guardamos el grado y la sección concatenados
    });

    // Crear un documento en la colección 'Matrículas' con referencia al Estudiante
    const matriculaId = new ObjectId();
    await db.collection('Matriculas').insertOne({
      _id: matriculaId,
      estudiante_id: estudianteId,
      estado: "Activa",
      fecha: new Date(), // Fecha de la matrícula
    });

    return new Response(JSON.stringify({ success: true, message: 'Matrícula registrada exitosamente' }), {
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
