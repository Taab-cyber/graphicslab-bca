const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (email) {
    // Attempt to make a specific user Admin
    const user = await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
    });
    console.log(`✅ Granted Admin rights to exactly: ${user.email} (${user.name})`);
  } else {
    // Or just make the first user in the DB an admin
    const firstUser = await prisma.user.findFirst({
      orderBy: { createdAt: 'asc' }
    });

    if (!firstUser) {
      console.log('❌ No users found in the database. Please sign up first!');
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: firstUser.id },
      data: { isAdmin: true },
    });
    
    console.log(`✅ No email provided. Granted Admin rights to the first user: ${updatedUser.email} (${updatedUser.name})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
