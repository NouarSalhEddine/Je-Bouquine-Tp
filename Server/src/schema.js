const typeDefs = `#graphql
  type Book {
    id: Int!
    title: String!
    author: String!
    publisher: String!
    category: Category!
    price: Float!
    image: String!
    description: String!
    stock: Int!
    language: Language!
    createdAt: String!
  }

  type Customer {
    id: Int!
    fullName: String!
    email: String!
    address: String
    city: String
    postalCode: String
    orders: [Order!]!
  }

  type Order {
    id: Int!
    customer: Customer!
    totalAmount: Float!
    status: OrderStatus!
    createdAt: String!
    orderItems: [OrderItem!]!
    payment: Payment
  }

  type OrderItem {
    id: Int!
    book: Book!
    quantity: Int!
    price: Float!
  }

  type Payment {
    id: Int!
    cardLast4: String!
    amount: Float!
    status: PaymentStatus!
    transactionId: String
  }

  enum Category {
    INFORMATIQUE
    SCIENCES_TECHNIQUES
    PSYCHOLOGIE
    DECORATION
    JARDINAGE
  }

  enum Language {
    FRANCAIS
    ANGLAIS
  }

  enum OrderStatus {
    PENDING
    CONFIRMED
    SHIPPED
    DELIVERED
    CANCELLED
  }

  enum PaymentStatus {
    PENDING
    COMPLETED
    FAILED
    REFUNDED
  }

  type Query {
    # Catalogue de livres
    books(category: Category, search: String): [Book!]!
    book(id: Int!): Book
    booksByCategory(category: Category!): [Book!]!
    
    # Clients
    customer(id: Int!): Customer
    customerByEmail(email: String!): Customer
    
    # Commandes
    order(id: Int!): Order
    ordersByCustomer(customerId: Int!): [Order!]!
  }

  type Mutation {
    # Gestion des livres
    createBook(
      title: String!
      author: String!
      publisher: String!
      category: Category!
      price: Float!
      image: String!
      description: String!
      stock: Int!
      language: Language!
    ): Book!
    
    updateBook(
      id: Int!
      title: String
      author: String
      publisher: String
      category: Category
      price: Float
      stock: Int
    ): Book
    
    # Gestion des clients
    createCustomer(
      fullName: String!
      email: String!
      address: String
      city: String
      postalCode: String
    ): Customer!
    
    updateCustomer(
      id: Int!
      fullName: String
      address: String
      city: String
      postalCode: String
    ): Customer
    
    # Gestion des commandes
    createOrder(
      customerId: Int!
      items: [OrderItemInput!]!
    ): Order!
    
    updateOrderStatus(id: Int!, status: OrderStatus!): Order
    
    # Paiement
    processPayment(
      orderId: Int!
      cardNumber: String!
      cardExpiry: String!
      cardCVC: String!
    ): Payment!
  }

  input OrderItemInput {
    bookId: Int!
    quantity: Int!
  }
`;

module.exports = typeDefs;
