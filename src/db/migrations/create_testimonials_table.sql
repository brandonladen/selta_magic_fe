-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(500),
    message TEXT NOT NULL,
    product_id VARCHAR(255),
    product_name VARCHAR(255),
    is_approved BOOLEAN DEFAULT FALSE,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_product_id ON testimonials(product_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_testimonials_updated_at 
    BEFORE UPDATE ON testimonials 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample testimonials for testing
INSERT INTO testimonials (
    customer_name,
    customer_email,
    rating,
    title,
    message,
    product_id,
    product_name,
    is_approved,
    is_verified_purchase
) VALUES 
(
    'Sarah Johnson',
    'sarah.johnson@email.com',
    5,
    'Amazing Quality!',
    'I absolutely love this product! The quality is outstanding and it exceeded my expectations. Fast shipping and great customer service too.',
    'prod_1',
    'Premium Skincare Set',
    true,
    true
),
(
    'Michael Chen',
    'michael.chen@email.com',
    4,
    'Great value for money',
    'Really good product for the price. Would definitely recommend to others. Only minor issue was the packaging could be better.',
    'prod_2',
    'Natural Face Cream',
    true,
    true
),
(
    'Emma Williams',
    'emma.williams@email.com',
    5,
    'Perfect for sensitive skin',
    'As someone with very sensitive skin, I was hesitant to try new products. But this has been a game-changer! No irritation and my skin looks healthier than ever.',
    'prod_1',
    'Premium Skincare Set',
    true,
    false
),
(
    'David Rodriguez',
    'david.rodriguez@email.com',
    3,
    'Decent product',
    'The product is okay, does what it says but nothing extraordinary. Delivery was fast though.',
    'prod_3',
    'Moisturizing Lotion',
    false,
    true
),
(
    'Lisa Thompson',
    'lisa.thompson@email.com',
    5,
    'Excellent customer service',
    'Not only is the product fantastic, but the customer service team went above and beyond to help me choose the right products for my skin type. Highly recommended!',
    '',
    '',
    true,
    false
);

-- Add some comments for documentation
COMMENT ON TABLE testimonials IS 'Customer testimonials and reviews for products';
COMMENT ON COLUMN testimonials.id IS 'Unique identifier for the testimonial';
COMMENT ON COLUMN testimonials.customer_name IS 'Name of the customer who wrote the testimonial';
COMMENT ON COLUMN testimonials.customer_email IS 'Email address of the customer';
COMMENT ON COLUMN testimonials.rating IS 'Rating given by customer (1-5 stars)';
COMMENT ON COLUMN testimonials.title IS 'Optional title for the testimonial';
COMMENT ON COLUMN testimonials.message IS 'The actual testimonial message';
COMMENT ON COLUMN testimonials.product_id IS 'ID of the product being reviewed (optional for general reviews)';
COMMENT ON COLUMN testimonials.product_name IS 'Name of the product being reviewed';
COMMENT ON COLUMN testimonials.is_approved IS 'Whether the testimonial has been approved by admin';
COMMENT ON COLUMN testimonials.is_verified_purchase IS 'Whether the customer actually purchased the product';
COMMENT ON COLUMN testimonials.created_at IS 'When the testimonial was created';
COMMENT ON COLUMN testimonials.updated_at IS 'When the testimonial was last updated';
