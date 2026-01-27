const bcrypt = require('bcrypt');

async function generarHashes() {
  const passwords = ['password123', 'admin123', 'asesor123'];
  
  for (const password of passwords) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`Contraseña: ${password}`);
    console.log(`Hash: ${hash}`);
    console.log('---');
  }
}

generarHashes().catch(console.error);
