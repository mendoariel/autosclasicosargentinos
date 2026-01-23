import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (err) {
      return res.status(500).json({ error: 'Error de autenticación' });
    }
    if (!user) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

