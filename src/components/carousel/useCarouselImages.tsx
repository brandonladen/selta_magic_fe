
import { useState, useEffect, useRef } from "react";

export interface ImageType {
  src: string;
  alt: string;
}

export function useCarouselImages() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const loadingRef = useRef<number>(0);
  
  const images: ImageType[] = [
    { src: "/lovable-uploads/image2.jpeg", alt: "Soap Cleanse and Moisturize" },
    { src: "/lovable-uploads/image3.jpeg", alt: "Luxurious Hair Wig" },
    { src: "/lovable-uploads/image4.jpeg", alt: "air Growth Oil" },
    { src: "/lovable-uploads/image1.jpeg", alt: "Hair Growth Oil" }
  ];

  useEffect(() => {
    // To ensure we don't get race conditions with reloads
    const currentLoadingRef = loadingRef.current;
    
    const preloadHighPriority = async () => {
      try {
        // Preload first 3 images with high priority
        const highPriorityImages = images.slice(0, 3);
        await Promise.all(highPriorityImages.map(image => {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.src = image.src;
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        }));
        
        if (loadingRef.current === currentLoadingRef) {
          setImagesLoaded(true);
          console.log('High priority carousel images loaded');
        }
        
        // Then load the rest
        const remainingImages = images.slice(3);
        await Promise.all(remainingImages.map(image => {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.src = image.src;
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        }));
        
        if (loadingRef.current === currentLoadingRef) {
          setAllImagesLoaded(true);
          console.log('All carousel images loaded');
        }
      } catch (error) {
        console.error('Error loading carousel images:', error);
        // Fallback to considering images loaded even if there was an error
        if (loadingRef.current === currentLoadingRef) {
          setImagesLoaded(true);
        }
      }
    };
    
    preloadHighPriority();
    
    return () => {
      // Increment to cancel any in-progress loading when component unmounts
      loadingRef.current += 1;
    };
  }, []);

  return { images, imagesLoaded, allImagesLoaded };
}
