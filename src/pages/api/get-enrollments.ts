import type { APIRoute } from 'astro';
import { db } from '../../lib/client';

export const GET: APIRoute = async ({ url }) => {
  try {
    // Obtener parámetros de consulta
    const searchQuery = url.searchParams.get('q') || '';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // Construir el filtro de búsqueda
    const searchFilter = {
      $or: [
        { "estudiante.nombres": { $regex: searchQuery, $options: 'i' } },
        { "estudiante.apellidos": { $regex: searchQuery, $options: 'i' } },
        { "estudiante.dni": { $regex: searchQuery, $options: 'i' } },
        { "estudiante.gradoEscolar": { $regex: searchQuery, $options: 'i' } },
      ]
    };

    // Consultar las matrículas con búsqueda y paginación
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
        $match: searchFilter
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]).toArray();

    const total = await db.collection('Matriculas').countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);

    return new Response(JSON.stringify({ matriculas, totalPages, currentPage: page }), {
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
