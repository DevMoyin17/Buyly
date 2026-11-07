import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { useAdminMoney } from "@/lib/useAdminMoney";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Pencil, Trash2, Save } from "lucide-react";

const ProductList = () => {
  const products = useStore((state) => state.products);
  const fetchProducts = useStore((state) => state.fetchProducts);
  const money = useAdminMoney();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
  });

  const handleUpdateStock = async (id, currentStock) => {
    const newStock = window.prompt("Enter new stock amount:", currentStock);
    if (newStock === null || Number.isNaN(Number(newStock))) return;

    try {
      await api.updateStock(id, Number(newStock));
      await fetchProducts();
      toast.success("Stock updated successfully!");
    } catch {
      toast.error("Failed to update stock");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
    });
  };

  const handleSave = async (id) => {
    try {
      await api.updateProduct(id, editForm);
      await fetchProducts();
      setEditingId(null);
      toast.success("Product updated successfully!");
    } catch {
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.deleteProduct(id);
      await fetchProducts();
      toast.success("Product deleted successfully!");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Stock Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="min-w-[180px] font-semibold">
              {editingId === product.id ? (
                <Input
                  value={editForm.name}
                  onChange={(event) =>
                    setEditForm({ ...editForm, name: event.target.value })
                  }
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
                  onChange={(event) =>
                    setEditForm({ ...editForm, price: Number(event.target.value) })
                  }
                />
              ) : (
                money(product.price, 2)
              )}
            </TableCell>
            <TableCell>
              {editingId === product.id ? (
                <Input
                  type="number"
                  value={editForm.stock}
                  onChange={(event) =>
                    setEditForm({ ...editForm, stock: Number(event.target.value) })
                  }
                />
              ) : (
                product.stock
              )}
            </TableCell>
            <TableCell>
              <Badge variant={Number(product.stock) > 0 ? "success" : "destructive"}>
                {Number(product.stock) > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-2">
                {editingId === product.id ? (
                  <Button size="sm" onClick={() => handleSave(product.id)}>
                    <Save className="mr-1 h-4 w-4" />
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
                      aria-label={`Edit ${product.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductList;
