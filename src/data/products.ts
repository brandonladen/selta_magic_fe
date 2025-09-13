export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  description: string;
  image: string;
  category: string;
  brand: string;
  stock_quantity: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

// Sample product data
export const products: Product[] = [
  {
    id: "1",
    name: "Hair Growth Oilzzzzzzzzzzzz",
    price: 29.99,
    original_price: 39.99,
    description: "Our premium hair growth oil is formulated with natural ingredients to stimulate hair follicles and promote healthy growth. The unique blend of essential oils and vitamins penetrates deeply to nourish your scalp and strengthen hair from the root.",
    image: "/lovable-uploads/image2.jpeg",
    category: "Hair Care",
    brand: "Selta",
    stock_quantity: 150,
    rating: 4.9,
    reviews: 128,
    isNew: true,
    isBestSeller: true
  },
  {
    id: "2",
    name: "Moisturizing Shampoo",
    price: 19.99,
    description: "A gentle yet effective moisturizing shampoo suitable for all hair types. Infused with natural botanicals and hydrating compounds to cleanse while maintaining your hair's natural moisture balance.",
    image: "/lovable-uploads/3d2dd03b-d2c0-4a87-87da-6572aacdf609.png",
    category: "Hair Care",
    brand: "Selta",
    stock_quantity: 200,
    rating: 4.7,
    reviews: 94,
    isNew: false,
    isBestSeller: false
  },
  {
    id: "3",
    name: "Deep Conditioning Mask",
    price: 24.99,
    description: "An intensive treatment mask designed to repair and revitalize damaged hair. Our deep conditioning formula is enriched with proteins and oils that restore elasticity and shine to over-processed or dry hair.",
    image: "/lovable-uploads/81fc9336-91ab-4beb-b02b-d7ef05d193d6.png",
    category: "Hair Care",
    brand: "Selta",
    stock_quantity: 120,
    rating: 4.8,
    reviews: 56,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "4",
    name: "Hair Strengthening Serumzzzzzzzzzzzzzzzzzzzz",
    price: 34.99,
    original_price: 44.99,
    description: "A powerful serum designed to strengthen hair and prevent breakage. Formulated with biotin and keratin to reinforce hair structure and reduce split ends for healthier, more resilient locks.",
    image: "/lovable-uploads/ebee27d0-56e2-4a7c-9fd4-1dc0ed581077.png",
    category: "Hair Care",
    brand: "Selta",
    stock_quantity: 100,
    rating: 4.9,
    reviews: 72,
    isNew: false,
    isBestSeller: true
  },
];

// Helper functions for product data
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
};

export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) || 
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.brand.toLowerCase().includes(searchTerm)
  );
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.isBestSeller || product.isNew).slice(0, 4);
};

export const getNewProducts = (): Product[] => {
  return products.filter(product => product.isNew);
};

export const getBestSellerProducts = (): Product[] => {
  return products.filter(product => product.isBestSeller);
};
