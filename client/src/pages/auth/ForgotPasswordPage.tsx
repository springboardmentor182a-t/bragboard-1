import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Label } from "../../components/ui/label.tsx";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    toast.success("OTP sent to your email!");
    // Navigate to OTP page
    navigate('/auth/otp');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-700 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            Send OTP
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <button onClick={() => navigate('/auth/login')} className="text-purple-600 hover:text-purple-700 font-bold">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
