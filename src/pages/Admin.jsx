import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProductForm from "@/components/admin/ProductForm";
import ProductList from "@/components/admin/ProductList";
import { useStore } from "@/lib/store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AdminAuth from "@/components/admin/AdminAuth";

const Admin = () => {
  const { fetchProducts, isLoading, error } = useStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();


 useEffect(() => {
    const checkAuth = () => {
      const session = JSON.parse(localStorage.getItem("adminSession"));
      if (!session || !session.loggedIn) {
        setIsAuthenticated(false);
        navigate("/admin/login");
      } else {
        setIsAuthenticated(true);
        fetchProducts();
      }
    };

    checkAuth();
  }, [fetchProducts, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  if (!isAuthenticated) {
    return <AdminAuth />;
  }

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
              <ProductForm />
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Product List</h2>
              <ProductList />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;