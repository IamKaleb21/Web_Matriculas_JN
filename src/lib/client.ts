import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

console.log('MongoDB URI:', uri); // Verifica que la URI sea correcta

if (!uri) {
  throw new Error('Please add your Mongo URI to .env');
}

const client = new MongoClient(uri);
export const db = client.db('matriculasJN');

export default client;
