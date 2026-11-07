import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import ProductDetails from "./pages/ProductDetails";
import Auth from "./pages/Auth";
import Signin from "./pages/Signin";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import AdminAuth from "./components/admin/AdminAuth";
import Footer from "./components/Footer";
import StoreHeader from "./components/storefront/StoreHeader";
import { useAuthStore } from "./lib/auth";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return null;
};

const StoreLayout = () => (
  <div className="flex min-h-screen flex-col bg-brand-cream text-brand-ink">
    <StoreHeader />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const StandaloneLayout = () => (
  <div className="flex min-h-screen flex-col bg-brand-cream text-brand-ink">
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
);

const RequireAuth = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Toaster
        position="bottom-right"
        duration={2600}
        richColors
        closeButton
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#1D1719",
            border: "1px solid #F0DEE2",
            borderRadius: "14px",
            fontFamily: "Manrope Variable, Manrope, sans-serif",
          },
        }}
      />
      <ScrollToTop />
      <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
        </Route>

        <Route element={<StandaloneLayout />}>
          <Route path="/auth" element={<Auth />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminAuth />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
