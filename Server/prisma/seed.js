const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Créer des livres
  await prisma.book.createMany({
    data: [
      {
        title: "JavaScript: The Definitive Guide",
        author: "David Flanagan",
        publisher: "O'Reilly",
        category: "INFORMATIQUE",
        price: 49.99,
        image:
          "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
        description: "Guide complet de JavaScript pour développeurs",
        stock: 15,
        language: "ANGLAIS",
      },
      {
        title: "Python Crash Course",
        author: "Eric Matthes",
        publisher: "Addison-Wesley",
        category: "INFORMATIQUE",
        price: 39.99,
        image:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
        description: "Introduction pratique à Python",
        stock: 20,
        language: "ANGLAIS",
      },
      {
        title: "Le Jardin Moderne",
        author: "Marie Dubois",
        publisher: "Rustica",
        category: "JARDINAGE",
        price: 29.99,
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        description: "Guide complet du jardinage urbain",
        stock: 25,
        language: "FRANCAIS",
      },
    ],
  });

  console.log("✅ Base de données initialisée avec succès!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
