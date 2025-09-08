import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Pencil, Trash2, Save } from "lucide-react";

const ProductList = () => {
  const { products, fetchProducts } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: ""
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await api.fetchOrders();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  const handleUpdateStock = async (id, currentStock) => {
    const newStock = prompt("Enter new stock amount:", currentStock);
    if (newStock === null || isNaN(Number(newStock))) return;

    try {
      await api.updateStock(id, Number(newStock));
      await fetchProducts();
      toast.success("Stock updated successfully!");
    } catch (error) {
      toast.error("Failed to update stock");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock
    });
  };

  const handleSave = async (id) => {
    try {
      await api.updateProduct(id, editForm);
      await fetchProducts();
      setEditingId(null);
      toast.success("Product updated successfully!");
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await api.deleteProduct(id);
      await fetchProducts();
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  // const handleUpdateOrderStatus = async (orderId, status) => {
  //   try {
  //     await api.updateOrderStatus(orderId, status);
  //     await fetchOrders();
  //     toast.success("Order status updated!");
  //   } catch (error) {
  //     toast.error("Failed to update order status");
  //   }
  // };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {editingId === product.id ? (
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  ) : (
                    product.name
                  )}
                </TableCell>
                <TableCell>
                  {editingId === product.id ? (
                    <Input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    />
                  ) : (
                    `$${product.price.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === product.id ? (
                    <Input
                      type="number"
                      value={editForm.stock}
                      onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                    />
                  ) : (
                    product.stock
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                </TableCell>
                <TableCell className="space-x-2">
                  {editingId === product.id ? (
                    <Button
                      size="sm"
                      onClick={() => handleSave(product.id)}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStock(product.id, product.stock)}
                      >
                        Update Stock
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>{order.items.length} items</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={
                    order.status === 'success' ? 'success' :
                    order.status === 'failed' ? 'destructive' :
                    'default'
                  }>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                {order.paymentReference || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductList;