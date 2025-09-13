import React from 'react';
import { Helmet } from 'react-helmet';

const FAQ = () => (
  <>
    <Helmet>
      <title>Frequently Asked Questions - Selta Magic</title>
    </Helmet>
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>
      <div className="prose mx-auto space-y-6">
        <div>
          <p className="font-medium">What is your return policy?</p>
          <p>We accept returns within 30 days of purchase with receipt.</p>
        </div>
        <div>
          <p className="font-medium">Do you ship internationally?</p>
          <p>Yes, we proudly ship worldwide so everyone can experience Selta Magic.</p>
        </div>
        <div>
          <p className="font-medium">Are your products cruelty-free?</p>
          <p>Absolutely. All of our products are cruelty-free and never tested on animals.</p>
        </div>
      </div>
    </div>
  </>
);

export default FAQ;
