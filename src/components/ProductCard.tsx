import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

// Product type that matches our database schema
type Product = {
  id: string;
  name: string;
  description: string;
  price: string; // PostgreSQL DECIMAL comes as string
  category: string;
  brand: string;
  image: string;
  original_price?: string;
  rating?: string;
  reviews?: number;
  created_at?: string;
  updated_at?: string;
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  // Use environment variable for API base URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
  
  const handleAddToCart = async () => {
    try {
      await addToCart(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="group relative">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
        {/* Show badges based on rating and recent creation */}
        {(product.rating && parseFloat(product.rating) >= 4.5) && (
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            <Badge className="bg-selta-deep-purple text-white border-0">Top Rated</Badge>
          </div>
        )}
        
        <Link to={`/products/${product.id}`} className="block">
          <div className="aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
            {product.image && product.image.trim() !== '' ? (
              <img
                src={
                  product.image.startsWith('http')
                    ? product.image
                    : product.image.startsWith('/uploads')
                      ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${product.image}`
                      : '/placeholder.svg'
                }
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            ) : (
              <img
                src="/placeholder.svg"
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            )}
          </div>
        </Link>
        
        <div className="p-5">
          {product.rating && (
            <div className="flex items-center mb-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(parseFloat(product.rating!)) ? "text-selta-gold fill-selta-gold" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-xs text-gray-700 ml-2 font-medium">
                ({product.reviews || 0})
              </span>
            </div>
          )}
          
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="font-display text-lg font-semibold text-selta-deep-purple mb-1">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center mb-4">
            <p className="text-selta-gold font-bold">
              ${parseFloat(product.price).toFixed(2)}
            </p>
            {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
              <p className="ml-2 text-gray-500 line-through text-sm">
                ${parseFloat(product.original_price).toFixed(2)}
              </p>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button 
              className="bg-selta-deep-purple hover:bg-selta-deep-purple/90 text-white flex-1 rounded-full font-medium"
              size="sm"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-selta-deep-purple text-selta-deep-purple hover:bg-selta-deep-purple/10"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
