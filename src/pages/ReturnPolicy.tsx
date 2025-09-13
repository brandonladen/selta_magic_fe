
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ReturnPolicy() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Return Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Return Period</h2>
            <p>We accept returns within 30 days of delivery. To be eligible for a return, your item must be unused, in the same condition that you received it, and in its original packaging.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. Return Process</h2>
            <p>To initiate a return, please follow these steps:</p>
            <ol className="list-decimal pl-6 mb-4">
              <li>Contact our customer service team at returns@seltamagic.com or call (123) 456-7890 to request a return authorization number.</li>
              <li>Pack the item securely in its original packaging.</li>
              <li>Include the return authorization number on the outside of the package.</li>
              <li>Ship the package to the address provided by our customer service team.</li>
            </ol>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. Refunds</h2>
            <p>Once we receive and inspect your return, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.</p>
            <p>If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-7 business days.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Exchanges</h2>
            <p>If you need to exchange an item for a different size or product, please first return your original purchase following our return process, and then place a new order for the desired item.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Damaged or Defective Items</h2>
            <p>If you receive a damaged or defective item, please contact our customer service team within 48 hours of delivery. We will provide instructions for returning the item and send a replacement as soon as possible.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">6. Return Shipping Costs</h2>
            <p>Customers are responsible for return shipping costs unless the item received was damaged, defective, or incorrect. In such cases, we will provide a prepaid shipping label.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">7. Non-Returnable Items</h2>
            <p>The following items cannot be returned:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Gift cards</li>
              <li>Sale items marked as final sale</li>
              <li>Products that have been opened, used, or had their seals broken</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">8. Contact Us</h2>
            <p>If you have any questions about our return policy, please contact us at:</p>
            <p>Email: returns@seltamagic.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
