import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { useStore } from "@/lib/store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { products, isLoading, error, fetchProducts } = useStore();
  const navigate = useNavigate();
  

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
  <div className="flex items-center justify-between mb-8">
    <Input
      type="search"
      placeholder="Search products..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full"
    />
    {/* <Button onClick={handleLogout} variant="outline" className="ml-4">
      Logout
    </Button> */}
  </div>

  {isLoading ? (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )}
</main>


    </div>
  );
};

export default Index;

