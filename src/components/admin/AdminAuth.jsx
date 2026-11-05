import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AdminAuth = () => {
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (response.ok) {
        localStorage.setItem(
          "adminSession",
          JSON.stringify({ loggedIn: true, timestamp: new Date().toISOString() }),
        );
        toast.success("Welcome to the admin dashboard.");
        navigate("/admin");
      } else {
        const data = await response.json();
        toast.error(data.message || "Invalid PIN");
      }
    } catch {
      toast.error("Could not reach the admin server. Make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-16 sm:py-24">
      <div className="store-panel mx-auto max-w-md p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-peach text-brand-tangerine">
            <LockKeyhole className="h-5 w-5" />
          </span>
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-muted transition hover:text-brand-ink">
            <ArrowLeft className="h-3.5 w-3.5" />
            Store
          </Link>
        </div>
        <h1 className="mt-5 text-3xl font-extrabold tracking-[-0.045em]">Admin access</h1>
        <p className="mt-2 text-sm leading-6 text-brand-muted">
          Enter the store PIN to manage the catalogue and orders.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-pin" className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-muted">
              Store PIN
            </label>
            <Input
              id="admin-pin"
              type="password"
              maxLength={4}
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              placeholder="4-digit PIN"
              className="mt-2"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;
