import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import { useAuth } from "../../AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";

const ADMIN_CODE = "BRAG2024";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"admin" | "employee">("employee");
  const [adminCode, setAdminCode] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setName(""); setEmail(""); setPassword(""); setConfirmPassword(""); setAdminCode("");
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (role === "admin" && adminCode !== ADMIN_CODE) {
      toast.error("Invalid admin code");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password, role });
      toast.success("Registered! Login to continue.");
      setIsRegisterMode(false);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      if (Array.isArray(detail)) {
        detail.forEach((d: any) => toast.error(d.msg || "Registration failed"));
      } else if (typeof detail === "string") {
        toast.error(detail);
      } else {
        toast.error("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) { toast.error("Fill all fields"); return; }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.role, { name: res.data.name, email: email });
      toast.success("Login successful!");
      if (res.data.role === "admin") navigate("/admin/reports");
      else navigate("/report-shoutout");
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      if (Array.isArray(detail)) {
        detail.forEach((d: any) => toast.error(d.msg || "Login failed"));
      } else if (typeof detail === "string") {
        toast.error(detail);
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-4">BragBoard</h1>
        <div className="flex justify-center mb-6">
          <button onClick={() => setIsRegisterMode(false)} className={`${!isRegisterMode ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-500"} px-4 pb-2 font-semibold`}>Sign In</button>
          <button onClick={() => setIsRegisterMode(true)} className={`${isRegisterMode ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-500"} px-4 pb-2 font-semibold`}>Register</button>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); isRegisterMode ? handleRegister() : handleLogin(); }}>
          {isRegisterMode && <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>}
          <div><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>

          {isRegisterMode && <>
            <div><Label>Confirm Password</Label><Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
            <div><Label>Role</Label>
              <select value={role} onChange={(e) => setRole(e.target.value as "admin"|"employee")} className="w-full p-2 border rounded">
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {role==="admin" && <div><Label>Admin Code</Label><Input value={adminCode} onChange={(e)=>setAdminCode(e.target.value)} /></div>}
          </>}

          {!isRegisterMode && <div className="flex justify-end"><button type="button" className="text-purple-700 text-sm font-bold" onClick={() => navigate("/auth/forgot-password")}>Forgot Password?</button></div>}

          <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl">
            {loading ? "Processing..." : isRegisterMode ? "Register" : "Sign In"}
          </Button>
        </form>

        <p className="text-center mt-4">
          {isRegisterMode ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={toggleMode} className="text-purple-700 font-bold">{isRegisterMode ? "Sign In" : "Register"}</button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
