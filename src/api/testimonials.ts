import pool from '@/lib/database';
import { Testimonial, TestimonialFormData } from '@/types/testimonial';

export class TestimonialAPI {
  // Get all testimonials with optional filters
  static async getAllTestimonials(filters?: {
    isApproved?: boolean;
    productId?: string;
    rating?: number;
    sortBy?: 'newest' | 'oldest' | 'rating_high' | 'rating_low';
    limit?: number;
    offset?: number;
  }): Promise<{ testimonials: Testimonial[]; total: number }> {
    try {
      let query = `
        SELECT 
          id,
          customer_name,
          customer_email,
          rating,
          title,
          message,
          product_id,
          product_name,
          is_approved,
          is_verified_purchase,
          created_at,
          updated_at
        FROM testimonials
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramIndex = 1;

      // Apply filters
      if (filters?.isApproved !== undefined) {
        query += ` AND is_approved = $${paramIndex}`;
        params.push(filters.isApproved);
        paramIndex++;
      }

      if (filters?.productId) {
        query += ` AND product_id = $${paramIndex}`;
        params.push(filters.productId);
        paramIndex++;
      }

      if (filters?.rating) {
        query += ` AND rating = $${paramIndex}`;
        params.push(filters.rating);
        paramIndex++;
      }

      // Apply sorting
      switch (filters?.sortBy) {
        case 'oldest':
          query += ' ORDER BY created_at ASC';
          break;
        case 'rating_high':
          query += ' ORDER BY rating DESC, created_at DESC';
          break;
        case 'rating_low':
          query += ' ORDER BY rating ASC, created_at DESC';
          break;
        default:
          query += ' ORDER BY created_at DESC';
      }

      // Apply pagination
      if (filters?.limit) {
        query += ` LIMIT $${paramIndex}`;
        params.push(filters.limit);
        paramIndex++;
      }

      if (filters?.offset) {
        query += ` OFFSET $${paramIndex}`;
        params.push(filters.offset);
        paramIndex++;
      }

      const result = await pool.query(query, params);

      // Get total count for pagination
      let countQuery = 'SELECT COUNT(*) FROM testimonials WHERE 1=1';
      const countParams: any[] = [];
      let countParamIndex = 1;

      if (filters?.isApproved !== undefined) {
        countQuery += ` AND is_approved = $${countParamIndex}`;
        countParams.push(filters.isApproved);
        countParamIndex++;
      }

      if (filters?.productId) {
        countQuery += ` AND product_id = $${countParamIndex}`;
        countParams.push(filters.productId);
        countParamIndex++;
      }

      if (filters?.rating) {
        countQuery += ` AND rating = $${countParamIndex}`;
        countParams.push(filters.rating);
        countParamIndex++;
      }

      const countResult = await pool.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].count);

      const testimonials: Testimonial[] = result.rows.map(row => ({
        id: row.id,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        rating: row.rating,
        title: row.title,
        message: row.message,
        productId: row.product_id,
        productName: row.product_name,
        isApproved: row.is_approved,
        isVerifiedPurchase: row.is_verified_purchase,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      return { testimonials, total };
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw new Error('Failed to fetch testimonials');
    }
  }

  // Create a new testimonial
  static async createTestimonial(data: TestimonialFormData): Promise<Testimonial> {
    try {
      const query = `
        INSERT INTO testimonials (
          customer_name,
          customer_email,
          rating,
          title,
          message,
          product_id,
          product_name,
          is_approved,
          is_verified_purchase,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        RETURNING *
      `;

      const params = [
        data.customerName,
        data.customerEmail,
        data.rating,
        data.title || null,
        data.message,
        data.productId || null,
        data.productName || null,
        false, // New testimonials need approval
        false, // TODO: Implement verified purchase logic
      ];

      const result = await pool.query(query, params);
      const row = result.rows[0];

      return {
        id: row.id,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        rating: row.rating,
        title: row.title,
        message: row.message,
        productId: row.product_id,
        productName: row.product_name,
        isApproved: row.is_approved,
        isVerifiedPurchase: row.is_verified_purchase,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      console.error('Error creating testimonial:', error);
      throw new Error('Failed to create testimonial');
    }
  }

  // Update testimonial (admin only)
  static async updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
    try {
      const setClause: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      // Build dynamic SET clause
      if (updates.customerName !== undefined) {
        setClause.push(`customer_name = $${paramIndex}`);
        params.push(updates.customerName);
        paramIndex++;
      }

      if (updates.customerEmail !== undefined) {
        setClause.push(`customer_email = $${paramIndex}`);
        params.push(updates.customerEmail);
        paramIndex++;
      }

      if (updates.rating !== undefined) {
        setClause.push(`rating = $${paramIndex}`);
        params.push(updates.rating);
        paramIndex++;
      }

      if (updates.title !== undefined) {
        setClause.push(`title = $${paramIndex}`);
        params.push(updates.title);
        paramIndex++;
      }

      if (updates.message !== undefined) {
        setClause.push(`message = $${paramIndex}`);
        params.push(updates.message);
        paramIndex++;
      }

      if (updates.isApproved !== undefined) {
        setClause.push(`is_approved = $${paramIndex}`);
        params.push(updates.isApproved);
        paramIndex++;
      }

      if (updates.isVerifiedPurchase !== undefined) {
        setClause.push(`is_verified_purchase = $${paramIndex}`);
        params.push(updates.isVerifiedPurchase);
        paramIndex++;
      }

      setClause.push(`updated_at = NOW()`);

      const query = `
        UPDATE testimonials 
        SET ${setClause.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      params.push(id);

      const result = await pool.query(query, params);
      
      if (result.rows.length === 0) {
        throw new Error('Testimonial not found');
      }

      const row = result.rows[0];

      return {
        id: row.id,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        rating: row.rating,
        title: row.title,
        message: row.message,
        productId: row.product_id,
        productName: row.product_name,
        isApproved: row.is_approved,
        isVerifiedPurchase: row.is_verified_purchase,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      console.error('Error updating testimonial:', error);
      throw new Error('Failed to update testimonial');
    }
  }

  // Delete testimonial (admin only)
  static async deleteTestimonial(id: string): Promise<void> {
    try {
      const query = 'DELETE FROM testimonials WHERE id = $1';
      const result = await pool.query(query, [id]);
      
      if (result.rowCount === 0) {
        throw new Error('Testimonial not found');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      throw new Error('Failed to delete testimonial');
    }
  }

  // Get testimonial statistics
  static async getTestimonialStats(): Promise<{
    total: number;
    approved: number;
    pending: number;
    averageRating: number;
    ratingCounts: Record<number, number>;
  }> {
    try {
      // Get basic counts
      const countQuery = `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN is_approved = true THEN 1 END) as approved,
          COUNT(CASE WHEN is_approved = false THEN 1 END) as pending,
          AVG(CASE WHEN is_approved = true THEN rating END) as average_rating
        FROM testimonials
      `;

      const countResult = await pool.query(countQuery);
      const counts = countResult.rows[0];

      // Get rating distribution for approved testimonials
      const ratingQuery = `
        SELECT rating, COUNT(*) as count
        FROM testimonials 
        WHERE is_approved = true
        GROUP BY rating
        ORDER BY rating
      `;

      const ratingResult = await pool.query(ratingQuery);
      
      const ratingCounts: Record<number, number> = {};
      for (let i = 1; i <= 5; i++) {
        ratingCounts[i] = 0;
      }

      ratingResult.rows.forEach(row => {
        ratingCounts[row.rating] = parseInt(row.count);
      });

      return {
        total: parseInt(counts.total),
        approved: parseInt(counts.approved),
        pending: parseInt(counts.pending),
        averageRating: parseFloat(counts.average_rating) || 0,
        ratingCounts,
      };
    } catch (error) {
      console.error('Error getting testimonial stats:', error);
      throw new Error('Failed to get testimonial statistics');
    }
  }

  // Approve testimonial (admin only)
  static async approveTestimonial(id: string): Promise<Testimonial> {
    return this.updateTestimonial(id, { isApproved: true });
  }

  // Get testimonial by ID
  static async getTestimonialById(id: string): Promise<Testimonial | null> {
    try {
      const query = `
        SELECT 
          id,
          customer_name,
          customer_email,
          rating,
          title,
          message,
          product_id,
          product_name,
          is_approved,
          is_verified_purchase,
          created_at,
          updated_at
        FROM testimonials
        WHERE id = $1
      `;

      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];

      return {
        id: row.id,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        rating: row.rating,
        title: row.title,
        message: row.message,
        productId: row.product_id,
        productName: row.product_name,
        isApproved: row.is_approved,
        isVerifiedPurchase: row.is_verified_purchase,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      console.error('Error fetching testimonial by ID:', error);
      throw new Error('Failed to fetch testimonial');
    }
  }
}
