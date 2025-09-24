import { Testimonial, TestimonialFormData, TestimonialFilters } from '@/types/testimonial';

const TESTIMONIALS_STORAGE_KEY = 'selta_testimonials';

// Sample initial testimonials for demonstration
const initialTestimonials: Testimonial[] = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    rating: 5,
    title: 'Amazing Hair Growth Results!',
    message: 'I\'ve been using the Hair Growth Oil for 3 months now and the results are incredible! My hair is noticeably thicker and longer. The natural ingredients make me feel confident about what I\'m putting on my scalp.',
    productId: '1',
    productName: 'Hair Growth Oil',
    isApproved: true,
    isVerifiedPurchase: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    customerName: 'Michael Chen',
    customerEmail: 'michael.chen@email.com',
    rating: 4,
    title: 'Great Moisturizing Shampoo',
    message: 'The moisturizing shampoo works really well for my dry hair. It leaves my hair feeling soft and manageable without weighing it down. Would definitely recommend to anyone with similar hair concerns.',
    productId: '2',
    productName: 'Moisturizing Shampoo',
    isApproved: true,
    isVerifiedPurchase: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    customerName: 'Emily Rodriguez',
    customerEmail: 'emily.r@email.com',
    rating: 5,
    title: 'Excellent Customer Service and Products',
    message: 'Not only are the products fantastic, but the customer service is top-notch. I had a question about which products would work best for my hair type, and they provided personalized recommendations that worked perfectly!',
    isApproved: true,
    isVerifiedPurchase: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

class TestimonialService {
  private getTestimonials(): Testimonial[] {
    try {
      const stored = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Initialize with sample data if none exists
      this.saveTestimonials(initialTestimonials);
      return initialTestimonials;
    } catch (error) {
      console.error('Error loading testimonials:', error);
      return initialTestimonials;
    }
  }

  private saveTestimonials(testimonials: Testimonial[]): void {
    try {
      localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(testimonials));
    } catch (error) {
      console.error('Error saving testimonials:', error);
    }
  }

  // Get all testimonials with optional filtering
  getAllTestimonials(filters?: TestimonialFilters): Testimonial[] {
    let testimonials = this.getTestimonials();

    // Apply filters
    if (filters) {
      if (filters.rating) {
        testimonials = testimonials.filter(t => t.rating === filters.rating);
      }
      if (filters.productId) {
        testimonials = testimonials.filter(t => t.productId === filters.productId);
      }
      if (filters.isApproved !== undefined) {
        testimonials = testimonials.filter(t => t.isApproved === filters.isApproved);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'newest':
          testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'oldest':
          testimonials.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          break;
        case 'rating_high':
          testimonials.sort((a, b) => b.rating - a.rating);
          break;
        case 'rating_low':
          testimonials.sort((a, b) => a.rating - b.rating);
          break;
        default:
          testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } else {
      // Default sort by newest
      testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return testimonials;
  }

  // Get approved testimonials only (for public display)
  getApprovedTestimonials(filters?: Omit<TestimonialFilters, 'isApproved'>): Testimonial[] {
    return this.getAllTestimonials({ ...filters, isApproved: true });
  }

  // Get testimonials for a specific product
  getProductTestimonials(productId: string): Testimonial[] {
    return this.getApprovedTestimonials({ productId });
  }

  // Add a new testimonial
  addTestimonial(formData: TestimonialFormData): Testimonial {
    const testimonials = this.getTestimonials();
    const now = new Date().toISOString();
    
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      ...formData,
      isApproved: false, // New testimonials need approval
      isVerifiedPurchase: false, // Would need to check against order history
      createdAt: now,
      updatedAt: now,
    };

    testimonials.push(newTestimonial);
    this.saveTestimonials(testimonials);
    
    return newTestimonial;
  }

  // Update testimonial (admin function)
  updateTestimonial(id: string, updates: Partial<Testimonial>): Testimonial | null {
    const testimonials = this.getTestimonials();
    const index = testimonials.findIndex(t => t.id === id);
    
    if (index === -1) return null;
    
    testimonials[index] = {
      ...testimonials[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    this.saveTestimonials(testimonials);
    return testimonials[index];
  }

  // Delete testimonial (admin function)
  deleteTestimonial(id: string): boolean {
    const testimonials = this.getTestimonials();
    const filteredTestimonials = testimonials.filter(t => t.id !== id);
    
    if (filteredTestimonials.length === testimonials.length) {
      return false; // Testimonial not found
    }
    
    this.saveTestimonials(filteredTestimonials);
    return true;
  }

  // Approve testimonial (admin function)
  approveTestimonial(id: string): boolean {
    const updated = this.updateTestimonial(id, { isApproved: true });
    return updated !== null;
  }

  // Get testimonial statistics
  getTestimonialStats() {
    const testimonials = this.getTestimonials();
    const approved = testimonials.filter(t => t.isApproved);
    
    const ratingCounts = approved.reduce((acc, t) => {
      acc[t.rating] = (acc[t.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const averageRating = approved.length > 0 
      ? approved.reduce((sum, t) => sum + t.rating, 0) / approved.length 
      : 0;

    return {
      total: testimonials.length,
      approved: approved.length,
      pending: testimonials.filter(t => !t.isApproved).length,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingCounts,
    };
  }
}

export const testimonialService = new TestimonialService();
