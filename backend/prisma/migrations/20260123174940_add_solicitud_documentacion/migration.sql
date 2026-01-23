-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "autos" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "año" INTEGER NOT NULL,
    "kilometraje" INTEGER,
    "descripcion" TEXT,
    "precio" DOUBLE PRECISION,
    "color" TEXT,
    "combustible" TEXT,
    "imagenUrl" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "imagenes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "autos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cotizaciones" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "autoId" INTEGER,
    "marca" TEXT,
    "modelo" TEXT,
    "ano" INTEGER,
    "tipoSeguro" TEXT,
    "cobertura" TEXT,
    "valorAsegurado" DOUBLE PRECISION NOT NULL,
    "primaMensual" DOUBLE PRECISION NOT NULL,
    "primaAnual" DOUBLE PRECISION,
    "uso" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cotizaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "noticias" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "resumen" TEXT,
    "autoId" INTEGER,
    "userId" INTEGER,
    "imagenUrl" TEXT,
    "tags" TEXT[],
    "publicado" BOOLEAN NOT NULL DEFAULT true,
    "fechaPublicacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "noticias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_attempts" (
    "id" SERIAL NOT NULL,
    "tipoVehiculo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "dominio" TEXT,
    "uso" TEXT,
    "valor" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quote_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitud_documentacion" (
    "id" SERIAL NOT NULL,
    "quote_attempt_id" INTEGER NOT NULL,
    "imagen_tarjeta_verde_frente" TEXT,
    "imagen_tarjeta_verde_dorso" TEXT,
    "imagen_vehiculo_fecha" TEXT,
    "imagen_carnet_conducir" TEXT,
    "patente" TEXT,
    "numero_motor" TEXT,
    "numero_chasis" TEXT,
    "dominio" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pendiente',
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitud_documentacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "autos_userId_idx" ON "autos"("userId");

-- CreateIndex
CREATE INDEX "autos_marca_modelo_idx" ON "autos"("marca", "modelo");

-- CreateIndex
CREATE INDEX "autos_estado_idx" ON "autos"("estado");

-- CreateIndex
CREATE INDEX "cotizaciones_userId_idx" ON "cotizaciones"("userId");

-- CreateIndex
CREATE INDEX "noticias_fechaPublicacion_idx" ON "noticias"("fechaPublicacion");

-- CreateIndex
CREATE INDEX "noticias_publicado_idx" ON "noticias"("publicado");

-- CreateIndex
CREATE INDEX "quote_attempts_status_idx" ON "quote_attempts"("status");

-- CreateIndex
CREATE INDEX "quote_attempts_whatsapp_idx" ON "quote_attempts"("whatsapp");

-- CreateIndex
CREATE INDEX "solicitud_documentacion_status_idx" ON "solicitud_documentacion"("status");

-- CreateIndex
CREATE INDEX "solicitud_documentacion_quote_attempt_id_idx" ON "solicitud_documentacion"("quote_attempt_id");

-- AddForeignKey
ALTER TABLE "autos" ADD CONSTRAINT "autos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizaciones" ADD CONSTRAINT "cotizaciones_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizaciones" ADD CONSTRAINT "cotizaciones_autoId_fkey" FOREIGN KEY ("autoId") REFERENCES "autos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "noticias" ADD CONSTRAINT "noticias_autoId_fkey" FOREIGN KEY ("autoId") REFERENCES "autos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "noticias" ADD CONSTRAINT "noticias_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud_documentacion" ADD CONSTRAINT "solicitud_documentacion_quote_attempt_id_fkey" FOREIGN KEY ("quote_attempt_id") REFERENCES "quote_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
