import { db } from './client';

export interface User {
  _id: string;
  username: string;
  password: string;
}

export const Users = db.collection<User>('Usuarios');
