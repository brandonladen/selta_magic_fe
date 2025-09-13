
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart, Sparkles, Star } from "lucide-react";
import ImageCarousel from "./ImageCarousel";
import { Link, useNavigate } from "react-router-dom";

interface HeroProps {
  className?: string;
}

export default function Hero({ className }: HeroProps) {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    requestAnimationFrame(() => {
      setLoaded(true);
    });
  }, []);

  const handleShopNowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Hero Shop Now button clicked');
    navigate('/products');
  };

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Explore Collection button clicked');
    navigate('/products');
  };

  return (
    <section className="relative overflow-hidden min-h-[90vh] pt-24">
      {/* Modern background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-selta-deep-purple/5 to-selta-purple/10 z-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-selta-gold/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-selta-gold/50 to-transparent"></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 h-64 w-64 bg-selta-gold/10 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-20 left-10 h-64 w-64 bg-selta-purple/10 rounded-full blur-3xl z-0"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-selta-gold/20 text-selta-gold rounded-full font-medium text-sm mb-4 border border-selta-gold/30">
                <Star className="h-4 w-4 mr-2 fill-selta-gold" /> Premium Hair Products
              </div>
            </motion.div>

            <motion.h1
              className="font-display text-4xl md:text-6xl font-bold text-white hero-text-shadow drop-shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              Transform Your Hair With
              <div className="flex items-center">
                <span className="text-selta-gold mr-2">Selta Magic</span>
                <Sparkles className="h-6 w-6 text-selta-gold" />
              </div>
            </motion.h1>

            <motion.p
              className="text-white text-lg font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              Discover our premium collection of hair care products made with natural ingredients. 
              Experience the transformation from the first use.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Button 
                className="bg-selta-gold hover:bg-selta-gold/90 text-selta-deep-purple font-bold px-6 py-6 rounded-full transition-all hover:shadow-lg hover:translate-y-[-2px] group"
                onClick={handleShopNowClick}
              >
                <ShoppingCart className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Shop Now
              </Button>
              <Button 
                variant="outline" 
                className="border-selta-deep-purple text-selta-deep-purple hover:bg-selta-deep-purple/10 px-6 py-6 rounded-full font-semibold"
                onClick={handleExploreClick}
              >
                Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            
            <motion.div
              className="pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-10 w-10 rounded-full border-2 border-white flex items-center justify-center bg-selta-soft-purple/40 text-selta-deep-purple font-semibold shadow-sm`}>
                      {["J", "K", "L", "M"][i-1]}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-800 font-medium">
                  <span className="font-bold text-selta-deep-purple">1200+</span> happy customers
                </div>
              </div>
            </motion.div>
          </div>

          <div className="relative">
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={loaded ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="absolute -top-6 -right-6 w-full h-full bg-gradient-to-br from-selta-gold/20 to-selta-purple/20 rounded-2xl rotate-3 blur-sm"></div>
              <div className="absolute -bottom-6 -left-6 w-full h-full bg-gradient-to-tr from-selta-purple/20 to-selta-gold/20 rounded-2xl -rotate-3 blur-sm"></div>
              
              <div className="relative">
                <ImageCarousel />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
