import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useAuth } from './useAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: any, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  loading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load cart from localStorage or database on component mount
  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    setLoading(true);
    try {
      if (user) {
        // Load from database for logged-in users
        console.log('Loading cart from database for user:', user.id);
        const token = localStorage.getItem('auth_token');
        if (token) {
          const response = await fetch(`${API_BASE_URL}/cart`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const result = await response.json();
            console.log('Cart loaded from database:', result.data);
            setCartItems(result.data || []);
          } else {
            console.error('Failed to load cart from database');
            loadFromLocalStorage();
          }
        } else {
          loadFromLocalStorage();
        }
      } else {
        // Load from localStorage for non-logged-in users
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('Cart loaded from localStorage:', parsedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('cart');
        setCartItems([]);
      }
    }
  };

  // Save cart to localStorage for non-logged-in users
  useEffect(() => {
    if (!user) {
      try {
        console.log('Saving cart to localStorage:', cartItems);
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cartItems, user]);

  const addToCart = async (product: any, quantity = 1) => {
    try {
      console.log('Adding to cart:', { product, quantity, user: user?.id });
      setLoading(true);
      
      if (user) {
        // Add to database for logged-in users
        const token = localStorage.getItem('auth_token');
        if (token) {
          const response = await fetch(`${API_BASE_URL}/cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              product_id: product.id,
              quantity: quantity
            }),
          });
          
          if (response.ok) {
            const result = await response.json();
            console.log('Item added to database cart:', result);
            // Reload cart from database
            await loadCart();
          } else {
            const error = await response.json();
            console.error('Failed to add to database cart:', error);
            throw new Error(error.error || 'Failed to add to cart');
          }
        } else {
          throw new Error('Authentication required');
        }
      } else {
        // Add to localStorage for non-logged-in users
        setCartItems(prevItems => {
          console.log('Previous cart items:', prevItems);
          
          // Check if item already exists in cart
          const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
          
          if (existingItemIndex >= 0) {
            // Update quantity of existing item
            const updatedItems = [...prevItems];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity
            };
            console.log('Updated existing item:', updatedItems);
            return updatedItems;
          } else {
            // Add new item to cart
            const newItem = {
              id: product.id,
              name: product.name,
              price: parseFloat(product.price) || 0,
              quantity,
              image: product.image_url || product.image || '/placeholder.svg'
            };
            console.log('Adding new item:', newItem);
            const newItems = [...prevItems, newItem];
            console.log('New cart items:', newItems);
            return newItems;
          }
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setLoading(true);
      
      if (user) {
        // Remove from database for logged-in users
        const token = localStorage.getItem('auth_token');
        if (token) {
          const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            console.log('Item removed from database cart');
            // Reload cart from database
            await loadCart();
          } else {
            const error = await response.json();
            console.error('Failed to remove from database cart:', error);
          }
        }
      } else {
        // Remove from localStorage for non-logged-in users
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }
      
      if (user) {
        // Update in database for logged-in users
        const token = localStorage.getItem('auth_token');
        if (token) {
          const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ quantity }),
          });
          
          if (response.ok) {
            console.log('Cart item quantity updated in database');
            // Reload cart from database
            await loadCart();
          } else {
            const error = await response.json();
            console.error('Failed to update quantity in database cart:', error);
          }
        }
      } else {
        // Update in localStorage for non-logged-in users
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.id === productId ? { ...item, quantity } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      
      if (user) {
        // Clear database cart for logged-in users
        const token = localStorage.getItem('auth_token');
        if (token) {
          const response = await fetch(`${API_BASE_URL}/cart`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            console.log('Database cart cleared');
            setCartItems([]);
          } else {
            const error = await response.json();
            console.error('Failed to clear database cart:', error);
          }
        }
      } else {
        // Clear localStorage cart for non-logged-in users
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
