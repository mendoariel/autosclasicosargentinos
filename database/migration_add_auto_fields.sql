-- Migración: Agregar campos a tabla autos y actualizar cotizaciones
-- Ejecutar este script en la base de datos si prisma migrate no funciona

-- Agregar campos a la tabla autos
ALTER TABLE "autos" 
ADD COLUMN IF NOT EXISTS "color" TEXT,
ADD COLUMN IF NOT EXISTS "combustible" TEXT,
ADD COLUMN IF NOT EXISTS "imagenUrl" TEXT;

-- Actualizar tabla cotizaciones
ALTER TABLE "cotizaciones"
ADD COLUMN IF NOT EXISTS "marca" TEXT,
ADD COLUMN IF NOT EXISTS "modelo" TEXT,
ADD COLUMN IF NOT EXISTS "ano" INTEGER,
ADD COLUMN IF NOT EXISTS "cobertura" TEXT,
ADD COLUMN IF NOT EXISTS "primaAnual" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "uso" TEXT;

-- Hacer userId opcional en cotizaciones (si no es nullable ya)
-- ALTER TABLE "cotizaciones" ALTER COLUMN "userId" DROP NOT NULL;

-- Nota: Si userId debe ser opcional, descomenta la línea anterior
-- pero primero verifica que no haya datos que dependan de userId siendo NOT NULL



