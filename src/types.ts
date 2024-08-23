// src/types.ts
export interface Apoderado {
    nombres: string;
    apellidos: string;
    telefono: string;
    direccion: string;
    dni: string;
  }
  
  export interface Estudiante {
    nombres: string;
    apellidos: string;
    fechaNacimiento: string;
    grado: string;
    seccion: string;
    dni: string;
    nacionalidad: string;
  }
  
  export interface Registration {
    apoderado: Apoderado;
    estudiante: Estudiante;
  }
  