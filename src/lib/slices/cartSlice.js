import { api } from '../api';

export const createCartSlice = (set, get) => ({
  cart: [],
  
  addToCart: async (product) => {
    try {
      const currentStock = product.stock;
      if (currentStock <= 0) return;
      
      const existingItem = get().cart.find((item) => item.id === product.id);
      const newStock = currentStock - 1;
      
      // Update stock in database
      await api.updateStock(product.id, newStock);

      if (existingItem) {
        set({
          cart: get().cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        });
      } else {
        set({
          cart: [...get().cart, { ...product, quantity: 1 }],
        });
      }
      
      // Refresh products to update stock
      const { fetchProducts } = get();
      await fetchProducts();
    } catch (error) {
      throw error;
    }
  },

  removeFromCart: async (productId) => {
    try {
      const item = get().cart.find((i) => i.id === productId);
      if (!item) return;

      const product = get().products.find(p => p.id === productId);
      const newStock = product.stock + item.quantity;
      
      // Update stock in database
      await api.updateStock(productId, newStock);
      
      set({
        cart: get().cart.filter((item) => item.id !== productId),
      });
      
      // Refresh products to update stock
      const { fetchProducts } = get();
      await fetchProducts();
    } catch (error) {
      throw error;
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      const item = get().cart.find((i) => i.id === productId);
      if (!item) return;
      
      const product = get().products.find(p => p.id === productId);
      const quantityDiff = quantity - item.quantity;
      const newStock = product.stock - quantityDiff;
      
      if (newStock < 0) return;
      
      // Update stock in database
      await api.updateStock(productId, newStock);
      
      if (quantity === 0) {
        set({
          cart: get().cart.filter((item) => item.id !== productId),
        });
      } else {
        set({
          cart: get().cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      }
      
      // Refresh products to update stock
      const { fetchProducts } = get();
      await fetchProducts();
    } catch (error) {
      throw error;
    }
  },

  clearCart: () => set({ cart: [] }),
});