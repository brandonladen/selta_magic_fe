
import { Heart, Sparkles, Star } from "lucide-react";

const features = [
  {
    icon: <Sparkles className="h-6 w-6 text-selta-gold" />,
    title: "Premium Ingredients",
    description: "Our products are formulated with only the finest natural ingredients for maximum effectiveness."
  },
  {
    icon: <Heart className="h-6 w-6 text-selta-gold" />,
    title: "Nourishes & Strengthens",
    description: "Provides deep nourishment to your scalp and hair, promoting strength and reducing breakage."
  },
  {
    icon: <Star className="h-6 w-6 text-selta-gold" />,
    title: "No Harmful Additives",
    description: "Free from parabens, sulfates, and artificial colors. Just pure hair-loving goodness."
  }
];

export default function Features() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-selta-soft-purple/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-selta-deep-purple mb-4">
            Why Choose Selta Magic
          </h2>
          <p className="text-gray-600">
            Our products are crafted with care to provide the best results for your hair.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="bg-selta-soft-purple/30 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-display text-xl font-semibold text-selta-deep-purple mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
