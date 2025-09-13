
import { forwardRef, memo } from "react";
import { motion } from "framer-motion";

interface CarouselImageProps {
  src: string;
  alt: string;
  priority: boolean;
  direction: number;
  slideVariants: any;
}

const CarouselImage = memo(forwardRef<HTMLDivElement, CarouselImageProps>(({ 
  src, 
  alt, 
  priority, 
  direction, 
  slideVariants 
}, ref) => {
  return (
    <motion.div
      ref={ref}
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="absolute inset-0"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        style={{ contentVisibility: "auto" }}
      />
    </motion.div>
  );
}));

CarouselImage.displayName = "CarouselImage";

export default CarouselImage;
