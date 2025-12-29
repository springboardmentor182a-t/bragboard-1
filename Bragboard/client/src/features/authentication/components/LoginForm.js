
// import React, { useState } from "react";
// import { login } from "../services/authService";

// export default function LoginForm() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");

//         try {
//             await login(email, password);
//             // redirect after login
//             window.location.href = "/dashboard";
//         } catch (err) {
//             console.error(err);
//             setError(err.message || "Invalid credentials");
//         }
//     };

//     return (
//         <form className="space-y-4" onSubmit={handleSubmit}>
//             <div>
//                 <input
//                     type="email"
//                     placeholder="you@company.com"
//                     className="w-full border px-3 py-2 rounded"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//             </div>

//             <div>
//                 <input
//                     type="password"
//                     placeholder="Enter your password"
//                     className="w-full border px-3 py-2 rounded"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//             </div>

//             {error && <p className="text-red-500 text-sm">{error}</p>}

//             <button
//                 type="submit"
//                 className="w-full bg-indigo-600 text-white py-2 rounded"
//             >
//                 Sign in
//             </button>
//         </form>
//     );
// }

import React, { useState } from "react";
import { login } from "../services/authService";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login(email, password);
            window.location.href = "/dashboard";
        } catch (err) {
            setError(err.message || "Login failed");
        }
    };

    return (
        <form className="bb-form" onSubmit={handleSubmit}>
            <input
                type="email"
                className="bb-input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                className="bb-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <div style={{ textAlign: "right" }}>
                <a href="/forgot-password" className="bb-link">
                    Forgot password?
                </a>
            </div>

            {error && <div className="bb-error">{error}</div>}

            <button type="submit" className="bb-submit">
                Sign in
            </button>
        </form>
    );
}
