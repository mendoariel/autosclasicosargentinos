#!/usr/bin/env tsx

/**
 * Script para generar una noticia de prueba
 * Uso: npx tsx src/scripts/generar-noticia.ts [autoId]
 */

import dotenv from 'dotenv';
import path from 'path';
import { generarNoticia } from '../services/openai.service';

// Cargar .env desde la raíz del proyecto
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function main() {
  const autoId = process.argv[2] ? parseInt(process.argv[2]) : undefined;

  console.log('🤖 Generando noticia con IA...');
  console.log(autoId ? `📌 Auto ID: ${autoId}` : '📌 Auto aleatorio');

  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ Error: OPENAI_API_KEY no está configurada en las variables de entorno');
      console.log('💡 Agrega OPENAI_API_KEY=tu-api-key en backend/.env');
      process.exit(1);
    }

    const noticia = await generarNoticia(autoId);

    console.log('\n✅ Noticia generada exitosamente!');
    console.log('\n📰 Título:', noticia.titulo);
    console.log('\n📝 Resumen:', noticia.resumen);
    console.log('\n🔗 ID de la noticia:', noticia.id);
    console.log('\n✅ La noticia ha sido guardada en la base de datos');
  } catch (error: any) {
    console.error('❌ Error al generar noticia:', error.message);
    process.exit(1);
  }
}

main();

