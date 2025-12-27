import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import './LoginPage.css';

// Login credentials for testing
const LOGIN_CREDENTIALS = {
  admin: {
    email: 'admin@bragboard.com',
    password: 'admin123'
  },
  employee: {
    email: 'employee@bragboard.com',
    password: 'employee123'
  }
};

const LoginPage = () => {
  const [email, setEmail] = useState(LOGIN_CREDENTIALS.employee.email);
  const [password, setPassword] = useState(LOGIN_CREDENTIALS.employee.password);
  const [loginType, setLoginType] = useState('employee');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-fill credentials based on login type
  useEffect(() => {
    setEmail(LOGIN_CREDENTIALS[loginType].email);
    setPassword(LOGIN_CREDENTIALS[loginType].password);
  }, [loginType]);

  // Redirect if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      if (isAuth) {
        const isUserAdmin = isAdmin();
        const from = location.state?.from?.pathname || (isUserAdmin ? '/admin/dashboard' : '/dashboard');
        navigate(from, { replace: true });
      }
    };
    checkAuth();
  }, [isAuthenticated, isAdmin, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  const toggleLoginType = () => {
    setLoginType(prev => prev === 'admin' ? 'employee' : 'admin');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      {/* Decorative background blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400 mb-2">
            BragBoard
          </h2>
          <p className="text-gray-300">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6 flex items-center text-red-200">
            <svg className="h-5 w-5 mr-2 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition-all outline-none"
              placeholder="name@company.com"
              required
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
              <button
                type="button"
                className="text-sm text-blue-300 hover:text-blue-200"
                onClick={() => alert("Password reset functionality would go here")}
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition-all outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : 'Sign in'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleLoginType}
              className="text-sm font-medium text-purple-300 hover:text-white transition-colors"
            >
              {loginType === 'admin' ? 'Switch to Employee Login' : 'Switch to Admin Login'}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-300 hover:text-white font-medium hover:underline">
            Create one
          </Link>
        </div>

        <div className="mt-6 bg-black/20 rounded-lg p-4 text-xs text-gray-400 font-mono">
          <p className="font-bold text-gray-300 mb-2">Demo Login Credentials:</p>
          <div className="space-y-1">
            <p><span className="text-blue-300">Employee:</span> {LOGIN_CREDENTIALS.employee.email} / employee123</p>
            <p><span className="text-purple-300">Admin:</span> {LOGIN_CREDENTIALS.admin.email} / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
