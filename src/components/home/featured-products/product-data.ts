
import { FeaturedProduct } from './types';

export const featuredProducts: FeaturedProduct[] = [
  {
    id: 1,
    name: "Luxurious Hair Wig",
    price: 29.99,
    rating: 4.9,
    reviews: 128,
    image: "/lovable-uploads/image3.jpeg",
    isNew: true,
    isBestSeller: true
  },
  {
    id: 2,
    name: "Soap Cleanse and Moisturize",
    price: 19.99,
    rating: 4.7,
    reviews: 94,
    image: "/lovable-uploads/image2.jpeg",
    isNew: false,
    isBestSeller: false
  },
  {
    id: 3,
    name: "Hair Oil",
    price: 24.99,
    rating: 4.8,
    reviews: 56,
    image: "/lovable-uploads/image4.jpeg",
    isNew: true,
    isBestSeller: false
  }
];
