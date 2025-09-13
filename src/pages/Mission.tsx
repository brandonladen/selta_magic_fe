import React from 'react';
import { Helmet } from 'react-helmet';

const Mission = () => (
  <>
    <Helmet>
      <title>Our Mission - Selta Magic</title>
    </Helmet>
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold text-center mb-8">Our Mission</h1>
      <div className="prose mx-auto">
        <p>To inspire confidence and self-love by delivering innovative hair and beauty solutions that are:</p>
        <ul>
          <li><b>Effective</b> – delivering real results for hair and skin.</li>
          <li><b>Inclusive</b> – safe for all hair types, textures, and skin tones.</li>
          <li><b>Empowering</b> – helping individuals embrace their natural beauty.</li>
        </ul>
      </div>
    </div>
  </>
);

export default Mission;
