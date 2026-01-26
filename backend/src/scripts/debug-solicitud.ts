<
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const token = '58bfe582-c489-421f-be39-1ae5cdc3c52c';
    const solicitud = await prisma.solicitudSeguro.findUnique({
        where: { tokenAsesor: token }
    });

    if (solicitud) {
        console.log(`For Advisor View: ${token}`);
        console.log(`Client Link for Re-upload: http://localhost:3000/cotizacion/${solicitud.tokenCliente}`);
    } else {
        console.log('Solicitud not found');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
