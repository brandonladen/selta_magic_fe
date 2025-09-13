
import { useEffect, lazy, Suspense } from "react";

// For animations
import { motion, AnimatePresence } from "framer-motion";

// Lazy load non-critical components
const Features = lazy(() => import("@/components/home/Features"));
const FeaturedProducts = lazy(() => import("@/components/home/FeaturedProducts"));
const Testimonials = lazy(() => import("@/components/home/Testimonials"));
const HowToUse = lazy(() => import("@/components/home/HowToUse"));
const Cta = lazy(() => import("@/components/home/Cta"));
const Newsletter = lazy(() => import("@/components/home/Newsletter"));
const Hero = lazy(() => import("@/components/home/Hero"));

// Simple loading component
const LoadingSection = () => (
  <div className="py-16 flex justify-center">
    <div className="animate-pulse text-selta-gold">Loading...</div>
  </div>
);

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-b from-selta-deep-purple to-selta-dark-purple min-h-screen"
      >
        <Suspense fallback={<LoadingSection />}>
          <Hero />
        </Suspense>
        <Suspense fallback={<LoadingSection />}>
          <Features />
        </Suspense>
        <Suspense fallback={<LoadingSection />}>
          <FeaturedProducts />
        </Suspense>
        <Suspense fallback={<LoadingSection />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<LoadingSection />}>
          <HowToUse />
        </Suspense>
        <Suspense fallback={<LoadingSection />}>
          <Cta />
        </Suspense>
        <Suspense fallback={<LoadingSection />}>
          <Newsletter />
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
