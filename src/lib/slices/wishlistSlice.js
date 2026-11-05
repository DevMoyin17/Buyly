export const createWishlistSlice = (set, get) => ({
  wishlist: [],

  isWishlisted: (productId) => get().wishlist.includes(productId),

  toggleWishlist: (productId) => {
    const wishlist = get().wishlist;
    set({
      wishlist: wishlist.includes(productId)
        ? wishlist.filter((id) => id !== productId)
        : [...wishlist, productId],
    });
  },
});
