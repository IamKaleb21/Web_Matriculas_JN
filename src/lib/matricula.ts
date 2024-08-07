import { db } from './client';

export interface Matricula {
  apoderadoNombres: string;
  apoderadoApellidos: string;
  apoderadoTelefono: string;
  apoderadoDireccion: string;
  apoderadoDNI: string;
  estudianteNombres: string;
  estudianteApellidos: string;
  estudianteFechaNacimiento: string;
  estudianteGrado: string;
  estudianteSeccion: string;
  estudianteDNI: string;
  estudianteNacionalidad: string;
}

export const Matriculas = db.collection<Matricula>('matriculas');
