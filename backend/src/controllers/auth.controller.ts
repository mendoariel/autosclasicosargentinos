import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, nombre, apellido, telefono } = req.body;

    // Validación básica
    if (!email || !password || !nombre || !apellido) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: email, password, nombre, apellido',
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        apellido,
        telefono: telefono || null,
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        createdAt: true,
      },
    });

    // Generar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user,
      token,
    });
  } catch (error: any) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validación
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y contraseña son requeridos',
      });
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Hardcoded Advisor Check (MVP)
    if (email === 'mendoariel@gmail.com' && password === 'Casadesara1') {
      const token = generateToken({
        userId: 99999, // ID reservado para admin/asesor
        email: email,
        role: 'asesor'
      });

      return res.json({
        message: 'Login exitoso (Asesor Araceli)',
        user: {
          id: 99999,
          email: email,
          nombre: 'Araceli',
          apellido: 'Frazeto',
          telefono: '2615597977',
          role: 'asesor'
        },
        token,
      });
    } else if (email === 'mariadelpilarasesor@gmail.com' && password === 'Casadesara1') {
      const token = generateToken({
        userId: 99998, // ID reservado para admin/asesor 2
        email: email,
        role: 'asesor'
      });

      return res.json({
        message: 'Login exitoso (Asesor Maria)',
        user: {
          id: 99998,
          email: email,
          nombre: 'Maria',
          apellido: 'Del Pilar',
          telefono: '2617458765',
          role: 'asesor'
        },
        token,
      });
    }

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: user.telefono,
      },
      token,
    });
  } catch (error: any) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    // req.user está disponible gracias al middleware de autenticación
    if (!req.user) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    // Type assertion para evitar conflictos con tipos de Prisma
    const userId = (req.user as any).id as number;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user });
  } catch (error: any) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

