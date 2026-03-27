import { useState } from "react";
import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Label } from "../../components/ui/label.tsx";
import { toast } from "sonner";

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    toast.success("OTP Verified!");
    window.location.href = "/auth/reset-password";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-700 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">
          Verify OTP
        </h2>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <Label>Enter OTP</Label>
            <Input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Verify OTP
          </Button>
        </form>
      </div>
    </div>
  );
}
