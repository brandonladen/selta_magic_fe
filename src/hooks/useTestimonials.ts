import { useState, useEffect, useCallback } from 'react';
import { Testimonial, TestimonialFormData, TestimonialFilters } from '@/types/testimonial';
import { testimonialService } from '@/services/testimonialService';

export const useTestimonials = (filters?: TestimonialFilters) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTestimonials = useCallback(() => {
    try {
      console.log('Loading testimonials with filters:', filters);
      setLoading(true);
      setError(null);
      const data = testimonialService.getApprovedTestimonials(filters);
      console.log('Loaded testimonials data:', data);
      setTestimonials(data);
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
      const newTestimonial = testimonialService.addTestimonial(formData);
      // Don't add to current list since it needs approval
      return newTestimonial;
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

  const loadTestimonials = useCallback(() => {
    try {
      console.log('useAdminTestimonials: Loading testimonials...');
      setLoading(true);
      setError(null);
      const data = testimonialService.getAllTestimonials(filters);
      console.log('useAdminTestimonials: Loaded data:', data);
      setTestimonials(data);
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
      const success = testimonialService.approveTestimonial(id);
      if (success) {
        loadTestimonials(); // Refresh the list
      }
      return success;
    } catch (err) {
      setError('Failed to approve testimonial');
      throw err;
    }
  };

  const deleteTestimonial = async (id: string): Promise<boolean> => {
    try {
      const success = testimonialService.deleteTestimonial(id);
      if (success) {
        loadTestimonials(); // Refresh the list
      }
      return success;
    } catch (err) {
      setError('Failed to delete testimonial');
      throw err;
    }
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> => {
    try {
      const updated = testimonialService.updateTestimonial(id, updates);
      if (updated) {
        loadTestimonials(); // Refresh the list
      }
      return updated;
    } catch (err) {
      setError('Failed to update testimonial');
      throw err;
    }
  };

  const getStats = () => {
    return testimonialService.getTestimonialStats();
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
