import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import AdminShell from "@/components/admin/AdminShell";
import DashboardOverview from "@/components/admin/DashboardOverview";
import OrdersPanel from "@/components/admin/OrdersPanel";
import CustomersPanel from "@/components/admin/CustomersPanel";
import ProductForm from "@/components/admin/ProductForm";
import ProductList from "@/components/admin/ProductList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { getMonthlyStats } from "@/lib/adminMetrics";

const Admin = () => {
  const [sessionState, setSessionState] = useState("checking");
  const [tab, setTab] = useState("overview");
  const navigate = useNavigate();

  const products = useStore((state) => state.products);
  const orders = useStore((state) => state.orders);
  const error = useStore((state) => state.error);
  const fetchProducts = useStore((state) => state.fetchProducts);
  const fetchOrders = useStore((state) => state.fetchOrders);

  useEffect(() => {
    let session = null;
    try {
      session = JSON.parse(localStorage.getItem("adminSession"));
    } catch {
      session = null;
    }

    if (!session?.loggedIn) {
      setSessionState("unauthenticated");
      navigate("/admin/login", { replace: true });
      return;
    }

    setSessionState("authenticated");
    Promise.allSettled([fetchProducts(), fetchOrders()]);
  }, [fetchProducts, fetchOrders, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [tab]);

  const monthStats = useMemo(() => getMonthlyStats(orders), [orders]);

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  if (sessionState === "checking") {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F5F6F8]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-tangerine" />
      </div>
    );
  }

  if (sessionState === "unauthenticated") {
    return null;
  }

  return (
    <AdminShell
      activeTab={tab}
      onTabChange={setTab}
      onLogout={handleLogout}
      orderCount={orders.length}
      monthRevenue={monthStats.revenue}
      monthOrders={monthStats.count}
    >
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
            <span>{error}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => Promise.allSettled([fetchProducts(), fetchOrders()])}
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {tab === "overview" && (
        <DashboardOverview products={products} orders={orders} onNavigate={setTab} />
      )}

      {tab === "orders" && <OrdersPanel orders={orders} />}

      {tab === "customers" && <CustomersPanel orders={orders} />}

      {tab === "products" && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-brand-line/70 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-extrabold">Add new product</h2>
            <p className="mt-1 text-xs text-brand-muted">
              New items appear in the storefront instantly after saving.
            </p>
            <div className="mt-5">
              <ProductForm />
            </div>
          </section>

          <section className="rounded-2xl border border-brand-line/70 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold">Product catalogue</h2>
                <p className="mt-1 text-xs text-brand-muted">
                  Edit products, update stock and keep the collection current.
                </p>
              </div>
              <span className="rounded-full bg-brand-blush px-3 py-1 text-[10px] font-extrabold text-brand-rose-deep">
                {products.length} product{products.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="mt-4">
              <ProductList />
            </div>
          </section>
        </div>
      )}
    </AdminShell>
  );
};

export default Admin;
