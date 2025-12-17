// // 

// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import AuthInput from "../components/AuthInput";
// import PrimaryButton from "../components/PrimaryButton";
// import BrandHeader from "../components/BrandHeader";
// import { signup } from "../services/authService";

// export default function Register() {
//     const navigate = useNavigate();
//     const [form, setForm] = useState({ name: "", email: "", password: "" });
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);

//     const handleChange = e => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//         setErrors({ ...errors, [e.target.name]: "" });
//     };

//     const validate = () => {
//         const newErrors = {};
//         if (!form.name) newErrors.name = "Full name is required";
//         if (!form.email) newErrors.email = "Email is required";
//         else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
//         if (!form.password) newErrors.password = "Password is required";
//         else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async e => {
//         e.preventDefault();
//         if (!validate()) return;
//         setLoading(true);
//         try {
//             await signup(form);
//             navigate("/login");
//         } catch (err) {
//             setErrors({ general: err.message || "Signup failed" });
//         } finally { setLoading(false); }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-8">
//             <div className="max-w-md w-full bg-card p-8 md:p-10 rounded-xl shadow-lg">
//                 <BrandHeader subtitle="Create an employee shout-out account" />
//                 <h3 className="text-lg font-medium mb-6 text-center text-gray-700">Create your BRAGBOARD account</h3>

//                 {errors.general && <div className="mb-4 text-sm text-red-600 animate-fade-in">{errors.general}</div>}
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <AuthInput label="Full name" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" error={errors.name} />
//                     <AuthInput label="Email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com" error={errors.email} />
//                     <AuthInput label="Password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Choose a password" error={errors.password} />
//                     <PrimaryButton type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</PrimaryButton>
//                 </form>

//                 <p className="mt-6 text-center text-sm">
//                     Already have an account? <Link to="/login" className="text-primary hover:text-primary-dark transition-colors">Sign in</Link>
//                 </p>
//             </div>
//         </div>
//     );
// }

////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import AuthInput from "../components/AuthInput";
// import PrimaryButton from "../components/PrimaryButton";
// import BrandHeader from "../components/BrandHeader";
// import { signup } from "../services/authService";

// export default function Register() {
//     const navigate = useNavigate();
//     const [form, setForm] = useState({ name: "", email: "", password: "" });
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);

//     const handleChange = e => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//         setErrors({ ...errors, [e.target.name]: "" });
//     };

//     const validate = () => {
//         const newErrors = {};
//         if (!form.name) newErrors.name = "Full name is required";
//         if (!form.email) newErrors.email = "Email is required";
//         else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
//         if (!form.password) newErrors.password = "Password is required";
//         else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async e => {
//         e.preventDefault();
//         if (!validate()) return;
//         setLoading(true);
//         try {
//             await signup(form);
//             navigate("/login");
//         } catch (err) {
//             setErrors({ general: err.message || "Signup failed" });
//         } finally { setLoading(false); }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-8">
//             <div className="max-w-md w-full bg-card p-8 md:p-10 rounded-xl shadow-lg">
//                 <BrandHeader subtitle="Create an employee shout-out account" />
//                 <h3 className="text-lg font-medium mb-6 text-center text-gray-700">Create your BRAGBOARD account</h3>

//                 {errors.general && <div className="mb-4 text-sm text-red-600 animate-fade-in">{errors.general}</div>}
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <AuthInput label="Full name" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" error={errors.name} />
//                     <AuthInput label="Email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com" error={errors.email} />
//                     <AuthInput label="Password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Choose a password" error={errors.password} />
//                     <PrimaryButton type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</PrimaryButton>
//                 </form>

//                 <p className="mt-6 text-center text-sm">
//                     Already have an account? <Link to="/login" className="text-primary hover:text-primary-dark transition-colors">Sign in</Link>
//                 </p>
//             </div>
//         </div>
//     );
// }

import React from "react";
import { Link } from "react-router-dom";
import "../pages/auth.css";
import SignupForm from "../components/SignupForm";

export default function Register() {
    return (
        <div className="bb-auth-page">
            <div className="bb-auth-card">
                <div className="bb-brand">
                    {/* Logo removed here too */}
                    <h1 className="bb-app-title">Create your BRAGBOARD account</h1>
                    <p className="bb-app-subtitle">
                        Create an employee shout-out account
                    </p>
                </div>

                <SignupForm />

                <p className="bb-foot" style={{ marginTop: "1rem" }}>
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
