
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    // In a real app, this would be connected to your newsletter service
    toast.success("Thank you for subscribing to our newsletter!");
    setEmail("");
  };

  return (
    <section className="py-16 bg-selta-deep-purple/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-selta-deep-purple mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-600 mb-8">
            Stay updated with our latest products, exclusive offers, and hair care tips.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-grow bg-white border-selta-deep-purple/20 focus-visible:ring-selta-gold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button 
              type="submit" 
              className="bg-selta-gold hover:bg-selta-gold/90 text-white"
            >
              Subscribe
            </Button>
          </form>
          
          <p className="text-sm text-gray-500 mt-4">
            We respect your privacy and will never share your information.
          </p>
        </div>
      </div>
    </section>
  );
}
