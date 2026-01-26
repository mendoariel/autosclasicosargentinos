// Tipos para Express Request con usuario autenticado
import { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      nombre: string;
      apellido: string;
      telefono?: string | null;
    }
  }
}

export { };



