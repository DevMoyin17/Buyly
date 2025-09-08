import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { HomeIcon, ShoppingBagIcon, UserIcon, CreditCardIcon, LayoutDashboardIcon, MenuIcon } from "lucide-react";
import { useState } from "react";
import Index from "./pages/Index";
import ProductDetails from "./pages/ProductDetails";
import Auth from "./pages/Auth";
import Signin from "./pages/Signin";
import { Toaster } from "sonner";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import AdminAuth from "./components/admin/AdminAuth";
import Footer from "./components/Footer";
import AM from "./assets/AM.png"

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", icon: <HomeIcon className="h-4 w-4" />, text: "Home" },
    // { to: "/product/:id", icon: <ShoppingBagIcon className="h-4 w-4" />, text: "Product" },
    { to: "/checkout", icon: <CreditCardIcon className="h-4 w-4" />, text: "Checkout" },
    { to: "/admin", icon: <LayoutDashboardIcon className="h-4 w-4" />, text: "Admin" },
    // { to: "/auth", icon: <UserIcon className="h-4 w-4" />, text: "Auth" },
  ];

  return (
    <Router>
       <div className="min-h-screen flex flex-col">
      <Toaster />
      
      <nav className="bg-gray-800 text-white p-4">
        <div className="flex justify-between items-center md:hidden">
          <span className="font-bold"><img src={AM} alt="" className="h-10 w-10" /></span>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>

        <ul className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 mt-4 md:mt-0`}>
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="flex items-center space-x-2 hover:text-blue-400 transition-colors p-2 md:p-0"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                <span>{link.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminAuth />} />
          </Routes>
        </main>

        <Footer/>
      </div>
    </Router>
  );
}

export default App;