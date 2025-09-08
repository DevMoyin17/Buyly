import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PaystackButton } from "react-paystack";
import { useState } from "react";

const Checkout = () => {
  const { cart, clearCart, addOrder, convertPrice, exchangeRates } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  
  const total = cart.reduce((sum, item) => sum + (convertPrice(item.price) * item.quantity), 0);

  const getNairaAmount = () => {
    const baseAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const nairaRate = exchangeRates?.NGN || 1;
    return Math.round(baseAmount * nairaRate * 100);
  };

  const componentProps = {
    email,
    amount: getNairaAmount(),
    publicKey: 'pk_test_7b8262d43e0a09b78424edeb360ff0aea56529f2', 
    text: "Pay Now",
    onSuccess: async (transaction) => {
      try {
        await addOrder({
          items: cart,
          total: total,
          paymentReference: transaction.reference,
          status: 'success',
          date: new Date().toISOString()
        });
        
        clearCart();
        toast.success("Payment successful! Order placed.");
        navigate("/");
      } catch (error) {
        toast.error("Failed to process order. Please try again.");
      }
    },
    onClose: () => {
      // Handle failed or cancelled payment
      addOrder({
        items: cart,
        total: total,
        status: 'failed',
        date: new Date().toISOString()
      });
      toast.error("Payment was not completed");
    },
  };

  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          {cart.length === 0 ? (
            <p className="text-center text-muted-foreground">Your cart is empty</p>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      $ {(convertPrice(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between mt-4 pt-4 border-t">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {isEmailValid(email) ? (
                  <PaystackButton
                    {...componentProps}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-md font-medium"
                  />
                ) : (
                  <Button
                    disabled
                    className="w-full"
                  >
                    Please enter a valid email to continue
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Checkout;
