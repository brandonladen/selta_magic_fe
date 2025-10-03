
import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useTestimonials } from "@/hooks/useTestimonials";

export default function Testimonials() {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const { testimonials, loading, error } = useTestimonials({ isApproved: true });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const testimonialsPerPage = 3;

  // Calculate total number of pages
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  // Get current testimonials to display
  const getCurrentTestimonials = () => {
    const startIndex = currentIndex * testimonialsPerPage;
    return testimonials.slice(startIndex, startIndex + testimonialsPerPage);
  };

  // Handle navigation
  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  useEffect(() => {
    // Auto-slide every 7 seconds
    const interval = setInterval(() => {
      handleNext();
    }, 7000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    })
  };

  if (loading) {
    return (
      <section className="py-16 bg-selta-soft-purple/30">
        <div className="container mx-auto px-4 text-center text-selta-deep-purple font-semibold">
          Loading testimonials...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-selta-soft-purple/30">
        <div className="container mx-auto px-4 text-center text-red-600 font-semibold">
          Error loading testimonials: {error}
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-16 bg-selta-soft-purple/30">
        <div className="container mx-auto px-4 text-center text-selta-deep-purple font-semibold">
          No testimonials available.
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-selta-soft-purple/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-selta-deep-purple mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-800 font-medium">
            Real reviews from real people who love our products.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute -left-4 md:left-0 top-1/2 transform -translate-y-1/2 z-10">
            <button
              onClick={handlePrev}
              className="bg-white rounded-full p-2 shadow-md text-selta-deep-purple hover:bg-selta-gold hover:text-white transition-colors duration-300"
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={24} />
            </button>
          </div>

          <div className="absolute -right-4 md:right-0 top-1/2 transform -translate-y-1/2 z-10">
            <button
              onClick={handleNext}
              className="bg-white rounded-full p-2 shadow-md text-selta-deep-purple hover:bg-selta-gold hover:text-white transition-colors duration-300"
              aria-label="Next testimonials"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Testimonials Slider */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="overflow-hidden px-4 md:px-10"
          >
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {getCurrentTestimonials().map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  className="bg-white rounded-xl p-6 shadow-md relative"
                >
                  <div className="mb-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "text-selta-gold fill-selta-gold"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-800 mb-6 italic font-medium">
                    "{testimonial.message}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-selta-purple flex items-center justify-center text-white font-semibold">
                      {testimonial.customerName[0]}
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-selta-deep-purple">
                        {testimonial.customerName}
                      </h4>
                      <p className="text-sm text-gray-700 font-medium">
                        {testimonial.productName || "Customer"}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 text-selta-gold/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                    >
                      <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-selta-gold w-6" : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
