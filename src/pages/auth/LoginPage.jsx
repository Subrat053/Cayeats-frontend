import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import logo from "../../assets/cayeats-rmbg.png";

const LoginPage = () => {
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [role, setRole]             = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // ✅ pass role (not selectedType) and navigate
      const result = await login(email, password, role, navigate);
      if (!result.success) setError(result.error);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <img src={logo} alt="CayEats" className="h-13 w-20" />
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sign in as
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
              >
                <option value="user">User</option>
                <option value="restaurant">Restaurant</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={Mail}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                icon={Lock}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-orange-500" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-orange-500 hover:text-orange-600 font-medium">
              Sign up
            </Link>
          </p>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-2 font-medium">Test Credentials:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Admin:</strong> admin@cayeats.com / Admin@123</p>
              <p><strong>Restaurant:</strong> your registered email</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200"
          alt="Food"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 to-orange-800/90" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Island Dining Authority</h2>
            <p className="text-xl text-orange-100 max-w-md">
              Discover the best restaurants in the Cayman Islands and order
              from your favorite delivery providers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;