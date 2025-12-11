// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { login } from "../../services/authService";
// import "./auth.css";                                  // correct CSS path
// import logo from "../../../assets/logo.png";          // correct logo path

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await login({ email, password });

//       if (res && res.success === false)
//         throw new Error(res.message || "Login failed");

//       window.location.href = "/dashboard";
//     } catch (err) {
//       setError(err?.message || "Login failed. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="auth-page">
//       <aside className="auth-aside">
//         <div className="aside-inner">
//           <img src={logo} alt="BragBoard Logo" className="aside-logo" />
//           <h2>BragBoard</h2>
//           <p className="aside-sub">
//             Celebrate wins — big and small. Create shout-outs, build team morale.
//           </p>
//         </div>
//       </aside>

//       <main className="auth-main">
//         <div className="auth-card">
//           <header className="card-header">
//             <div className="brand">
//               <img src={logo} alt="logo" className="brand-logo" />
//               <div className="brand-text">
//                 <h3>BragBoard</h3>
//                 <p className="muted">Welcome back — sign in to continue</p>
//               </div>
//             </div>
//           </header>

//           <form className="auth-form" onSubmit={handleSubmit}>
//             {error && <div className="error-banner">{error}</div>}

//             <label className="input-label">Email</label>
//             <input
//               type="email"
//               className="input"
//               placeholder="you@company.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />

//             <label className="input-label">Password</label>
//             <div className="password-row">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 className="input"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <button
//                 type="button"
//                 className="show-btn"
//                 onClick={() => setShowPassword((s) => !s)}
//               >
//                 {showPassword ? "Hide" : "Show"}
//               </button>
//             </div>

//             <div className="form-row between">
//               <label className="checkbox">
//                 <input type="checkbox" /> Remember me
//               </label>

//               <Link to="/forgot-password" className="muted link">
//                 Forgot password?
//               </Link>
//             </div>

//             <button className="btn-primary" type="submit" disabled={loading}>
//               {loading ? "Signing in..." : "Sign in"}
//             </button>

//             <div className="divider">or</div>

//             <p className="center muted">
//               Don’t have an account?{" "}
//               <Link to="/signup" className="link">
//                 Create one
//               </Link>
//             </p>
//           </form>
//         </div>
//       </main>
//     </div>
//   );
// }
///////////////////////////////////////////////////////////////////////////////////
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./auth.css";

// export default function Login() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [remember, setRemember] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   function validate() {
//     const e = {};
//     if (!email) e.email = "Email is required";
//     else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email";

//     if (!password) e.password = "Password is required";
//     else if (password.length < 6) e.password = "Password must be 6+ characters";

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   }

//   function handleSubmit(evt) {
//     evt.preventDefault();
//     if (!validate()) return;

//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       // Replace with real auth
//       navigate("/dashboard", { replace: true });
//     }, 700);
//   }

//   return (
//     <div className="bb-auth-page">
//       <div className="bb-auth-card" role="region" aria-label="Login form">
//         <div className="bb-brand">
//           <img src="/logo.png" alt="BragBoard Logo" className="bb-logo" />
//           <div><h1>BragBoard</h1></div>
//         </div>

//         <form className="bb-form" onSubmit={handleSubmit} noValidate>
//           <label className="bb-label">
//             Email
//             <input
//               type="email"
//               className={`bb-input ${errors.email ? "bb-input-error" : ""}`}
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@company.com"
//               aria-invalid={!!errors.email}
//               aria-describedby={errors.email ? "email-error" : undefined}
//               required
//             />
//             {errors.email && <div id="email-error" className="bb-error">{errors.email}</div>}
//           </label>

//           <label className="bb-label">
//             Password
//             <div className="bb-password-row">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 className={`bb-input ${errors.password ? "bb-input-error" : ""}`}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 aria-invalid={!!errors.password}
//                 aria-describedby={errors.password ? "password-error" : undefined}
//                 required
//               />
//               <button
//                 type="button"
//                 className="bb-toggle"
//                 onClick={() => setShowPassword((s) => !s)}
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? "Hide" : "Show"}
//               </button>
//             </div>
//             {errors.password && <div id="password-error" className="bb-error">{errors.password}</div>}
//           </label>

//           <div className="bb-row-between">
//             <label className="bb-remember">
//               <input
//                 type="checkbox"
//                 checked={remember}
//                 onChange={(e) => setRemember(e.target.checked)}
//               />
//               Remember me
//             </label>

//             <Link to="/forgot-password" className="bb-forgot">Forgot password?</Link>
//           </div>

//           <button type="submit" className="bb-submit" disabled={loading}>
//             {loading ? "Signing in..." : "Sign in"}
//           </button>

//           <div className="bb-divider">or continue with</div>

//           <div className="bb-socials">
//             <button type="button" className="bb-social" onClick={() => alert("Not implemented")}>
//               Continue with Google
//             </button>
//             <button type="button" className="bb-social bb-social-outline" onClick={() => alert("Not implemented")}>
//               Continue with Microsoft
//             </button>
//           </div>

//           <p className="bb-foot">
//             Don't have an account? <Link to="/signup">Create one</Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages/auth.css";
import { login } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email";

    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be 6+ characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      await login({ email, password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: err?.message || "Login failed",
      }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bb-auth-page">
      <div className="bb-auth-card" role="region" aria-label="Login form">
        <div className="bb-brand">
          {/* Logo removed as requested */}
          <h1 className="bb-app-title">BragBoard</h1>
          <p className="bb-app-subtitle">Sign in to your account</p>
        </div>

        <form className="bb-form" onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <div className="bb-error" style={{ marginBottom: "0.75rem" }}>
              {errors.general}
            </div>
          )}

          <label className="bb-label">
            Email
            <input
              type="email"
              className={`bb-input ${errors.email ? "bb-input-error" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              required
            />
            {errors.email && (
              <div id="email-error" className="bb-error">
                {errors.email}
              </div>
            )}
          </label>

          <label className="bb-label">
            Password
            <div className="bb-password-row">
              <input
                type={showPassword ? "text" : "password"}
                className={`bb-input ${errors.password ? "bb-input-error" : ""
                  }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                required
              />
              <button
                type="button"
                className="bb-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <div id="password-error" className="bb-error">
                {errors.password}
              </div>
            )}
          </label>

          <div className="bb-row-between">
            <label className="bb-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>

            <Link to="/forgot-password" className="bb-forgot">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="bb-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* Social login removed as requested */}

          <p className="bb-foot">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
