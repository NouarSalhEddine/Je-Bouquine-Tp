import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Container,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Heading,
  useToast,
  Badge,
  Grid,
  Image,
  InputGroup,
  InputLeftElement,
  Select,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Divider,
  IconButton,
  Flex,
  Card,
  CardBody,
  Stack,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import {
  Search,
  ShoppingCart,
  BookOpen,
  Menu,
  Trash2,
  Plus,
  Minus,
  CreditCard,
} from "lucide-react";

// Données simulées des livres
const mockBooks = [
  {
    id: 1,
    title: "JavaScript: The Definitive Guide",
    author: "David Flanagan",
    publisher: "O'Reilly",
    category: "Informatique",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    description: "Guide complet de JavaScript pour développeurs",
    stock: 15,
    language: "Anglais",
  },
  {
    id: 2,
    title: "Python Crash Course",
    author: "Eric Matthes",
    publisher: "Addison-Wesley",
    category: "Informatique",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    description: "Introduction pratique à Python",
    stock: 20,
    language: "Anglais",
  },
  {
    id: 3,
    title: "Design Patterns",
    author: "Gang of Four",
    publisher: "Addison-Wesley",
    category: "Informatique",
    price: 54.99,
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    description: "Les patterns de conception essentiels",
    stock: 10,
    language: "Anglais",
  },
  {
    id: 4,
    title: "Le Jardin Moderne",
    author: "Marie Dubois",
    publisher: "Rustica",
    category: "Jardinage",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    description: "Guide complet du jardinage urbain",
    stock: 25,
    language: "Français",
  },
  {
    id: 5,
    title: "Psychologie Cognitive",
    author: "Jean Martin",
    publisher: "Dunod",
    category: "Psychologie",
    price: 44.99,
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop",
    description: "Introduction à la psychologie cognitive",
    stock: 12,
    language: "Français",
  },
  {
    id: 6,
    title: "Décoration Intérieure",
    author: "Sophie Laurent",
    publisher: "Eyrolles",
    category: "Décoration",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop",
    description: "Créer un intérieur harmonieux",
    stock: 18,
    language: "Français",
  },
  {
    id: 7,
    title: "Web Development with Node",
    author: "John Smith",
    publisher: "Wiley",
    category: "Informatique",
    price: 45.99,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
    description: "Développement web avec Node.js",
    stock: 14,
    language: "Anglais",
  },
  {
    id: 8,
    title: "Physics for Engineers",
    author: "Dr. Robert Lee",
    publisher: "McGraw-Hill",
    category: "Sciences et techniques",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop",
    description: "Physique appliquée pour ingénieurs",
    stock: 8,
    language: "Anglais",
  },
];

const categories = [
  "Toutes",
  "Informatique",
  "Sciences et techniques",
  "Psychologie",
  "Décoration",
  "Jardinage",
];

const JeBouquine = () => {
  const [books, setBooks] = useState(mockBooks);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [selectedBook, setSelectedBook] = useState(null);
  const [orderStep, setOrderStep] = useState(1);
  const [orderForm, setOrderForm] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  });

  const {
    isOpen: isCartOpen,
    onOpen: onCartOpen,
    onClose: onCartClose,
  } = useDisclosure();
  const {
    isOpen: isBookOpen,
    onOpen: onBookOpen,
    onClose: onBookClose,
  } = useDisclosure();
  const {
    isOpen: isCheckoutOpen,
    onOpen: onCheckoutOpen,
    onClose: onCheckoutClose,
  } = useDisclosure();
  const toast = useToast();

  // Filtrer les livres
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.publisher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Toutes" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Ajouter au panier
  const addToCart = (book) => {
    const existingItem = cart.find((item) => item.id === book.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...book, quantity: 1 }]);
    }
    toast({
      title: "Ajouté au panier",
      description: `"${book.title}" a été ajouté à votre panier`,
      status: "success",
      duration: 2000,
    });
  };

  // Modifier quantité
  const updateQuantity = (bookId, delta) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === bookId) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Supprimer du panier
  const removeFromCart = (bookId) => {
    setCart(cart.filter((item) => item.id !== bookId));
  };

  // Calculer total
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Voir détails livre
  const viewBookDetails = (book) => {
    setSelectedBook(book);
    onBookOpen();
  };

  // Passer commande
  const handleCheckout = () => {
    onCartClose();
    onCheckoutOpen();
    setOrderStep(1);
  };

  const completeOrder = () => {
    toast({
      title: "Commande validée !",
      description: `Merci pour votre commande de ${cartTotal.toFixed(2)}€`,
      status: "success",
      duration: 5000,
    });
    setCart([]);
    setOrderForm({
      fullName: "",
      email: "",
      address: "",
      city: "",
      postalCode: "",
      cardNumber: "",
      cardExpiry: "",
      cardCVC: "",
    });
    onCheckoutClose();
  };

  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.50">
        {/* Header */}
        <Box
          bg="blue.600"
          color="white"
          py={4}
          shadow="md"
          position="sticky"
          top={0}
          zIndex={10}
        >
          <Container maxW="container.xl">
            <Flex justify="space-between" align="center">
              <HStack spacing={3}>
                <BookOpen size={32} />
                <Heading size="lg">JeBouquine.com</Heading>
              </HStack>

              <HStack spacing={4}>
                <InputGroup
                  maxW="400px"
                  display={{ base: "none", md: "block" }}
                >
                  <InputLeftElement pointerEvents="none">
                    <Search color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Rechercher un livre..."
                    bg="white"
                    color="gray.800"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>

                <Button
                  leftIcon={<ShoppingCart size={20} />}
                  colorScheme="whiteAlpha"
                  variant="solid"
                  onClick={onCartOpen}
                  position="relative"
                >
                  Panier
                  {cart.length > 0 && (
                    <Badge
                      colorScheme="red"
                      position="absolute"
                      top="-8px"
                      right="-8px"
                      borderRadius="full"
                      px={2}
                    >
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </HStack>
            </Flex>
          </Container>
        </Box>

        {/* Barre de catégories */}
        <Box bg="white" py={3} shadow="sm">
          <Container maxW="container.xl">
            <HStack spacing={2} overflowX="auto" pb={2}>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  size="sm"
                  colorScheme={selectedCategory === cat ? "blue" : "gray"}
                  variant={selectedCategory === cat ? "solid" : "outline"}
                  onClick={() => setSelectedCategory(cat)}
                  flexShrink={0}
                >
                  {cat}
                </Button>
              ))}
            </HStack>
          </Container>
        </Box>

        {/* Contenu principal */}
        <Container maxW="container.xl" py={8}>
          {/* Recherche mobile */}
          <Box display={{ base: "block", md: "none" }} mb={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Search color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Rechercher..."
                bg="white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Box>

          <Heading size="md" mb={4}>
            {selectedCategory === "Toutes"
              ? "Tous nos ouvrages"
              : `Rayon ${selectedCategory}`}
            <Badge ml={2} colorScheme="blue">
              {filteredBooks.length} livres
            </Badge>
          </Heading>

          {/* Grille de livres */}
          <Grid
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={6}
          >
            {filteredBooks.map((book) => (
              <Card
                key={book.id}
                cursor="pointer"
                _hover={{ shadow: "lg", transform: "translateY(-4px)" }}
                transition="all 0.3s"
                onClick={() => viewBookDetails(book)}
              >
                <CardBody>
                  <Image
                    src={book.image}
                    alt={book.title}
                    borderRadius="md"
                    h="250px"
                    w="100%"
                    objectFit="cover"
                    mb={4}
                  />
                  <Stack spacing={2}>
                    <Badge colorScheme="purple" w="fit-content">
                      {book.category}
                    </Badge>
                    <Heading size="sm" noOfLines={2}>
                      {book.title}
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      {book.author}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {book.publisher}
                    </Text>
                    <HStack justify="space-between" pt={2}>
                      <Text fontSize="xl" fontWeight="bold" color="blue.600">
                        {book.price.toFixed(2)}€
                      </Text>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        leftIcon={<Plus size={16} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(book);
                        }}
                      >
                        Ajouter
                      </Button>
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </Grid>

          {filteredBooks.length === 0 && (
            <Box textAlign="center" py={12}>
              <Text fontSize="lg" color="gray.500">
                Aucun livre trouvé pour cette recherche
              </Text>
            </Box>
          )}
        </Container>

        {/* Drawer Panier */}
        <Drawer
          isOpen={isCartOpen}
          placement="right"
          onClose={onCartClose}
          size="md"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">
              Mon Panier ({cart.length})
            </DrawerHeader>
            <DrawerBody>
              {cart.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <ShoppingCart
                    size={48}
                    style={{ margin: "0 auto", opacity: 0.3 }}
                  />
                  <Text mt={4} color="gray.500">
                    Votre panier est vide
                  </Text>
                </Box>
              ) : (
                <VStack spacing={4} align="stretch">
                  {cart.map((item) => (
                    <Box key={item.id} p={4} bg="gray.50" borderRadius="md">
                      <HStack justify="space-between" mb={2}>
                        <Text fontWeight="bold" flex={1}>
                          {item.title}
                        </Text>
                        <IconButton
                          icon={<Trash2 size={16} />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                        />
                      </HStack>
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        {item.author}
                      </Text>
                      <HStack justify="space-between">
                        <HStack>
                          <IconButton
                            icon={<Minus size={16} />}
                            size="sm"
                            onClick={() => updateQuantity(item.id, -1)}
                          />
                          <Text fontWeight="bold">{item.quantity}</Text>
                          <IconButton
                            icon={<Plus size={16} />}
                            size="sm"
                            onClick={() => updateQuantity(item.id, 1)}
                          />
                        </HStack>
                        <Text fontWeight="bold" color="blue.600">
                          {(item.price * item.quantity).toFixed(2)}€
                        </Text>
                      </HStack>
                    </Box>
                  ))}

                  <Divider />

                  <HStack
                    justify="space-between"
                    fontSize="xl"
                    fontWeight="bold"
                  >
                    <Text>Total:</Text>
                    <Text color="blue.600">{cartTotal.toFixed(2)}€</Text>
                  </HStack>

                  <Button
                    colorScheme="blue"
                    size="lg"
                    w="full"
                    leftIcon={<CreditCard size={20} />}
                    onClick={handleCheckout}
                  >
                    Commander
                  </Button>
                </VStack>
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Modal Détails Livre */}
        <Modal isOpen={isBookOpen} onClose={onBookClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody p={6}>
              {selectedBook && (
                <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={6}>
                  <Image
                    src={selectedBook.image}
                    alt={selectedBook.title}
                    borderRadius="md"
                    w="100%"
                    objectFit="cover"
                  />
                  <VStack align="stretch" spacing={3}>
                    <Badge colorScheme="purple" w="fit-content">
                      {selectedBook.category}
                    </Badge>
                    <Heading size="lg">{selectedBook.title}</Heading>
                    <Text fontWeight="bold" color="gray.700">
                      Par {selectedBook.author}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Éditeur: {selectedBook.publisher}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Langue: {selectedBook.language}
                    </Text>
                    <Text>{selectedBook.description}</Text>
                    <HStack>
                      <Badge
                        colorScheme={
                          selectedBook.stock > 10 ? "green" : "orange"
                        }
                      >
                        {selectedBook.stock} en stock
                      </Badge>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between" pt={2}>
                      <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                        {selectedBook.price.toFixed(2)}€
                      </Text>
                      <Button
                        colorScheme="blue"
                        size="lg"
                        leftIcon={<ShoppingCart size={20} />}
                        onClick={() => {
                          addToCart(selectedBook);
                          onBookClose();
                        }}
                      >
                        Ajouter au panier
                      </Button>
                    </HStack>
                  </VStack>
                </Grid>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Modal Commande */}
        <Modal isOpen={isCheckoutOpen} onClose={onCheckoutClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Finaliser la commande</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Tabs
                index={orderStep - 1}
                onChange={(index) => setOrderStep(index + 1)}
              >
                <TabList>
                  <Tab>1. Livraison</Tab>
                  <Tab isDisabled={!orderForm.fullName || !orderForm.email}>
                    2. Paiement
                  </Tab>
                  <Tab isDisabled={!orderForm.cardNumber}>3. Confirmation</Tab>
                </TabList>

                <TabPanels>
                  {/* Étape 1: Informations de livraison */}
                  <TabPanel>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Nom complet</FormLabel>
                        <Input
                          value={orderForm.fullName}
                          onChange={(e) =>
                            setOrderForm({
                              ...orderForm,
                              fullName: e.target.value,
                            })
                          }
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          value={orderForm.email}
                          onChange={(e) =>
                            setOrderForm({
                              ...orderForm,
                              email: e.target.value,
                            })
                          }
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Adresse</FormLabel>
                        <Textarea
                          value={orderForm.address}
                          onChange={(e) =>
                            setOrderForm({
                              ...orderForm,
                              address: e.target.value,
                            })
                          }
                        />
                      </FormControl>
                      <SimpleGrid columns={2} spacing={4} w="full">
                        <FormControl isRequired>
                          <FormLabel>Ville</FormLabel>
                          <Input
                            value={orderForm.city}
                            onChange={(e) =>
                              setOrderForm({
                                ...orderForm,
                                city: e.target.value,
                              })
                            }
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel>Code postal</FormLabel>
                          <Input
                            value={orderForm.postalCode}
                            onChange={(e) =>
                              setOrderForm({
                                ...orderForm,
                                postalCode: e.target.value,
                              })
                            }
                          />
                        </FormControl>
                      </SimpleGrid>
                      <Button
                        colorScheme="blue"
                        w="full"
                        onClick={() => setOrderStep(2)}
                        isDisabled={
                          !orderForm.fullName ||
                          !orderForm.email ||
                          !orderForm.address
                        }
                      >
                        Continuer vers le paiement
                      </Button>
                    </VStack>
                  </TabPanel>

                  {/* Étape 2: Paiement */}
                  <TabPanel>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Numéro de carte</FormLabel>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          value={orderForm.cardNumber}
                          onChange={(e) =>
                            setOrderForm({
                              ...orderForm,
                              cardNumber: e.target.value,
                            })
                          }
                        />
                      </FormControl>
                      <SimpleGrid columns={2} spacing={4} w="full">
                        <FormControl isRequired>
                          <FormLabel>Date d'expiration</FormLabel>
                          <Input
                            placeholder="MM/AA"
                            value={orderForm.cardExpiry}
                            onChange={(e) =>
                              setOrderForm({
                                ...orderForm,
                                cardExpiry: e.target.value,
                              })
                            }
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel>CVC</FormLabel>
                          <Input
                            placeholder="123"
                            value={orderForm.cardCVC}
                            onChange={(e) =>
                              setOrderForm({
                                ...orderForm,
                                cardCVC: e.target.value,
                              })
                            }
                          />
                        </FormControl>
                      </SimpleGrid>
                      <Button
                        colorScheme="blue"
                        w="full"
                        onClick={() => setOrderStep(3)}
                        isDisabled={
                          !orderForm.cardNumber ||
                          !orderForm.cardExpiry ||
                          !orderForm.cardCVC
                        }
                      >
                        Vérifier la commande
                      </Button>
                    </VStack>
                  </TabPanel>

                  {/* Étape 3: Confirmation */}
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <Heading size="md">
                        Récapitulatif de votre commande
                      </Heading>
                      <Box p={4} bg="gray.50" borderRadius="md">
                        <Text fontWeight="bold" mb={2}>
                          Livraison:
                        </Text>
                        <Text>{orderForm.fullName}</Text>
                        <Text>{orderForm.address}</Text>
                        <Text>
                          {orderForm.postalCode} {orderForm.city}
                        </Text>
                      </Box>
                      <Box p={4} bg="gray.50" borderRadius="md">
                        <Text fontWeight="bold" mb={2}>
                          Articles ({cart.length}):
                        </Text>
                        {cart.map((item) => (
                          <HStack key={item.id} justify="space-between" mb={1}>
                            <Text fontSize="sm">
                              {item.title} x{item.quantity}
                            </Text>
                            <Text fontSize="sm" fontWeight="bold">
                              {(item.price * item.quantity).toFixed(2)}€
                            </Text>
                          </HStack>
                        ))}
                        <Divider my={2} />
                        <HStack
                          justify="space-between"
                          fontWeight="bold"
                          fontSize="lg"
                        >
                          <Text>Total:</Text>
                          <Text color="blue.600">{cartTotal.toFixed(2)}€</Text>
                        </HStack>
                      </Box>
                      <Button
                        colorScheme="green"
                        size="lg"
                        w="full"
                        onClick={completeOrder}
                      >
                        Valider et payer
                      </Button>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
};

export default JeBouquine;
