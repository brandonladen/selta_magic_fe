import { Star, User, Calendar, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Testimonial } from '@/types/testimonial';

interface TestimonialCardProps {
  testimonial: Testimonial;
  showProduct?: boolean;
}

export default function TestimonialCard({ testimonial, showProduct = true }: TestimonialCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with rating and date */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= testimonial.rating
                      ? 'text-selta-gold fill-selta-gold'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(testimonial.createdAt)}
            </div>
          </div>

          {/* Title */}
          {testimonial.title && (
            <h3 className="font-semibold text-lg text-selta-deep-purple leading-tight">
              {testimonial.title}
            </h3>
          )}

          {/* Message */}
          <p className="text-gray-700 leading-relaxed">
            {testimonial.message}
          </p>

          {/* Product info */}
          {showProduct && testimonial.productName && (
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-gray-400" />
              <Badge variant="secondary" className="text-xs">
                {testimonial.productName}
              </Badge>
            </div>
          )}

          {/* Customer info */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-selta-deep-purple text-white rounded-full flex items-center justify-center font-medium text-sm">
                {getInitials(testimonial.customerName)}
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">
                  {testimonial.customerName}
                </p>
                {testimonial.isVerifiedPurchase && (
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Verified Purchase</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
