import { useState } from "react";
import { MessageSquare, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

import { toast } from "sonner";

interface LoginPageProps {
  onLogin: (userRole: "admin" | "employee", userData: { name: string; email: string }) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [userRole] = useState<"admin" | "employee">("employee");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const DEMO_ADMIN_EMAIL = "admin@bragboard.com";
  const DEMO_ADMIN_PASSWORD = "admin123";
  const DEMO_EMPLOYEE_EMAIL = "employee@bragboard.com";
  const DEMO_EMPLOYEE_PASSWORD = "employee123";
  const ADMIN_VERIFICATION_CODE = "BRAG2024";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegisterMode) {
      if (!fullName || !email || !password || !confirmPassword || !adminCode) {
        toast.error("Please fill in all fields");
        return;
      }
      if (adminCode !== ADMIN_VERIFICATION_CODE) {
        toast.error("Invalid admin verification code");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        toast.success("Admin account created successfully!");
        onLogin(userRole, { name: fullName, email: email });
        setIsLoading(false);
        navigate('/');
      }, 1000);
    } else {
      if (!email || !password) {
        toast.error("Please fill in all fields");
        return;
      }

      setIsLoading(true);

      setTimeout(() => {
        let role: "admin" | "employee" = "employee";
        let userName = "Employee User";

        if (email === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
          role = "admin";
          userName = "Admin User";
          toast.success("Welcome back, Admin!");
        } else if (email === DEMO_EMPLOYEE_EMAIL && password === DEMO_EMPLOYEE_PASSWORD) {
          role = "employee";
          userName = "Employee User";
          toast.success("Welcome back!");
        } else {
          userName = email
            .split("@")[0]
            .split(".")
            .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
            .join(" ");
          toast.success("Login successful!");
        }

        onLogin(role, { name: userName, email });
        setIsLoading(false);
        navigate('/');
      }, 800);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAdminCode("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600 p-4">
      <div className="w-full max-w-md flex flex-col items-center justify-center">

        {/* MAIN CARD */}
        <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 px-8 py-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-900 rounded-3xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">BragBoard</h1>
            <p className="text-gray-600 text-sm mt-2">Admin Dashboard</p>
          </div>

          {/* TABS */}
          <div className="flex border-b border-gray-200 px-8 pt-6">
            <button
              onClick={() => setIsRegisterMode(false)}
              className={`pb-4 px-4 font-semibold text-sm ${
                !isRegisterMode ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500"
              }`}
            >
              Sign In
            </button>

            <button
              onClick={() => setIsRegisterMode(true)}
              className={`pb-4 px-4 font-semibold text-sm ${
                isRegisterMode ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500"
              }`}
            >
              Register
            </button>
          </div>

          {/* FORM */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {isRegisterMode && (
                <div>
                  <Label className="block mb-2 text-sm font-semibold">Full Name</Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <Label className="block mb-2 text-sm font-semibold">Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bragboard.com"
                />
              </div>

              <div>
                <Label className="block mb-2 text-sm font-semibold">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {isRegisterMode && (
                <>
                  <div>
                    <Label className="block mb-2 text-sm font-semibold">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="block mb-2 text-sm font-semibold">Admin Code</Label>
                    <Input
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      placeholder="BRAG2024"
                    />
                  </div>
                </>
              )}

              <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl">
                {isLoading ? (isRegisterMode ? 'Creating...' : 'Signing in...') : (isRegisterMode ? "Create Account" : "Sign In")}
              </Button>
            </form>

            <div className="text-center mt-5">
              <p>
                {isRegisterMode ? "Already have an account?" : "Don't have an account?"}{" "}
                <button onClick={toggleMode} className="text-purple-700 font-bold">
                  {isRegisterMode ? "Sign In" : "Register"}
                </button>
              </p>
              
              {!isRegisterMode && (
                <p className="mt-3">
                  <button onClick={() => navigate('/auth/forgot-password')} className="text-purple-700 hover:text-purple-900 font-bold text-sm">
                    Forgot Password?
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Demo credentials removed as requested */}
      </div>
    </div>
  );
}
