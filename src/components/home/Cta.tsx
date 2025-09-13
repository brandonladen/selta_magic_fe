
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export default function Cta() {
  const navigate = useNavigate();
  
  const handleShopNowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Shop Now button clicked');
    navigate('/products');
  };
  
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-selta-purple/10 to-selta-soft-purple/30 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-selta-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-selta-purple/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-selta-deep-purple mb-4">
            Ready to Transform Your Hair?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Join thousands of satisfied customers who have experienced the magic of our premium hair care products.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              className="bg-selta-gold hover:bg-selta-gold/90 text-white font-medium px-8 py-2 rounded-full transition-all hover:shadow-lg hover:translate-y-[-2px]"
              onClick={handleShopNowClick}
            >
              Shop Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button asChild variant="outline" className="border-selta-deep-purple text-selta-deep-purple hover:bg-selta-deep-purple/10 px-8 py-2 rounded-full">
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
