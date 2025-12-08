import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { api } from "../../api";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password", { email: email.trim() });
      toast.success("OTP sent! Check your email.");
      navigate("/auth/verify-otp", { state: { email: email.trim() } });
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      if (Array.isArray(detail)) {
        detail.forEach((d: any) => toast.error(d.msg || "Error"));
      } else if (typeof detail === "string") {
        toast.error(detail);
      } else {
        toast.error("Network error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">Forgot Password</h2>
        <div className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <Button type="button" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl" onClick={handleForgotPassword}>
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
