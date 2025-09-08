import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ProductCard = ({ product }) => {
  const { addToCart, inventory,currency, convertPrice  } = useStore();
  const stock = inventory[product.id];

  const handleAddToCart = () => {
    if (stock <= 0) {
      toast.error("Product is out of stock!");
      return;
    }
    addToCart(product);
    toast.success("Added to cart!");
  };

  const displayPrice = convertPrice(product.price);
  const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    NGN: "₦",
  };

  return (
    <div className="group bg-white rounded-lg shadow-sm overflow-hidden border animate-fade-in">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-lg mb-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-lg">
              {currencySymbols[currency]}{displayPrice.toFixed(2)}
            </span>
            <p className="text-sm text-muted-foreground">
              {stock} in stock
            </p>
          </div>
          <Button 
            size="sm" 
            onClick={handleAddToCart}
            disabled={stock <= 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {stock > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;