const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  errorFormat: "pretty",
  log: ["warn", "error"],
});

function sanitizeUrl(url) {
  if (!url) return 'NOT_DEFINED';
  return url.replace(/(:[^:@]+@)/, ':****@');
}

// Connect to the database
async function connectToDatabase() {
  console.log('--- DB CONNECTION DIAGNOSTICS ---');
  console.log('DATABASE_URL:', sanitizeUrl(process.env.DATABASE_URL));
  console.log('DIRECT_URL:  ', sanitizeUrl(process.env.DIRECT_URL));
  console.log('NODE_ENV:    ', process.env.NODE_ENV);
  console.log('---------------------------------');
  
  try {
    await prisma.$connect();
    return prisma;
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  }
}

// Handle Prisma errors
prisma.$on("error", (e) => {
  console.error("❌ Prisma Client error:", e);
});

// Export the client and the connect function
module.exports = { prisma, connectToDatabase };
