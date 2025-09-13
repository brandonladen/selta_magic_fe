
import { Button } from "@/components/ui/button";

interface MobileViewAllButtonProps {
  onViewAllClick: (e: React.MouseEvent) => void;
}

export default function MobileViewAllButton({ onViewAllClick }: MobileViewAllButtonProps) {
  return (
    <div className="mt-10 text-center md:hidden">
      <Button 
        className="rounded-full bg-selta-gold hover:bg-selta-gold/90 text-selta-deep-purple px-8 font-bold"
        onClick={onViewAllClick}
      >
        View All Products
      </Button>
    </div>
  );
}
