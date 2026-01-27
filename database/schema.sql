-- Schema SQL para crear las tablas manualmente
-- Ejecutar si Prisma migrate tiene problemas

CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "autos" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "año" INTEGER NOT NULL,
    "kilometraje" INTEGER,
    "descripcion" TEXT,
    "precio" DOUBLE PRECISION,
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "imagenes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "autos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "cotizaciones" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "autoId" INTEGER,
    "tipoSeguro" TEXT NOT NULL,
    "valorAsegurado" DOUBLE PRECISION NOT NULL,
    "primaMensual" DOUBLE PRECISION NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cotizaciones_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cotizaciones_autoId_fkey" FOREIGN KEY ("autoId") REFERENCES "autos"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "noticias" (
    "id" SERIAL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "resumen" TEXT,
    "autoId" INTEGER,
    "userId" INTEGER,
    "imagenUrl" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "publicado" BOOLEAN NOT NULL DEFAULT true,
    "fechaPublicacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "noticias_autoId_fkey" FOREIGN KEY ("autoId") REFERENCES "autos"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "noticias_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS "autos_userId_idx" ON "autos"("userId");
CREATE INDEX IF NOT EXISTS "autos_marca_modelo_idx" ON "autos"("marca", "modelo");
CREATE INDEX IF NOT EXISTS "autos_estado_idx" ON "autos"("estado");
CREATE INDEX IF NOT EXISTS "cotizaciones_userId_idx" ON "cotizaciones"("userId");
CREATE INDEX IF NOT EXISTS "noticias_fechaPublicacion_idx" ON "noticias"("fechaPublicacion");
CREATE INDEX IF NOT EXISTS "noticias_publicado_idx" ON "noticias"("publicado");



CREATE TABLE IF NOT EXISTS "solicitudes_seguro" (
    "id" SERIAL PRIMARY KEY,
    "clienteNombre" TEXT,
    "tipoVehiculo" TEXT DEFAULT 'auto',
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "tokenAsesor" TEXT NOT NULL UNIQUE,
    "tokenCliente" TEXT NOT NULL UNIQUE,
    "estado" TEXT NOT NULL DEFAULT 'NUEVA',
    "fotos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chasis" TEXT,
    "motor" TEXT,
    "patente" TEXT
);

CREATE INDEX IF NOT EXISTS "solicitudes_seguro_tokenAsesor_idx" ON "solicitudes_seguro"("tokenAsesor");
CREATE INDEX IF NOT EXISTS "solicitudes_seguro_tokenCliente_idx" ON "solicitudes_seguro"("tokenCliente");
CREATE INDEX IF NOT EXISTS "solicitudes_seguro_estado_idx" ON "solicitudes_seguro"("estado");

-- Insertar usuarios asesores (IDs fijos para compatibilidad con auth.controller.ts)
INSERT INTO "users" ("id", "email", "password", "nombre", "apellido", "telefono", "createdAt", "updatedAt")
VALUES (
    99999,
    'mendoariel@gmail.com',
    '$2b$10$09.R2R6bR0dwOj/7xPPbiOhKN7KZg/QFeqvVq6xCFHEORZlztrB7.',
    'Alberto',
    'Arce',
    '2615597977',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("email") DO NOTHING;

INSERT INTO "users" ("id", "email", "password", "nombre", "apellido", "telefono", "createdAt", "updatedAt")
VALUES (
    99998,
    'mariadelpilarasesor@gmail.com',
    '$2b$10$09.R2R6bR0dwOj/7xPPbiOhKN7KZg/QFeqvVq6xCFHEORZlztrB7.',
    'Maria',
    'Del Pilar',
    '2617458765',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("email") DO NOTHING;
