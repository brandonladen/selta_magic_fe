import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface OrderSuccessProps {
  orderId?: string;
}

export default function OrderSuccess({ orderId }: OrderSuccessProps) {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="text-center p-8">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed and is being processed.
          </p>
          
          {orderId && (
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="font-mono font-semibold text-gray-900">#{orderId}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              You will receive an email confirmation shortly with your order details and tracking information.
            </p>
            
            <div className="flex flex-col gap-3 pt-4">
              <Link to="/products">
                <Button className="w-full bg-selta-deep-purple hover:bg-selta-deep-purple/90">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              
              <Link to="/">
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
