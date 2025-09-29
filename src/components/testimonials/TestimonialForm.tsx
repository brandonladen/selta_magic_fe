import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Send, CheckCircle } from 'lucide-react';
import { TestimonialFormData } from '@/types/testimonial';
import { useTestimonials } from '@/hooks/useTestimonials';
import { useToast } from '@/hooks/use-toast';
import { products } from '@/data/products';

interface TestimonialFormProps {
  productId?: string;
  onSuccess?: () => void;
}

export default function TestimonialForm({ productId, onSuccess }: TestimonialFormProps) {
  const [formData, setFormData] = useState<TestimonialFormData>({
    customerName: '',
    customerEmail: '',
    rating: 5,
    title: '',
    message: '',
    productId: productId || 'general',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addTestimonial } = useTestimonials();
  const { toast } = useToast();

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName.trim() || !formData.customerEmail.trim() || !formData.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.message.length < 10) {
      toast({
        title: "Message Too Short",
        description: "Please provide a more detailed review (at least 10 characters).",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Add product name if productId is provided
      const submissionData = { ...formData };
      if (formData.productId && formData.productId !== 'general') {
        const product = products.find(p => p.id === formData.productId);
        if (product) {
          submissionData.productName = product.name;
        }
      } else if (formData.productId === 'general') {
        // Clear productId for general reviews
        submissionData.productId = '';
        submissionData.productName = '';
      }

      await addTestimonial(submissionData);
      
      setIsSubmitted(true);
      toast({
        title: "Thank You!",
        description: "Your testimonial has been submitted and is pending approval.",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your testimonial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold text-selta-deep-purple">Thank You!</h3>
            <p className="text-gray-600">
              Your testimonial has been submitted successfully. It will be reviewed and published once approved.
            </p>
            <Button 
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  customerName: '',
                  customerEmail: '',
                  rating: 5,
                  title: '',
                  message: '',
                  productId: productId || 'general',
                });
              }}
              variant="outline"
            >
              Submit Another Review
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-selta-deep-purple">Share Your Experience</CardTitle>
        <CardDescription>
          Help other customers by sharing your honest review of our products and services.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Your Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email Address *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Product Selection */}
          {!productId && (
            <div className="space-y-2">
              <Label htmlFor="product">Product (Optional)</Label>
              <Select 
                value={formData.productId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, productId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product you'd like to review" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Review</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="focus:outline-none focus:ring-2 focus:ring-selta-deep-purple rounded"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= formData.rating
                        ? 'text-selta-gold fill-selta-gold'
                        : 'text-gray-300 hover:text-selta-gold'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                ({formData.rating} star{formData.rating !== 1 ? 's' : ''})
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Give your review a title (optional)"
            />
          </div>

          {/* Review Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Your Review *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Share your experience with our products or services..."
              rows={5}
              required
              minLength={10}
            />
            <p className="text-xs text-gray-500">
              Minimum 10 characters ({formData.message.length}/10)
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-selta-deep-purple hover:bg-selta-deep-purple/90"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Your review will be published after approval. We reserve the right to moderate content.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
