
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    }
  };

  return (
    <footer className="bg-selta-deep-purple/10 pt-16 pb-8 relative z-40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo className="h-10 w-auto" />
            <p className="text-gray-600 mt-2">
              Elevate your beauty with our premium hair care products designed for natural hair growth and health.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-selta-deep-purple hover:text-selta-gold rounded-full" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-selta-deep-purple hover:text-selta-gold rounded-full" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-selta-deep-purple hover:text-selta-gold rounded-full" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-medium mb-4 text-selta-deep-purple">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-selta-gold transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-selta-gold transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-selta-gold transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-selta-gold transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-medium mb-4 text-selta-deep-purple">Our Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-600 hover:text-selta-gold transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-600 hover:text-selta-gold transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-gray-600 hover:text-selta-gold transition-colors">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/return-policy" className="text-gray-600 hover:text-selta-gold transition-colors">Return Policy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-medium mb-4 text-selta-deep-purple">Subscribe</h3>
            <p className="text-gray-600 mb-4">Stay updated with our latest offers.</p>
            <form onSubmit={handleSubscribe} className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-white border-selta-deep-purple/20 focus-visible:ring-selta-gold"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                className="bg-selta-gold hover:bg-selta-gold/90 text-white"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Selta Magic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
