const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdmin() {
  try {
    console.log('\n=== Create Admin User ===\n');
    
    rl.question('Enter admin email: ', async (email) => {
      rl.question('Enter admin password: ', async (password) => {
        rl.question('Enter admin name (optional): ', async (name) => {
          try {
            const passwordHash = await bcrypt.hash(password, 10);
            
            const admin = await prisma.user.upsert({
              where: { email },
              update: { 
                role: 'ADMIN',
                passwordHash,
                name: name || null
              },
              create: {
                email,
                passwordHash,
                role: 'ADMIN',
                name: name || null
              }
            });
            
            console.log('\n✅ Admin user created/updated successfully!');
            console.log(`   Email: ${admin.email}`);
            console.log(`   Role: ${admin.role}`);
            console.log(`   Name: ${admin.name || 'N/A'}`);
            console.log('\nYou can now login at: http://localhost:5173/login\n');
            
            rl.close();
            await prisma.$disconnect();
          } catch (err) {
            console.error('\n❌ Error:', err.message);
            rl.close();
            await prisma.$disconnect();
            process.exit(1);
          }
        });
      });
    });
  } catch (err) {
    console.error('Error:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createAdmin();
