import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MessageSquare, Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import TestimonialCard from './TestimonialCard';
import TestimonialForm from './TestimonialForm';
import { useTestimonials } from '@/hooks/useTestimonials';

interface ProductTestimonialsProps {
  productId: string;
  productName: string;
}

export default function ProductTestimonials({ productId, productName }: ProductTestimonialsProps) {
  const [showForm, setShowForm] = useState(false);
  const { testimonials, loading, refresh } = useTestimonials({ 
    productId,
    sortBy: 'newest'
  });

  const handleFormSuccess = () => {
    setShowForm(false);
    refresh();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-selta-deep-purple mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const averageRating = testimonials.length > 0 
    ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length 
    : 0;

  const ratingCounts = testimonials.reduce((acc, t) => {
    acc[t.rating] = (acc[t.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-selta-gold" />
                Customer Reviews
              </CardTitle>
              <CardDescription>
                {testimonials.length > 0 
                  ? `${testimonials.length} review${testimonials.length !== 1 ? 's' : ''} for ${productName}`
                  : `No reviews yet for ${productName}`
                }
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Write Review
              </Button>
              <Link to="/testimonials">
                <Button variant="ghost" size="sm">
                  View All Reviews
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {testimonials.length > 0 ? (
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="reviews">Reviews ({testimonials.length})</TabsTrigger>
                <TabsTrigger value="summary">Rating Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="reviews" className="space-y-4">
                <div className="grid gap-4">
                  {testimonials.slice(0, 3).map((testimonial) => (
                    <TestimonialCard 
                      key={testimonial.id} 
                      testimonial={testimonial} 
                      showProduct={false}
                    />
                  ))}
                </div>
                
                {testimonials.length > 3 && (
                  <div className="text-center pt-4 border-t">
                    <Link to={`/testimonials?product=${productId}`}>
                      <Button variant="outline">
                        View All {testimonials.length} Reviews
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="summary">
                <div className="space-y-6">
                  {/* Overall Rating */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-selta-deep-purple mb-2">
                      {averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-6 w-6 ${
                            star <= Math.round(averageRating)
                              ? 'text-selta-gold fill-selta-gold'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">
                      Based on {testimonials.length} review{testimonials.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = ratingCounts[rating] || 0;
                      const percentage = testimonials.length > 0 ? (count / testimonials.length) * 100 : 0;
                      
                      return (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-sm w-8">{rating}</span>
                          <Star className="h-4 w-4 text-selta-gold fill-selta-gold" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-selta-gold h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600 mb-4">
                Be the first to share your experience with {productName}
              </p>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-selta-deep-purple hover:bg-selta-deep-purple/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Write the First Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Review {productName}</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowForm(false)}
              >
                ×
              </Button>
            </div>
            <div className="p-4">
              <TestimonialForm 
                productId={productId}
                onSuccess={handleFormSuccess} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
