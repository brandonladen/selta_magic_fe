
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-selta-soft-purple/20 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <h1 className="text-8xl font-display font-bold text-selta-deep-purple mb-4">404</h1>
        <div className="w-16 h-1 bg-selta-gold mx-auto mb-6"></div>
        <p className="text-xl text-gray-600 mb-8">
          Oops! We couldn't find the page you're looking for.
        </p>
        <Link to="/">
          <Button className="bg-selta-gold hover:bg-selta-gold/90 text-white font-medium px-6 py-2 rounded-full transition-all hover:shadow-lg">
            <Home className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </motion.div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-selta-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-selta-purple/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default NotFound;
