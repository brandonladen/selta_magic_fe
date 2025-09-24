export interface Testimonial {
  id: string;
  customerName: string;
  customerEmail: string;
  rating: number; // 1-5 stars
  title: string;
  message: string;
  productId?: string; // Optional: link to specific product
  productName?: string;
  isApproved: boolean; // Admin approval status
  isVerifiedPurchase: boolean; // Whether customer actually bought the product
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialFormData {
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  message: string;
  productId?: string;
  productName?: string;
}

export interface TestimonialFilters {
  rating?: number;
  productId?: string;
  isApproved?: boolean;
  sortBy?: 'newest' | 'oldest' | 'rating_high' | 'rating_low';
}
