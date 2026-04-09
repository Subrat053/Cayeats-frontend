import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ShieldCheck, AlertCircle } from "lucide-react";
import api from "../../api/axios";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import logo from "../../assets/cayeats-rmbg.png";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRequest = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await api.post("/user/forgot-password", { email });
      setAccountType(response?.data?.accountType || "");
      setStep("reset");
      if (response?.data?.code) {
        setSuccess(
          `Email service not configured. Your reset code is ${response.data.code}.`,
        );
      } else {
        setSuccess("If the email exists, a reset code was sent.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Failed to send code",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await api.post("/user/reset-password", {
        email,
        code,
        newPassword,
        confirmPassword,
        accountType,
      });
      setSuccess("Password updated. You can now sign in.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to reset password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <img src={logo} alt="CayEats" className="h-13 w-20" />
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Reset your password
        </h1>
        <p className="text-gray-500 mb-8">
          {step === "request"
            ? "Enter your email to receive a reset code."
            : "Enter the code from your email and set a new password."}
        </p>
        <p className="text-xs text-gray-400 mb-6">
          Use the email address linked to your CayEats account.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {step === "request" ? (
          <form onSubmit={handleRequest} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={Mail}
              required
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              Send Reset Code
            </Button>

            <p className="text-center text-gray-600 text-sm">
              Remembered your password?{" "}
              <Link
                to="/login"
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Sign In
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={Mail}
              required
            />
            <Input
              label="Reset Code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6-digit code"
              icon={ShieldCheck}
              autoComplete="one-time-code"
              required
            />
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              icon={Lock}
              autoComplete="new-password"
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              icon={Lock}
              autoComplete="new-password"
              required
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              Update Password
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => setStep("request")}
                className="text-gray-500 hover:text-gray-700"
              >
                Resend code
              </button>
              <Link
                to="/login"
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
