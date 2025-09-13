import React from 'react';

export default function TermsOfService() {
  // Scroll to top on page load
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using Selta Magic's website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Products and Services</h2>
          <p>All product descriptions, pricing, promotions, and availability are subject to change without notice. We reserve the right to discontinue any product at any time.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p>When you create an account with us, you are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
          <p>All content on our website, including text, graphics, logos, and images, is the property of Selta Magic and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express permission.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. User Content</h2>
          <p>By submitting content to our website (such as product reviews or comments), you grant Selta Magic a non-exclusive, royalty-free license to use, reproduce, and display your content in connection with our services.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Limitation of Liability</h2>
          <p>Selta Magic shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use or inability to use our services.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Governing Law</h2>
          <p>These Terms of Service shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">8. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms of Service at any time. It is your responsibility to review these terms periodically for changes.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">9. Contact Us</h2>
          <p>If you have any questions about our Terms of Service, please contact us at:</p>
          <p>Email: legal@seltamagic.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </div>
    </main>
  );
}
