
import React from 'react';

export default function PrivacyPolicy() {
  // Scroll to top on page load
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="mb-4"><strong>Last Updated: March 16, 2025</strong></p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>Welcome to Selta Magic's Privacy Policy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or make purchases.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          
          <h3 className="text-lg font-medium mt-6 mb-3">2.1 Personal Information</h3>
          <p>We may collect personal information that you voluntarily provide to us when you:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Create an account</li>
            <li>Place an order</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact our customer service</li>
            <li>Participate in promotions or surveys</li>
          </ul>
          
          <p>This information may include:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Billing and shipping address</li>
            <li>Payment information</li>
            <li>Purchase history</li>
          </ul>
          
          <h3 className="text-lg font-medium mt-6 mb-3">2.2 Automatically Collected Information</h3>
          <p>When you visit our website, we automatically collect certain information about your device and browsing actions, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Referring website</li>
            <li>Pages you view</li>
            <li>Time and date of your visit</li>
            <li>Time spent on pages</li>
          </ul>
          
          <h3 className="text-lg font-medium mt-6 mb-3">2.3 Cookies and Similar Technologies</h3>
          <p>We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about orders, products, and services</li>
            <li>Provide customer support</li>
            <li>Personalize your shopping experience</li>
            <li>Send promotional emails about new products, special offers, or other information</li>
            <li>Improve our website, products, and services</li>
            <li>Protect against fraud and unauthorized transactions</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Information Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Service providers who perform services on our behalf</li>
            <li>Payment processors to complete transactions</li>
            <li>Shipping companies to deliver your orders</li>
            <li>Marketing partners with your consent</li>
            <li>Legal authorities when required by law</li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Your Privacy Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access to your personal information</li>
            <li>Correction of inaccurate or incomplete information</li>
            <li>Deletion of your personal information</li>
            <li>Restriction of processing of your personal information</li>
            <li>Data portability</li>
            <li>Objection to processing of your personal information</li>
          </ul>
          <p>To exercise these rights, please contact us using the information provided in the "Contact Us" section.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Children's Privacy</h2>
          <p>Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">8. Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">9. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <ul className="list-none pl-6 mb-4">
            <li>Email: Roosseltam@gmail.com</li>
            <li>Phone: 1-800-SELTA-MAGIC</li>
            <li>Address: Selta Magic Headquarters, 123 Beauty Lane, Hair City, HC 12345</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
