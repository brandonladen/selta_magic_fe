
import { useState, useEffect } from "react";

export function useCarouselControls(imagesLoaded: boolean, imagesLength: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!imagesLoaded) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesLength);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [imagesLoaded, imagesLength]);

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + imagesLength) % imagesLength);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesLength);
  };

  return {
    currentIndex,
    direction,
    handleDotClick,
    handlePrev,
    handleNext
  };
}
