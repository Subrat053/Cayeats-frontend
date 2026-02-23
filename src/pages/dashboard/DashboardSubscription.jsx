import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  Star,
  Zap,
  Crown,
  Loader,
  AlertCircle,
  RefreshCw,
  Calendar,
  Shield,
} from "lucide-react";
import {
  getSubscriptionPricing,
  createCheckoutSession,
  getSubscriptionDetails,
  toggleAutoRenew,
} from "../../api/restaurantService";

const PLAN_ICONS = { Silver: Star, Gold: Zap, Platinum: Crown };
const PLAN_COLORS = {
  Silver: {
    bg: "bg-gray-50",
    border: "border-gray-300",
    badge: "bg-gray-100 text-gray-700",
    btn: "bg-gray-700 hover:bg-gray-800",
  },
  Gold: {
    bg: "bg-orange-50",
    border: "border-orange-400",
    badge: "bg-orange-500 text-white",
    btn: "bg-orange-500 hover:bg-orange-600",
  },
  Platinum: {
    bg: "bg-purple-50",
    border: "border-purple-400",
    badge: "bg-purple-600 text-white",
    btn: "bg-purple-600 hover:bg-purple-700",
  },
};

const DashboardSubscription = () => {
  const [plans, setPlans] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isFirstYear, setIsFirstYear] = useState(false);
  const [discount, setDiscount] = useState(0);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Handle Stripe redirect
    if (searchParams.get("success") === "true") {
      setSuccess(
        `🎉 Payment successful! Your ${searchParams.get("plan")} plan is now active.`,
      );
    }
    if (searchParams.get("cancelled") === "true") {
      setError("Payment cancelled. No charge was made.");
    }

    Promise.all([getSubscriptionPricing(), getSubscriptionDetails()])
      .then(([pricingData, subData]) => {
        setPlans(pricingData?.plans || []);
        setIsFirstYear(pricingData?.isFirstYear || false);
        setDiscount(pricingData?.discount || 0);
        setCurrent(subData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckout = async (planId) => {
    setCheckingOut(planId);
    setError(null);
    try {
      const res = await createCheckoutSession(planId);
      if (res?.url) {
        window.location.href = res.url; // redirect to Stripe
      }
    } catch (err) {
      setError("Checkout failed: " + err.message);
      setCheckingOut(null);
    }
  };

  const handleToggleAutoRenew = async () => {
    try {
      await toggleAutoRenew(!current?.autoRenew);
      setCurrent((prev) => ({ ...prev, autoRenew: !prev?.autoRenew }));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );

  const daysLeft = current?.expiresAt
    ? Math.ceil(
        (new Date(current.expiresAt) - new Date()) / (1000 * 60 * 60 * 24),
      )
    : null;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
        <p className="text-gray-500 mt-1">
          Choose the plan that works best for your restaurant
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 flex gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 flex gap-2">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          {success}
        </div>
      )}

      {/* Current subscription status */}
      {current?.plan && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Current Subscription
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                {(() => {
                  const Icon = PLAN_ICONS[current.plan] || Star;
                  return <Icon className="w-6 h-6 text-orange-600" />;
                })()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {current.plan} Plan
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      current.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {current.status}
                  </span>
                </div>
                {daysLeft !== null && (
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {daysLeft > 0 ? `${daysLeft} days remaining` : "Expired"}
                    {current.expiresAt &&
                      ` · Expires ${new Date(current.expiresAt).toLocaleDateString()}`}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleToggleAutoRenew}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                current.autoRenew
                  ? "border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
                  : "border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Auto-Renew: {current.autoRenew ? "On" : "Off"}
            </button>
          </div>

          {/* Progress bar */}
          {daysLeft !== null && current.status === "active" && (
            <div className="mt-4">
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, Math.max(0, (daysLeft / 365) * 100))}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {daysLeft} days remaining
              </p>
            </div>
          )}
        </div>
      )}

      {/* First year discount banner */}
      {isFirstYear && discount > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎉</div>
            <div>
              <h3 className="font-bold text-lg">
                First Year Discount — {discount}% OFF!
              </h3>
              <p className="text-green-100 text-sm">
                This special pricing applies to your first subscription. Prices
                shown below include your discount.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plans grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const colors = PLAN_COLORS[plan.id] || PLAN_COLORS.Silver;
          const Icon = PLAN_ICONS[plan.id] || Star;
          const isCurrent =
            current?.plan === plan.id && current?.status === "active";

          return (
            <div
              key={plan.id}
              className={`rounded-xl border-2 p-6 flex flex-col relative transition-all ${colors.bg} ${
                plan.popular ? colors.border + " shadow-lg" : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${colors.badge}`}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-3 right-4">
                  <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2 rounded-lg ${plan.popular ? "bg-orange-100" : "bg-white"}`}
                >
                  <Icon
                    className={`w-5 h-5 ${plan.popular ? "text-orange-600" : "text-gray-600"}`}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500">{plan.duration}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                {plan.isFirstYear && plan.discount > 0 ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">
                        ${plan.finalPrice}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm line-through text-gray-400">
                        ${plan.price}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        {plan.discount}% off
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      First year only · renews at ${plan.price}
                    </p>
                  </>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2 flex-1 mb-6">
                {plan.features?.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={!!checkingOut || isCurrent}
                className={`w-full py-3 rounded-lg text-white font-semibold transition-colors flex items-center justify-center gap-2 ${
                  isCurrent
                    ? "bg-green-500 cursor-default"
                    : colors.btn + " disabled:opacity-60"
                }`}
              >
                {checkingOut === plan.id ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" /> Redirecting to
                    Stripe...
                  </>
                ) : isCurrent ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> Active Plan
                  </>
                ) : (
                  `Subscribe — $${plan.finalPrice}`
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Security note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
        <Shield className="w-5 h-5 text-gray-500 shrink-0" />
        <p className="text-sm text-gray-600">
          Payments are processed securely via <strong>Stripe</strong>. Your card
          details are never stored on our servers. All transactions are
          encrypted with TLS/SSL.
        </p>
      </div>
    </div>
  );
};

export default DashboardSubscription;
