const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  errorFormat: "pretty",
  log: ["warn", "error"],
});

// Connect to the database
async function connectToDatabase() {
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
