
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Debugging Solicitud Flow ---');

    // 1. Create Solicitud
    console.log('1. Creating new solicitud...');
    const solicitud = await prisma.solicitudSeguro.create({
        data: {
            tipoVehiculo: 'Auto',
            marca: 'DebugBrand',
            modelo: 'DebugModel',
            ano: 2024,
            whatsapp: '123456789',
            clienteNombre: 'DebugClient',
            estado: 'NUEVA'
        }
    });
    console.log('✅ Solicitud created:', solicitud.id, solicitud.estado);

    // 2. Fetch as Advisor (Simulate DB Query used in controller)
    console.log('2. Fetching all solicitudes (as Controller does)...');

    // Simulate what the controller does: findAll
    const allSolicitudes = await prisma.solicitudSeguro.findMany({
        orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${allSolicitudes.length} total solicitudes.`);

    const found = allSolicitudes.find(s => s.id === solicitud.id);
    if (found) {
        console.log('✅ Created solicitud found in list.');
    } else {
        console.error('❌ Created solicitud NOT found in list.');
    }

    // 3. Check filtering
    const nuevas = allSolicitudes.filter(s => s.estado === 'NUEVA');
    console.log(`Found ${nuevas.length} 'NUEVA' solicitudes.`);

    // Cleanup
    await prisma.solicitudSeguro.delete({ where: { id: solicitud.id } });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
