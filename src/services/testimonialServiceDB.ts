import { Testimonial, TestimonialFormData, TestimonialFilters } from '@/types/testimonial';
import { TestimonialAPI } from '@/api/testimonials';

class TestimonialServiceDB {
  // Get all testimonials with optional filtering
  async getAllTestimonials(filters?: TestimonialFilters): Promise<Testimonial[]> {
    try {
      console.log('TestimonialServiceDB.getAllTestimonials called with filters:', filters);
      
      const apiFilters = {
        isApproved: filters?.isApproved,
        productId: filters?.productId,
        rating: filters?.rating,
        sortBy: filters?.sortBy || 'newest',
      };

      const { testimonials } = await TestimonialAPI.getAllTestimonials(apiFilters);
      console.log('TestimonialServiceDB: Loaded testimonials from database:', testimonials);
      
      return testimonials;
    } catch (error) {
      console.error('TestimonialServiceDB: Error loading testimonials:', error);
      // Fallback to empty array if database is not available
      return [];
    }
  }

  // Add a new testimonial
  async addTestimonial(testimonialData: TestimonialFormData): Promise<Testimonial> {
    try {
      console.log('TestimonialServiceDB.addTestimonial called with data:', testimonialData);
      
      const newTestimonial = await TestimonialAPI.createTestimonial(testimonialData);
      console.log('TestimonialServiceDB: Created testimonial:', newTestimonial);
      
      return newTestimonial;
    } catch (error) {
      console.error('TestimonialServiceDB: Error creating testimonial:', error);
      throw error;
    }
  }

  // Update an existing testimonial (admin only)
  async updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
    try {
      console.log('TestimonialServiceDB.updateTestimonial called:', { id, updates });
      
      const updatedTestimonial = await TestimonialAPI.updateTestimonial(id, updates);
      console.log('TestimonialServiceDB: Updated testimonial:', updatedTestimonial);
      
      return updatedTestimonial;
    } catch (error) {
      console.error('TestimonialServiceDB: Error updating testimonial:', error);
      throw error;
    }
  }

  // Delete a testimonial (admin only)
  async deleteTestimonial(id: string): Promise<void> {
    try {
      console.log('TestimonialServiceDB.deleteTestimonial called with id:', id);
      
      await TestimonialAPI.deleteTestimonial(id);
      console.log('TestimonialServiceDB: Deleted testimonial with id:', id);
    } catch (error) {
      console.error('TestimonialServiceDB: Error deleting testimonial:', error);
      throw error;
    }
  }

  // Approve a testimonial (admin only)
  async approveTestimonial(id: string): Promise<Testimonial> {
    try {
      console.log('TestimonialServiceDB.approveTestimonial called with id:', id);
      
      const approvedTestimonial = await TestimonialAPI.approveTestimonial(id);
      console.log('TestimonialServiceDB: Approved testimonial:', approvedTestimonial);
      
      return approvedTestimonial;
    } catch (error) {
      console.error('TestimonialServiceDB: Error approving testimonial:', error);
      throw error;
    }
  }

  // Get testimonial statistics
  async getTestimonialStats(): Promise<{
    total: number;
    approved: number;
    pending: number;
    averageRating: number;
    ratingCounts: Record<number, number>;
  }> {
    try {
      console.log('TestimonialServiceDB.getTestimonialStats called');
      
      const stats = await TestimonialAPI.getTestimonialStats();
      console.log('TestimonialServiceDB: Retrieved stats:', stats);
      
      return stats;
    } catch (error) {
      console.error('TestimonialServiceDB: Error getting stats:', error);
      // Return default stats if database is not available
      return {
        total: 0,
        approved: 0,
        pending: 0,
        averageRating: 0,
        ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }
  }

  // Get testimonial by ID
  async getTestimonialById(id: string): Promise<Testimonial | null> {
    try {
      console.log('TestimonialServiceDB.getTestimonialById called with id:', id);
      
      const testimonial = await TestimonialAPI.getTestimonialById(id);
      console.log('TestimonialServiceDB: Retrieved testimonial:', testimonial);
      
      return testimonial;
    } catch (error) {
      console.error('TestimonialServiceDB: Error getting testimonial by ID:', error);
      return null;
    }
  }

  // Get testimonials for a specific product
  async getTestimonialsByProduct(productId: string, approved: boolean = true): Promise<Testimonial[]> {
    try {
      console.log('TestimonialServiceDB.getTestimonialsByProduct called:', { productId, approved });
      
      const { testimonials } = await TestimonialAPI.getAllTestimonials({
        productId,
        isApproved: approved,
        sortBy: 'newest',
      });
      
      console.log('TestimonialServiceDB: Retrieved product testimonials:', testimonials);
      return testimonials;
    } catch (error) {
      console.error('TestimonialServiceDB: Error getting product testimonials:', error);
      return [];
    }
  }

  // Get recent testimonials (for homepage, etc.)
  async getRecentTestimonials(limit: number = 6): Promise<Testimonial[]> {
    try {
      console.log('TestimonialServiceDB.getRecentTestimonials called with limit:', limit);
      
      const { testimonials } = await TestimonialAPI.getAllTestimonials({
        isApproved: true,
        sortBy: 'newest',
        limit,
      });
      
      console.log('TestimonialServiceDB: Retrieved recent testimonials:', testimonials);
      return testimonials;
    } catch (error) {
      console.error('TestimonialServiceDB: Error getting recent testimonials:', error);
      return [];
    }
  }

  // Search testimonials
  async searchTestimonials(searchTerm: string, filters?: TestimonialFilters): Promise<Testimonial[]> {
    try {
      console.log('TestimonialServiceDB.searchTestimonials called:', { searchTerm, filters });
      
      // Get all testimonials with filters first
      const testimonials = await this.getAllTestimonials(filters);
      
      // Filter by search term on the client side
      // In a real implementation, you might want to do this on the database level
      const filteredTestimonials = testimonials.filter(testimonial => {
        const searchLower = searchTerm.toLowerCase();
        return (
          testimonial.customerName.toLowerCase().includes(searchLower) ||
          testimonial.message.toLowerCase().includes(searchLower) ||
          (testimonial.title?.toLowerCase().includes(searchLower) ?? false) ||
          (testimonial.productName?.toLowerCase().includes(searchLower) ?? false)
        );
      });
      
      console.log('TestimonialServiceDB: Search results:', filteredTestimonials);
      return filteredTestimonials;
    } catch (error) {
      console.error('TestimonialServiceDB: Error searching testimonials:', error);
      return [];
    }
  }
}

// Export a singleton instance
export const testimonialServiceDB = new TestimonialServiceDB();
export default testimonialServiceDB;
