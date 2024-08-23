import type { APIRoute } from 'astro';
import { db } from '../../lib/client';

export const GET: APIRoute = async () => {
  try {
    // Consultar todas las matrículas, con la información del estudiante y el estado
    const matriculas = await db.collection('Matriculas').aggregate([
      {
        $lookup: {
          from: 'Estudiantes',
          localField: 'estudiante_id',
          foreignField: '_id',
          as: 'estudiante'
        }
      },
      {
        $unwind: '$estudiante'
      },
      {
        $lookup: {
          from: 'Apoderados',
          localField: 'estudiante.apoderado_id',
          foreignField: '_id',
          as: 'apoderado'
        }
      },
      {
        $unwind: '$apoderado'
      },
      {
        $project: {
          "estudiante.dni": 1,
          "estudiante.nombres": 1,
          "estudiante.apellidos": 1,
          "estudiante.gradoEscolar": 1,
          "fecha": 1,
          "estado": 1,
        }
      }
    ]).toArray();

    return new Response(JSON.stringify(matriculas), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al obtener las matrículas:', error);
    return new Response(JSON.stringify({ success: false, message: 'Error al obtener las matrículas' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
