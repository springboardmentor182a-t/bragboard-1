import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { api } from "../../api";

const OTPVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email) {
    return <div className="text-center mt-10">Invalid access</div>;
  }

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/verify-otp", {
        email: email,
        otp: otp,      
      });

      toast.success("OTP verified!");

      navigate("/auth/reset-password", {
        state: { email, otp },  
      });

    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        
        {/**/}
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
          Verify OTP
        </h2>

        <div className="space-y-4">
          <div>
            <Label>Enter OTP</Label>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
            />
          </div>

          <Button
            type="button"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl"
            onClick={handleVerifyOTP}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
