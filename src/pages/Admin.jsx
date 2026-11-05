import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      <div className="container py-12">
        <div className="store-panel mx-auto max-w-xl p-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button className="mt-4" variant="outline" onClick={() => fetchProducts()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Store admin</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">Admin dashboard</h1>
          <p className="mt-2 text-sm text-brand-muted">Manage the Glowora collection and keep stock up to date.</p>
        </div>
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-brand-tangerine" />
        </div>
      ) : (
        <div className="mt-8 grid gap-6">
          <section className="store-panel p-5 sm:p-6">
            <h2 className="text-xl font-extrabold">Add new product</h2>
            <p className="mt-1 text-xs text-brand-muted">New items appear in the storefront instantly after saving.</p>
            <div className="mt-5">
              <ProductForm />
            </div>
          </section>

          <section className="store-panel p-5 sm:p-6">
            <h2 className="text-xl font-extrabold">Product catalogue</h2>
            <p className="mt-1 text-xs text-brand-muted">Edit products, update stock and review incoming orders.</p>
            <div className="mt-5">
              <ProductList />
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Admin;