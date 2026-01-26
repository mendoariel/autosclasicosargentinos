import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Request } from 'express';
import { prisma } from '../utils/prisma';

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'dev-secret-key',
  passReqToCallback: true,
};

export const jwtStrategy = new JwtStrategy(
  jwtOptions,
  async (req: Request, payload: any, done: any) => {
    try {
      // Hardcoded Advisor Check for MVP
      if (payload.userId === 99999 && payload.role === 'asesor') {
        const advisorUser = {
          id: 99999,
          email: 'mendoariel@gmail.com',
          nombre: 'Araceli',
          apellido: 'Frazeto',
          telefono: '2615597977',
          role: 'asesor'
        };
        return done(null, advisorUser);
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          nombre: true,
          apellido: true,
          telefono: true,
        },
      });

      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }
);



