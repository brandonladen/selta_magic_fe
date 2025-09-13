
import { memo } from "react";

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalImages: number;
  onDotClick: (index: number) => void;
  imageAlt: string;
}

const CarouselControls = memo(({ 
  onPrev, 
  onNext, 
  currentIndex, 
  totalImages, 
  onDotClick,
  imageAlt
}: CarouselControlsProps) => {
  return (
    <>
      <button 
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full text-selta-deep-purple hover:bg-white transition-all z-10"
        aria-label="Previous image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      
      <button 
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full text-selta-deep-purple hover:bg-white transition-all z-10"
        aria-label="Next image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {Array.from({ length: totalImages }).map((_, index) => (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-selta-gold w-6"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
        <h3 className="text-xl font-display font-semibold drop-shadow-md">{imageAlt}</h3>
      </div>
    </>
  );
});

CarouselControls.displayName = "CarouselControls";

export default CarouselControls;
