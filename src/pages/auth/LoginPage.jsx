import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { logger } from "../../utils/logger";
import { validateEmail } from "../../utils/validation";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import logo from "../../assets/cayeats-rmbg.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [savedEmails, setSavedEmails] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Load saved emails on mount
  useEffect(() => {
    const stored = localStorage.getItem("cayeats_saved_logins");
    if (stored) {
      try {
        const logins = JSON.parse(stored);
        setSavedEmails(logins);
      } catch (err) {
        logger.error("Failed to parse saved logins:", err);
      }
    }
  }, []);

  // Handle email suggestions
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setShowSuggestions(true);
  };

  const handleEmailFocus = () => {
    setShowSuggestions(true);
  };

  // Auto-fill form when suggestion is clicked
  const handleSuggestionClick = (savedEmail) => {
    setEmail(savedEmail);
    setShowSuggestions(false);
    setPassword("");
  };

  // Save email to localStorage when login is successful
  const saveEmail = (emailToSave) => {
    try {
      let logins = [];
      const stored = localStorage.getItem("cayeats_saved_logins");
      if (stored) {
        logins = JSON.parse(stored);
      }

      // Remove if already exists (to avoid duplicates)
      logins = logins.filter((e) => e !== emailToSave);

      // Add to beginning of array (most recent first)
      logins.unshift(emailToSave);

      // Keep only last 5 emails
      logins = logins.slice(0, 5);

      localStorage.setItem("cayeats_saved_logins", JSON.stringify(logins));
      setSavedEmails(logins);
    } catch (err) {
      logger.error("Failed to save login:", err);
    }
  };

  // Remove a saved email
  const removeSavedEmail = (emailToRemove, e) => {
    e.stopPropagation();
    try {
      let logins = [];
      const stored = localStorage.getItem("cayeats_saved_logins");
      if (stored) {
        logins = JSON.parse(stored);
      }

      logins = logins.filter((e) => e !== emailToRemove);
      localStorage.setItem("cayeats_saved_logins", JSON.stringify(logins));
      setSavedEmails(logins);
    } catch (err) {
      logger.error("Failed to remove login:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Validate password
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // ✅ pass role (not selectedType) and navigate
      const result = await login(email, password, role, navigate);
      if (!result.success) {
        setError(result.error);
      } else {
        // Save email if remember me is checked
        if (rememberMe) {
          saveEmail(email);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Filter suggestions based on current email input
  const filteredSuggestions = email
    ? savedEmails.filter((e) => e.toLowerCase().includes(email.toLowerCase()))
    : savedEmails;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 sm:mb-8">
            <img
              src={logo}
              alt="CayEats"
              className="h-10 sm:h-13 w-16 sm:w-20"
            />
          </Link>

          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Sign in as
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg p-2 sm:p-2.5 focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
              >
                <option value="user">User</option>
                <option value="restaurant">Restaurant</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Email with Suggestions */}
            <div className="relative">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onFocus={handleEmailFocus}
                placeholder="you@example.com"
                icon={Mail}
                required
              />

              {/* Email Suggestions Dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {filteredSuggestions.map((suggestedEmail, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 group"
                      onClick={() => handleSuggestionClick(suggestedEmail)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate font-medium">
                          {suggestedEmail}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => removeSavedEmail(suggestedEmail, e)}
                        className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                        title="Remove from suggestions"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                icon={Lock}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9.5 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 border-gray-300 focus:ring-orange-500"
                />
                <span className="text-xs sm:text-sm text-gray-600">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs sm:text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:flex lg:w-1/2 relative shrink-0">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80"
          alt="Food"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 to-orange-800/90" />
        <div className="absolute inset-0 flex items-center justify-center p-8 lg:p-12">
          <div className="text-center text-white max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 lg:mb-4">
              Island Dining Authority
            </h2>
            <p className="text-sm sm:text-lg text-orange-100">
              Discover the best restaurants in the Cayman Islands and order from
              your favorite delivery providers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
