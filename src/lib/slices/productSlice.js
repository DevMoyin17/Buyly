import { api } from '../api';

export const createProductSlice = (set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  inventory: {},

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await api.fetchProducts();
      const inventory = {};
      products.forEach(product => {
        inventory[product.id] = product.stock;
      });
      set({ products, inventory, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addProduct: async (product) => {
    set({ isLoading: true, error: null });
    try {
      const newProduct = await api.addProduct(product);
      set(state => ({
        products: [...state.products, newProduct],
        inventory: { ...state.inventory, [newProduct.id]: newProduct.stock },
        isLoading: false
      }));
      return newProduct;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateProduct: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProduct = await api.updateProduct(id, updates);
      set(state => ({
        products: state.products.map(product =>
          product.id === id ? updatedProduct : product
        ),
        inventory: { ...state.inventory, [id]: updatedProduct.stock },
        isLoading: false
      }));
      return updatedProduct;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteProduct(id);
      set(state => ({
        products: state.products.filter(product => product.id !== id),
        inventory: { ...state.inventory, [id]: undefined },
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateInventory: async (productId, newStock) => {
    try {
      const product = get().products.find(p => p.id === productId);
      if (!product) return;
      
      const updatedProduct = { ...product, stock: newStock };
      await api.updateProduct(productId, updatedProduct);
      
      set(state => ({
        products: state.products.map(p => 
          p.id === productId ? updatedProduct : p
        ),
        inventory: { ...state.inventory, [productId]: newStock }
      }));
    } catch (error) {
      throw error;
    }
  }
});