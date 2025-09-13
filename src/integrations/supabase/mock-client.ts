// Mock Supabase client for local development
import type { Database } from './types';

// Mock user data for development
const mockUsers = new Map();
let currentSession: any = null;

// Mock auth methods
const mockAuth = {
  signUp: async ({ email, password }: { email: string; password: string }) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      id: userId,
      email,
      created_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      email_confirmed_at: new Date().toISOString(),
    };
    
    mockUsers.set(email, { user, password });
    currentSession = { user, access_token: 'mock-token' };
    
    return {
      data: { user, session: currentSession },
      error: null
    };
  },
  
  signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userData = mockUsers.get(email);
    if (!userData || userData.password !== password) {
      return {
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' }
      };
    }
    
    currentSession = { user: userData.user, access_token: 'mock-token' };
    return {
      data: { user: userData.user, session: currentSession },
      error: null
    };
  },
  
  signOut: async () => {
    currentSession = null;
    return { error: null };
  },
  
  getSession: async () => {
    return {
      data: { session: currentSession },
      error: null
    };
  },
  
  onAuthStateChange: (callback: Function) => {
    // Mock subscription
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }
};

// Mock database operations
const mockFrom = (table: string) => ({
  select: (columns?: string) => ({
    eq: (column: string, value: any) => ({
      single: async () => {
        if (table === 'profiles' && currentSession?.user) {
          return {
            data: {
              id: currentSession.user.id,
              first_name: 'Mock',
              last_name: 'User'
            },
            error: null
          };
        }
        if (table === 'user_roles' && currentSession?.user) {
          const isAdmin = currentSession.user.email?.toLowerCase() === 'roosseltam@gmail.com';
          return {
            data: {
              user_id: currentSession.user.id,
              role: isAdmin ? 'admin' : 'user'
            },
            error: null
          };
        }
        return { data: null, error: { message: 'Not found' } };
      }
    })
  }),
  
  insert: async (data: any) => {
    // Mock insert operation
    return { data, error: null };
  }
});

export const supabase = {
  auth: mockAuth,
  from: mockFrom
};
