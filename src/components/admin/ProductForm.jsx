import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

const ProductForm = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const addProduct = useStore((state) => state.addProduct);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    details: "",
    stock: "",
    image: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        details: formData.details.split('\n').filter(detail => detail.trim() !== ''),
      };

      await addProduct(productData);
      toast.success("Product added successfully!");
      onSuccess?.();
      setFormData({
        name: "",
        price: "",
        description: "",
        details: "",
        stock: "",
        image: "",
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <Input
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price *</label>
        <Input
        // className="w- max-w-lg"
          type="number"
          step="0.01"
          required
          value={formData.price}
          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Product Image URL *</label>
        <Input
          type="url"
          required
          value={formData.image}
          onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
          placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Details (one per line)</label>
        <Textarea
          value={formData.details}
          onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
          placeholder="Enter product details, one per line"
          rows={5}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Initial Stock</label>
        <Input
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Product"}
      </Button>
    </form>
  );
};

export default ProductForm;