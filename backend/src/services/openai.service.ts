import OpenAI from 'openai';
import { prisma } from '../utils/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generarNoticia = async (autoId?: number) => {
  try {
    // Si no se especifica un auto, seleccionar uno aleatorio
    let auto = null;
    if (autoId) {
      auto = await prisma.auto.findUnique({
        where: { id: autoId },
      });
    } else {
      // Obtener un auto aleatorio
      const autos = await prisma.auto.findMany({
        take: 1,
        skip: Math.floor(Math.random() * (await prisma.auto.count())),
      });
      auto = autos[0] || null;
    }

    // Si no hay autos en la base de datos, generar una noticia general
    let prompt = '';
    if (auto) {
      prompt = `Escribe una noticia interesante y atractiva sobre el auto clásico argentino ${auto.marca} ${auto.modelo} del año ${auto.ano}. 
      
La noticia debe ser:
- Entre 300 y 500 palabras
- Informativa y entretenida
- Mencionar características históricas del modelo
- Hablar sobre su importancia en la cultura automotriz argentina
- Incluir datos curiosos o anécdotas si es posible
- Estar escrita en español argentino
- Tener un título llamativo

Formato de respuesta JSON:
{
  "titulo": "Título de la noticia",
  "contenido": "Contenido completo de la noticia en formato HTML con párrafos <p>",
  "resumen": "Resumen breve de 2-3 líneas"
}`;
    } else {
      prompt = `Escribe una noticia interesante sobre autos clásicos argentinos en general. 
      
La noticia debe ser:
- Entre 300 y 500 palabras
- Informativa y entretenida
- Hablar sobre la cultura de los autos clásicos en Argentina
- Mencionar modelos icónicos argentinos
- Estar escrita en español argentino
- Tener un título llamativo

Formato de respuesta JSON:
{
  "titulo": "Título de la noticia",
  "contenido": "Contenido completo de la noticia en formato HTML con párrafos <p>",
  "resumen": "Resumen breve de 2-3 líneas"
}`;
    }

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'Eres un periodista especializado en autos clásicos argentinos. Escribes noticias atractivas, informativas y entretenidas sobre estos vehículos icónicos.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const respuesta = completion.choices[0]?.message?.content;
    if (!respuesta) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    const noticiaData = JSON.parse(respuesta);

    // Guardar la noticia en la base de datos
    const noticia = await prisma.noticia.create({
      data: {
        titulo: noticiaData.titulo,
        contenido: noticiaData.contenido,
        resumen: noticiaData.resumen || null,
        autoId: auto?.id || null,
        publicado: true,
        fechaPublicacion: new Date(),
        tags: auto ? [auto.marca, auto.modelo, `${auto.ano}`] : ['autos clásicos', 'argentina'],
        imagenUrl: auto?.imagenUrl || null,
      },
    });

    return noticia;
  } catch (error: any) {
    console.error('Error al generar noticia:', error);
    throw new Error(`Error al generar noticia: ${error.message}`);
  }
};



