import { useState, useEffect, useCallback } from 'react';
import { Testimonial, TestimonialFormData, TestimonialFilters } from '@/types/testimonial';
import { config } from '@/config/environment';

export const useTestimonials = (filters?: TestimonialFilters) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  const loadTestimonials = useCallback(async () => {
    try {
      console.log('Loading testimonials with filters:', filters);
      setLoading(true);
      setError(null);

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters?.productId) queryParams.append('product_id', filters.productId);
      if (filters?.rating) queryParams.append('rating', filters.rating.toString());
      if (filters?.sortBy) queryParams.append('sort_by', filters.sortBy);
      queryParams.append('isApproved', 'true'); // Always fetch approved testimonials

      const url = `${config.apiBaseUrl}/testimonials?${queryParams.toString()}`;
      console.log('Fetching testimonials from:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Loaded testimonials from API:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      setTestimonials(data.data || []);
    } catch (err) {
      setError('Failed to load testimonials');
      console.error('Error loading testimonials:', err);
      // Set empty array on error to prevent infinite loading
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  }, [
    filters?.productId,
    filters?.rating,
    filters?.sortBy,
    filters?.isApproved
  ]);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const addTestimonial = async (formData: TestimonialFormData): Promise<Testimonial> => {
    try {
      const url = `${config.apiBaseUrl}/testimonials`;
      console.log('Submitting testimonial to:', url, formData);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // Add auth token if needed
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Submitted testimonial:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      return data.data;
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

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters?.productId) queryParams.append('product_id', filters.productId);
      if (filters?.rating) queryParams.append('rating', filters.rating.toString());
      if (filters?.sortBy) queryParams.append('sort_by', filters.sortBy);
      if (filters?.isApproved !== undefined) queryParams.append('is_approved', filters.isApproved.toString());

      const url = `${config.apiBaseUrl}/admin/testimonials?${queryParams.toString()}`;
      console.log('Fetching admin testimonials from:', url);

      const response = await fetch(url, {
        headers: {
          // Add authorization header if needed for admin endpoints
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Loaded admin testimonials from API:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      setTestimonials(data.data || []);
    } catch (err) {
      console.error('useAdminTestimonials: Error loading testimonials:', err);
      setError('Failed to load testimonials');
      setTestimonials([]); // Set empty array to prevent infinite loading
    } finally {
      setLoading(false);
    }
  }, [
    filters?.isApproved,
    filters?.productId,
    filters?.rating,
    filters?.sortBy,
  ]);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const approveTestimonial = async (id: string): Promise<boolean> => {
    try {
      // Call admin API to approve testimonial
      const url = `${config.apiBaseUrl}/admin/testimonials/${id}/status`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // Add auth token if needed
        },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await loadTestimonials(); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to approve testimonial');
      throw err;
    }
  };

  const deleteTestimonial = async (id: string): Promise<boolean> => {
    try {
      const url = `${config.apiBaseUrl}/admin/testimonials/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          // 'Authorization': `Bearer ${token}`, // Add auth token if needed
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await loadTestimonials(); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to delete testimonial');
      throw err;
    }
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> => {
    try {
      const url = `${config.apiBaseUrl}/admin/testimonials/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // Add auth token if needed
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updated = await response.json();
      await loadTestimonials(); // Refresh the list
      return updated.data || null;
    } catch (err) {
      setError('Failed to update testimonial');
      throw err;
    }
  };

  const getStats = async () => {
    try {
      const url = `${config.apiBaseUrl}/admin/testimonials/dashboard`;
      const response = await fetch(url, {
        headers: {
          // 'Authorization': `Bearer ${token}`, // Add auth token if needed
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || null;
    } catch (err) {
      console.error('Error getting stats:', err);
      return {
        overall: null,
        recent: null,
        rating_distribution: [],
        top_products: [],
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
