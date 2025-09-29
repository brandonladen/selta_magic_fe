import { useState, useEffect, useCallback } from 'react';
import { Testimonial, TestimonialFormData, TestimonialFilters } from '@/types/testimonial';
import { testimonialService } from '@/services/testimonialService';
import { testimonialServiceDB } from '@/services/testimonialServiceDB';

export const useTestimonials = (filters?: TestimonialFilters) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTestimonials = useCallback(async () => {
    try {
      console.log('Loading testimonials with filters:', filters);
      setLoading(true);
      setError(null);
      
      // Try database first, fallback to localStorage
      try {
        const dbFilters = { ...filters, isApproved: true };
        const data = await testimonialServiceDB.getAllTestimonials(dbFilters);
        console.log('Loaded testimonials from database:', data);
        setTestimonials(data);
      } catch (dbError) {
        console.warn('Database not available, using localStorage:', dbError);
        const data = testimonialService.getApprovedTestimonials(filters);
        console.log('Loaded testimonials from localStorage:', data);
        setTestimonials(data);
      }
    } catch (err) {
      setError('Failed to load testimonials');
      console.error('Error loading testimonials:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const addTestimonial = async (formData: TestimonialFormData): Promise<Testimonial> => {
    try {
      // Try database first, fallback to localStorage
      try {
        const newTestimonial = await testimonialServiceDB.addTestimonial(formData);
        console.log('Added testimonial to database:', newTestimonial);
        return newTestimonial;
      } catch (dbError) {
        console.warn('Database not available, using localStorage:', dbError);
        const newTestimonial = testimonialService.addTestimonial(formData);
        console.log('Added testimonial to localStorage:', newTestimonial);
        return newTestimonial;
      }
    } catch (err) {
      setError('Failed to submit testimonial');
      throw err;
    }
  };

  const refresh = () => {
    loadTestimonials();
  };

  return {
    testimonials,
    loading,
    error,
    addTestimonial,
    refresh,
  };
};

// Hook for admin testimonial management
export const useAdminTestimonials = (filters?: TestimonialFilters) => {
  console.log('useAdminTestimonials hook called with filters:', filters);
  
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTestimonials = useCallback(async () => {
    try {
      console.log('useAdminTestimonials: Loading testimonials...');
      setLoading(true);
      setError(null);
      
      // Try database first, fallback to localStorage
      try {
        const data = await testimonialServiceDB.getAllTestimonials(filters);
        console.log('useAdminTestimonials: Loaded data from database:', data);
        setTestimonials(data);
      } catch (dbError) {
        console.warn('Database not available, using localStorage:', dbError);
        const data = testimonialService.getAllTestimonials(filters);
        console.log('useAdminTestimonials: Loaded data from localStorage:', data);
        setTestimonials(data);
      }
    } catch (err) {
      console.error('useAdminTestimonials: Error loading testimonials:', err);
      setError('Failed to load testimonials');
    } finally {
      console.log('useAdminTestimonials: Setting loading to false');
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const approveTestimonial = async (id: string): Promise<boolean> => {
    try {
      // Try database first, fallback to localStorage
      try {
        await testimonialServiceDB.approveTestimonial(id);
        loadTestimonials(); // Refresh the list
        return true;
      } catch (dbError) {
        console.warn('Database not available, using localStorage:', dbError);
        const success = testimonialService.approveTestimonial(id);
        if (success) {
          loadTestimonials(); // Refresh the list
        }
        return success;
      }
    } catch (err) {
      setError('Failed to approve testimonial');
      throw err;
    }
  };

  const deleteTestimonial = async (id: string): Promise<boolean> => {
    try {
      // Try database first, fallback to localStorage
      try {
        await testimonialServiceDB.deleteTestimonial(id);
        loadTestimonials(); // Refresh the list
        return true;
      } catch (dbError) {
        console.warn('Database not available, using localStorage:', dbError);
        const success = testimonialService.deleteTestimonial(id);
        if (success) {
          loadTestimonials(); // Refresh the list
        }
        return success;
      }
    } catch (err) {
      setError('Failed to delete testimonial');
      throw err;
    }
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> => {
    try {
      // Try database first, fallback to localStorage
      try {
        const updated = await testimonialServiceDB.updateTestimonial(id, updates);
        loadTestimonials(); // Refresh the list
        return updated;
      } catch (dbError) {
        console.warn('Database not available, using localStorage:', dbError);
        const updated = testimonialService.updateTestimonial(id, updates);
        if (updated) {
          loadTestimonials(); // Refresh the list
        }
        return updated;
      }
    } catch (err) {
      setError('Failed to update testimonial');
      throw err;
    }
  };

  const getStats = async () => {
    try {
      // Try database first, fallback to localStorage
      try {
        return await testimonialServiceDB.getTestimonialStats();
      } catch (dbError) {
        console.warn('Database not available, using localStorage:', dbError);
        return testimonialService.getTestimonialStats();
      }
    } catch (err) {
      console.error('Error getting stats:', err);
      return {
        total: 0,
        approved: 0,
        pending: 0,
        averageRating: 0,
        ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }
  };

  const refresh = () => {
    loadTestimonials();
  };

  return {
    testimonials,
    loading,
    error,
    approveTestimonial,
    deleteTestimonial,
    updateTestimonial,
    getStats,
    refresh,
  };
};
