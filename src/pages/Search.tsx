
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchProducts, Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  
  useEffect(() => {
    if (initialQuery) {
      const foundProducts = searchProducts(initialQuery);
      setResults(foundProducts);
    }
  }, [initialQuery]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      const foundProducts = searchProducts(searchQuery);
      setResults(foundProducts);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 flex-grow bg-gray-50">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-selta-deep-purple mb-6">
            Search Products
          </h1>
          
          <form onSubmit={handleSearch} className="mb-8 flex gap-2 max-w-xl">
            <Input
              type="search"
              placeholder="Search for hair and beauty products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" className="bg-selta-deep-purple hover:bg-selta-deep-purple/90">
              <SearchIcon className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
          
          {initialQuery && (
            <div className="mb-6">
              <p className="text-gray-600">
                {results.length === 0 
                  ? `No results found for "${initialQuery}"` 
                  : `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${initialQuery}"`}
              </p>
            </div>
          )}
          
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : initialQuery ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-selta-deep-purple mb-2">
                No matching products found
              </h3>
              <p className="text-gray-600 mb-6">
                Try searching with different keywords or browse our collection.
              </p>
              <Button className="bg-selta-gold text-selta-deep-purple hover:bg-selta-gold/90">
                Browse All Products
              </Button>
            </div>
          ) : null}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
