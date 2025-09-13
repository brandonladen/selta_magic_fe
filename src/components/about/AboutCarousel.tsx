
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import CarouselImage from "../carousel/CarouselImage";
import CarouselControls from "../carousel/CarouselControls";
import { slideVariants } from "../carousel/CarouselAnimations";

interface AboutCarouselImage {
  src: string;
  alt: string;
}

export default function AboutCarousel() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const images: AboutCarouselImage[] = [
    { src: "/lovable-uploads/317ed261-f0ed-4e6a-b704-ecccb1d4700e.png", alt: "Beautiful Natural Hair" },
    { src: "/lovable-uploads/01569230-809c-470b-9493-477d45225b7b.png", alt: "Silky Smooth Hair" },
    { src: "/lovable-uploads/3d3edaf8-6494-415c-bf70-4d6186a3e721.png", alt: "Vibrant Hair Color" },
    { src: "/lovable-uploads/6980a34a-7612-4583-9fc2-fd7f94398517.png", alt: "Elegant Hair Style" },
    { src: "/lovable-uploads/d8e395e3-a691-465a-8922-a688a2b6aa09.png", alt: "Healthy Hair" }
  ];

  useEffect(() => {
    // Preload images
    Promise.all(
      images.map(image => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = image.src;
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Continue even if there's an error
        });
      })
    ).then(() => {
      setImagesLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [imagesLoaded, images.length]);

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  if (!imagesLoaded) {
    return (
      <div className="relative w-full aspect-square md:h-[450px] overflow-hidden rounded-2xl glass-effect p-1 flex items-center justify-center bg-white/10">
        <div className="animate-pulse text-selta-gold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square md:h-[450px] overflow-hidden rounded-2xl glass-effect p-1">
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
