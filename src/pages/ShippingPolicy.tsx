import React from 'react';

export default function ShippingPolicy() {
  // Scroll to top on page load
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shipping Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Processing Time</h2>
          <p>All orders are processed within 1-2 business days after payment confirmation. Orders placed on weekends or holidays will be processed on the next business day.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Shipping Methods and Timeframes</h2>
          <p>We offer the following shipping options:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Standard Shipping:</strong> 5-7 business days</li>
            <li><strong>Express Shipping:</strong> 2-3 business days</li>
            <li><strong>Next Day Delivery:</strong> 1 business day (order must be placed before 12 PM EST)</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. Shipping Costs</h2>
          <p>Shipping costs are calculated based on the weight of your order and the delivery destination:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Standard Shipping:</strong> $5.99</li>
            <li><strong>Express Shipping:</strong> $12.99</li>
            <li><strong>Next Day Delivery:</strong> $19.99</li>
          </ul>
          <p>Free standard shipping is available for orders over $50.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. International Shipping</h2>
          <p>We currently ship to the United States, Canada, and select European countries. International shipping typically takes 7-14 business days, depending on the destination and customs processing.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Tracking Your Order</h2>
          <p>You will receive a shipping confirmation email with a tracking number once your order has been shipped. You can track your package using the provided tracking number on our website or the carrier's website.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Customs and Import Duties</h2>
          <p>For international orders, please note that you may be responsible for paying customs fees, import duties, and taxes upon delivery. These charges vary by country and are not included in our shipping fees.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Contact Us</h2>
          <p>If you have any questions about our shipping policy, please contact us at:</p>
          <p>Email: shipping@seltamagic.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </div>
    </main>
  );
}
