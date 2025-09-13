
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SectionHeaderProps {
  onViewAllClick: (e: React.MouseEvent) => void;
}

export default function SectionHeader({ onViewAllClick }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-end mb-12">
      <div className="max-w-xl">
        <Badge className="bg-selta-gold/20 text-selta-gold border-0 mb-3">Featured Collection</Badge>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-selta-deep-purple mb-3">
          Best Selling Products
        </h2>
        <p className="text-gray-800 font-medium">
          Our most popular products based on sales. Updated weekly.
        </p>
      </div>
      <div className="hidden md:block">
        <Button 
          variant="outline" 
          className="rounded-full border-selta-deep-purple text-selta-deep-purple hover:bg-selta-deep-purple/10 font-semibold"
          onClick={onViewAllClick}
        >
          View All Products <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
