import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminAuth = () => {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const response = await fetch('https://server-9atd.onrender.com/api/admin-login', {
      const response = await fetch('http://localhost:3000/api/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store admin session if login is successful
        localStorage.setItem("adminSession", JSON.stringify({
          loggedIn: true,
          timestamp: new Date().toISOString(),
        }));

        toast.success("Successfully logged in as admin");
        navigate("/admin");
      } else {
        const data = await response.json();
        toast.error(data.message || "Invalid PIN");
      }
    } catch (error) {
      toast.error("An error occurred while logging in.");
      console.error("Error details:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Enter Admin PIN</label>
            <Input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter 4-digit PIN"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;
