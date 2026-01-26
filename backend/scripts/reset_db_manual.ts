
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('🗑️  Starting cleanup...');

    // 1. Delete all Solicitudes
    // Based on schema.map("solicitudes_seguro")
    const deleted = await prisma.solicitudSeguro.deleteMany({});
    console.log(`✅ Deleted ${deleted.count} solicitudes from DB.`);

    // 2. Clear Uploads Folder
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        for (const file of files) {
            if (file !== '.gitkeep') {
                fs.unlinkSync(path.join(uploadsDir, file));
                console.log(`   Deleted file: ${file}`);
            }
        }
    }
    console.log('✅ Uploads folder cleared.');
    console.log('✨ System reset complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
