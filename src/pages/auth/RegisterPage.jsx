import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  AlertCircle,
  Check,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const registrationType = searchParams.get("type") || "user";
  const [selectedType, setSelectedType] = useState(
    registrationType === "restaurant" ? "restaurant" : "user",
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!formData.agreeTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    setLoading(true);
    try {
      const result = await register(
        {
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
        },
        selectedType,
        navigate,
      );
      if (result.success) {
        navigate(selectedType === "restaurant" ? "/dashboard" : "/");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200"
          alt="Restaurant interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 to-orange-800/90" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Join CayEats Today</h2>
            <p className="text-xl text-orange-100 max-w-md">
              Whether you're a food lover or restaurant owner, there's a place
              for you.
            </p>
            <div className="mt-8 space-y-4 text-left max-w-sm mx-auto">
              {[
                "Discover amazing restaurants",
                "Easy delivery provider routing",
                "Support local businesses",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-2xl font-bold">
              <span className="text-gray-900">Cay</span>
              <span className="text-orange-500">Eats</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {selectedType === "restaurant"
              ? "Register Your Restaurant"
              : "Create your account"}
          </h1>
          <p className="text-gray-500 mb-8">
            {selectedType === "restaurant"
              ? "Join CayEats and reach more customers in the Cayman Islands"
              : "Sign up to discover the best dining in the Caymans"}
          </p>

          {/* ✅ Only 2 tabs — User and Restaurant */}
          <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setSelectedType("user")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                selectedType === "user"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setSelectedType("restaurant")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                selectedType === "restaurant"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Restaurant
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              icon={User}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              icon={Mail}
              required
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                icon={Lock}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <Input
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              icon={Lock}
              required
            />
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 mt-0.5 rounded text-orange-500"
              />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <Link to="/terms" className="text-orange-500 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-orange-500 hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              Create Account
            </Button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
