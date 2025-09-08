import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@/lib/api";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart, inventory } = useStore();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const productData = await api.fetchProduct(id);
        setProduct(productData);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (product.stock <= 0) {
      toast.error("Product is out of stock!");
      return;
    }
    try {
      await addToCart(product);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-muted-foreground mb-6">
                {product.description}
              </p>
              
              <div className="mb-6">
                <h2 className="font-medium mb-2">Key Features:</h2>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {product.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {product.stock} in stock
                </span>
              </div>
              </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;