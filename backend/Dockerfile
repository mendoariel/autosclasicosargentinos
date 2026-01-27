FROM node:20-slim AS base

# Instalar dependencias del sistema necesarias para Prisma y bcrypt
RUN apt-get update && apt-get install -y \
    openssl \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Dependencies & Builder together to avoid copy issues
FROM base AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
# Force fresh install ignoring local lockfile which might have Mac-specific bindings
RUN rm -f package-lock.json
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM node:20-slim AS runner

# Instalar solo OpenSSL en la imagen final (no necesitamos compiladores)
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nodejs

EXPOSE 5000

CMD ["node", "dist/server.js"]

