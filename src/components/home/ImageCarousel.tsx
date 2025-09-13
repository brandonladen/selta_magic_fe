
import { AnimatePresence } from "framer-motion";
import CarouselImage from "../carousel/CarouselImage";
import CarouselControls from "../carousel/CarouselControls";
import { useCarouselImages } from "../carousel/useCarouselImages";
import { useCarouselControls } from "../carousel/useCarouselControls";
import { slideVariants } from "../carousel/CarouselAnimations";

export default function ImageCarousel() {
  const { images, imagesLoaded } = useCarouselImages();
  const { currentIndex, direction, handleDotClick, handlePrev, handleNext } = useCarouselControls(imagesLoaded, images.length);

  if (!imagesLoaded) {
    return (
      <div className="relative w-full aspect-square md:h-[480px] overflow-hidden rounded-2xl glass-effect p-1 flex items-center justify-center bg-white/10">
        <div className="animate-pulse text-selta-gold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square md:h-[480px] overflow-hidden rounded-2xl glass-effect p-1">
      <div className="w-full h-full rounded-xl overflow-hidden bg-white relative">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <CarouselImage
            key={currentIndex}
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            priority={currentIndex < 3}
            direction={direction}
            slideVariants={slideVariants}
          />
        </AnimatePresence>
        
        <CarouselControls
          onPrev={handlePrev}
          onNext={handleNext}
          currentIndex={currentIndex}
          totalImages={images.length}
          onDotClick={handleDotClick}
          imageAlt={images[currentIndex].alt}
        />
      </div>
    </div>
  );
}
