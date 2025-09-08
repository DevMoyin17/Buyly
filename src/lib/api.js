import axios from 'axios';

// const API_URL = 'http://localhost:3000/api';
const API_URL = 'https://mini-ecommerce-server-zjfl.onrender.com/api';


export const api = {
  async fetchProducts() {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  },

  async fetchProduct(id) {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch product details');
    }
  },

  async addProduct(product) {
    try {
      const response = await axios.post(`${API_URL}/products`, product);
      return response.data;
    } catch (error) {
      throw new Error('Failed to add product');
    }
  },

  async updateProduct(id, updates) {
    try {
      const response = await axios.patch(`${API_URL}/products/${id}`, updates);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update product');
    }
  },

  async deleteProduct(id) {
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      return true;
    } catch (error) {
      throw new Error('Failed to delete product');
    }
  },

  async updateStock(id, stock) {
    try {
      const response = await axios.patch(`${API_URL}/products/${id}`, { stock });
      return response.data;
    } catch (error) {
      console.error("Error updating stock:", error);
      throw new Error('Failed to update stock');
    }
  },  


  async fetchOrders() {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch orders');
    }
  },

  async addOrder(order) {
    try {
      const response = await axios.post(`${API_URL}/orders`, {
        ...order,
        date: new Date().toISOString(),
        status: order.status || 'pending' // Default to pending if no status provided
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to add order');
    }
  },

  //  async updateOrderStatus(orderId, status) {
  //   try {
  //     // Directly update order status
  //      const response = await axios.patch(`${API_URL}/orders/${orderId}`, { status });
  //     return response.data;
  //  } catch (error) {
  //   console.error('Error updating order:', error);
  //   throw new Error('Failed to update order status');
  //    }
  // }
};
