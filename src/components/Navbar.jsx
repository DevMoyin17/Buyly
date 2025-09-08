
import { ShoppingCart} from "lucide-react";
import { Link} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import CartDrawer from "./CartDrawer";
import CurrencySelector from "./CurrencySelector";
import { useState } from "react";
const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cart = useStore((state) => state.cart);
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  // const navigate = useNavigate();


  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
         
          <Link to="/" className="text-xl md:text-2xl font-bold text-primary">
            Buyly
          </Link>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="">
            <CurrencySelector />
          </div>
          
          <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)}>
            <div className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </div>
          </Button>
        </div>
        
        <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </nav>
  );
};

export default Navbar;