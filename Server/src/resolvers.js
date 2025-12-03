const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const resolvers = {
  Query: {
    // Livres
    books: async (_, { category, search }) => {
      const where = {};

      if (category) {
        where.category = category;
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { author: { contains: search, mode: "insensitive" } },
          { publisher: { contains: search, mode: "insensitive" } },
        ];
      }

      return await prisma.book.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
    },

    book: async (_, { id }) => {
      return await prisma.book.findUnique({
        where: { id },
      });
    },

    booksByCategory: async (_, { category }) => {
      return await prisma.book.findMany({
        where: { category },
        orderBy: { title: "asc" },
      });
    },

    // Clients
    customer: async (_, { id }) => {
      return await prisma.customer.findUnique({
        where: { id },
        include: {
          orders: {
            include: {
              orderItems: {
                include: { book: true },
              },
              payment: true,
            },
          },
        },
      });
    },

    customerByEmail: async (_, { email }) => {
      return await prisma.customer.findUnique({
        where: { email },
        include: {
          orders: true,
        },
      });
    },

    // Commandes
    order: async (_, { id }) => {
      return await prisma.order.findUnique({
        where: { id },
        include: {
          customer: true,
          orderItems: {
            include: { book: true },
          },
          payment: true,
        },
      });
    },

    ordersByCustomer: async (_, { customerId }) => {
      return await prisma.order.findMany({
        where: { customerId },
        include: {
          orderItems: {
            include: { book: true },
          },
          payment: true,
        },
        orderBy: { createdAt: "desc" },
      });
    },
  },

  Mutation: {
    // Créer un livre
    createBook: async (_, args) => {
      return await prisma.book.create({
        data: args,
      });
    },

    // Mettre à jour un livre
    updateBook: async (_, { id, ...data }) => {
      return await prisma.book.update({
        where: { id },
        data,
      });
    },

    // Créer un client
    createCustomer: async (_, args) => {
      return await prisma.customer.create({
        data: args,
      });
    },

    // Mettre à jour un client
    updateCustomer: async (_, { id, ...data }) => {
      return await prisma.customer.update({
        where: { id },
        data,
      });
    },

    // Créer une commande
    createOrder: async (_, { customerId, items }) => {
      // Calculer le total
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const book = await prisma.book.findUnique({
          where: { id: item.bookId },
        });

        if (!book) {
          throw new Error(`Livre avec ID ${item.bookId} introuvable`);
        }

        if (book.stock < item.quantity) {
          throw new Error(`Stock insuffisant pour "${book.title}"`);
        }

        totalAmount += book.price * item.quantity;
        orderItems.push({
          bookId: item.bookId,
          quantity: item.quantity,
          price: book.price,
        });
      }

      // Créer la commande
      const order = await prisma.order.create({
        data: {
          customerId,
          totalAmount,
          orderItems: {
            create: orderItems,
          },
        },
        include: {
          customer: true,
          orderItems: {
            include: { book: true },
          },
        },
      });

      // Mettre à jour le stock
      for (const item of items) {
        await prisma.book.update({
          where: { id: item.bookId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    },

    // Mettre à jour le statut d'une commande
    updateOrderStatus: async (_, { id, status }) => {
      return await prisma.order.update({
        where: { id },
        data: { status },
        include: {
          customer: true,
          orderItems: {
            include: { book: true },
          },
          payment: true,
        },
      });
    },

    // Traiter le paiement
    processPayment: async (_, { orderId, cardNumber, cardExpiry, cardCVC }) => {
      // Vérifier la commande
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new Error("Commande introuvable");
      }

      // Simuler le traitement du paiement
      const cardLast4 = cardNumber.slice(-4);
      const transactionId = `TXN${Date.now()}`;

      // Créer le paiement
      const payment = await prisma.payment.create({
        data: {
          orderId,
          cardLast4,
          amount: order.totalAmount,
          status: "COMPLETED",
          transactionId,
        },
      });

      // Mettre à jour le statut de la commande
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "CONFIRMED" },
      });

      return payment;
    },
  },

  // Resolvers pour les types
  Order: {
    customer: async (parent) => {
      return await prisma.customer.findUnique({
        where: { id: parent.customerId },
      });
    },
    orderItems: async (parent) => {
      return await prisma.orderItem.findMany({
        where: { orderId: parent.id },
        include: { book: true },
      });
    },
    payment: async (parent) => {
      return await prisma.payment.findUnique({
        where: { orderId: parent.id },
      });
    },
  },

  Customer: {
    orders: async (parent) => {
      return await prisma.order.findMany({
        where: { customerId: parent.id },
      });
    },
  },

  OrderItem: {
    book: async (parent) => {
      return await prisma.book.findUnique({
        where: { id: parent.bookId },
      });
    },
  },
};

module.exports = resolvers;
