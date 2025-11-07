const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

(async () => {
  const prisma = new PrismaClient();
  try {
    const email = 'admin@example.com';
    const plain = process.env.ADMIN_PASSWORD || 'adminpassword';
    const hashed = await bcrypt.hash(plain, 10);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error('User not found:', email);
      process.exit(1);
    }

    await prisma.user.update({
      where: { email },
      data: { passwordHash: hashed }
    });

    console.log('Updated admin passwordHash for', email);
  } catch (err) {
    console.error('Error updating password:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();