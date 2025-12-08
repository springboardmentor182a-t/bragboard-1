import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { api } from "../../api";

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { email, otp } = location.state || {};

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email || !otp) {
    return <div className="text-center mt-10">Invalid access</div>;
  }

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        email: email,
        otp: otp,
        new_password: password,
      });

      toast.success("Password reset successfully!");

      navigate("/auth/login");

    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
          Reset Password
        </h2>

        {/*  */}
        <div className="space-y-4">
          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button
            type="button"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl"
            onClick={handleResetPassword}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
