import React from 'react';
import { Helmet } from 'react-helmet';

const About = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>About Us - Hair & Beauty Products</title>
      </Helmet>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-8">About Our Company</h1>
        <div className="prose mx-auto mb-12">
          <p>At Selta Magic, we believe that beauty starts with confidence—and confidence begins with healthy, radiant hair and skin. Since 2020, we’ve been committed to creating <b>high-quality, natural hair and beauty products</b> designed to enhance your natural glow while promoting long-lasting health and strength.</p>
          <p>From our nourishing Hair Growth Oil to our gentle soaps, every product is crafted with care using ingredients that are safe, effective, and inclusive for all hair types and skin needs.</p>
          <p>We know that beauty is personal, so we make sure our products are not only results-driven but also celebrate uniqueness and empower self-expression.</p>
        </div>
        <div className="prose mx-auto mb-12">
          <h2>Our Mission</h2>
          <p>To inspire confidence and self-love by delivering innovative hair and beauty solutions that are:</p>
          <ul>
            <li><b>Effective</b> – delivering real results for hair and skin.</li>
            <li><b>Inclusive</b> – safe for all hair types, textures, and skin tones.</li>
            <li><b>Empowering</b> – helping individuals embrace their natural beauty.</li>
          </ul>
        </div>
        <div className="prose mx-auto">
          <h2>Quality Promise</h2>
          <ul>
            <li>Made with carefully selected, safe ingredients.</li>
            <li>Designed to nourish, strengthen, and protect.</li>
            <li>Always cruelty-free and tested for performance, never on animals.</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default About;
