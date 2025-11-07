const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

(async () => {
  const p = new PrismaClient();
  try {
    const u = await p.user.findUnique({ where: { email: 'admin@example.com' } });
    if (!u) {
      console.error('User not found: admin@example.com');
      return;
    }
    console.log('hashed:', u.passwordHash);
    const plain = process.env.ADMIN_PASSWORD || 'adminpassword';
    const ok = await bcrypt.compare(plain, u.passwordHash || '');
    console.log('matches:', ok);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await p.$disconnect();
  }
})();