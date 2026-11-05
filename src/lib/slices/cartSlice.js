import { api } from '../api';

export const createCartSlice = (set, get) => ({
  cart: [],

  addToCart: async (product, quantity = 1) => {
    const amount = Math.max(1, Number(quantity) || 1);
    const currentStock = Number(product.stock);
    if (!Number.isFinite(currentStock) || currentStock < amount) {
      throw new Error('Not enough stock available');
    }

    const existingItem = get().cart.find((item) => item.id === product.id);
    const newStock = currentStock - amount;

    await api.updateStock(product.id, newStock);

    if (existingItem) {
      set({
        cart: get().cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + amount }
            : item,
        ),
      });
    } else {
      set({
        cart: [...get().cart, { ...product, quantity: amount }],
      });
    }

    await get().fetchProducts();
  },

  removeFromCart: async (productId) => {
    const item = get().cart.find((entry) => entry.id === productId);
    if (!item) return;

    const product = get().products.find((entry) => entry.id === productId);
    const currentStock = Number(product?.stock ?? item.stock ?? 0);
    await api.updateStock(productId, currentStock + item.quantity);

    set({
      cart: get().cart.filter((entry) => entry.id !== productId),
    });

    await get().fetchProducts();
  },

  updateQuantity: async (productId, quantity) => {
    const item = get().cart.find((entry) => entry.id === productId);
    if (!item) return;

    const product = get().products.find((entry) => entry.id === productId);
    if (!product) return;

    const quantityDiff = quantity - item.quantity;
    const newStock = Number(product.stock) - quantityDiff;
    if (newStock < 0) return;

    await api.updateStock(productId, newStock);

    if (quantity === 0) {
      set({
        cart: get().cart.filter((entry) => entry.id !== productId),
      });
    } else {
      set({
        cart: get().cart.map((entry) =>
          entry.id === productId ? { ...entry, quantity } : entry,
        ),
      });
    }

    await get().fetchProducts();
  },

  clearCart: async (restoreStock = false) => {
    const items = get().cart;

    if (restoreStock) {
      await Promise.allSettled(
        items.map(async (item) => {
          const product = get().products.find((entry) => entry.id === item.id);
          const currentStock = Number(product?.stock ?? item.stock ?? 0);
          await api.updateStock(item.id, currentStock + item.quantity);
        }),
      );
      set({ cart: [] });
      await get().fetchProducts();
      return;
    }

    set({ cart: [] });
  },
});
