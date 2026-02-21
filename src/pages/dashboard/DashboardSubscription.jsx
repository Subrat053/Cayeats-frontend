import { useState, useEffect } from "react";
import {
  Shield,
  CheckCircle,
  Clock,
  CreditCard,
  AlertTriangle,
  BarChart2,
  Megaphone,
  TrendingUp,
  Star,
  Zap,
  Crown,
  RefreshCw,
} from "lucide-react";
import {
  getSubscriptionDetails,
  toggleAutoRenew,
} from "../../api/restaurantService";

const PLANS = [
  {
    id: "silver",
    name: "Silver",
    duration: "6 Months",
    price: 160,
    icon: Shield,
    color: "from-gray-400 to-gray-500",
    border: "border-gray-300",
    bg: "bg-gray-50",
    badge: "bg-gray-200 text-gray-700",
    features: [
      "Verified badge on profile",
      "Basic analytics",
      "Profile management",
      "Standard support",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    duration: "1 Year",
    price: 240,
    icon: Star,
    color: "from-yellow-400 to-orange-500",
    border: "border-yellow-400",
    bg: "bg-yellow-50",
    badge: "bg-yellow-200 text-yellow-800",
    popular: true,
    features: [
      "Everything in Silver",
      "Advanced analytics",
      "Featured listing access",
      "Priority support",
      "Tonight's Cravings access",
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    duration: "2 Years",
    price: 400,
    icon: Crown,
    color: "from-purple-500 to-indigo-600",
    border: "border-purple-400",
    bg: "bg-purple-50",
    badge: "bg-purple-200 text-purple-800",
    features: [
      "Everything in Gold",
      "Banner ads access",
      "Preferred delivery partner",
      "Dedicated account manager",
      "Early access to new features",
    ],
  },
];

const BENEFITS = [
  {
    icon: Shield,
    title: "Verified Badge",
    desc: "Meta-style verified checkmark on your profile",
  },
  {
    icon: BarChart2,
    title: "Advanced Analytics",
    desc: "Detailed insights into views, clicks, and behavior",
  },
  {
    icon: TrendingUp,
    title: "Profile Management",
    desc: "Full control over your restaurant information",
  },
  {
    icon: Megaphone,
    title: "Purchase Advertising",
    desc: "Access featured listings, banners, and promotions",
  },
];

// ✅ Meta-style verified badge component
const VerifiedBadge = ({ plan }) => {
  const colors = {
    silver: "bg-gray-500",
    gold: "bg-yellow-500",
    platinum: "bg-purple-600",
  };
  return (
    <span
      title={`${plan} Verified`}
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${colors[plan] || "bg-orange-500"}`}
    >
      <svg
        className="w-3 h-3 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
};

const DashboardClaimSubscription = () => {
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedPlan, setSelected] = useState("gold");
  const [showPlans, setShowPlans] = useState(false);

  useEffect(() => {
    getSubscriptionDetails()
      .then((data) => {
        setSub(data);
        // ✅ default selected to next tier up from current
        if (data?.plan === "Silver") setSelected("gold");
        if (data?.plan === "Gold") setSelected("platinum");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleAutoRenew = async () => {
    setToggling(true);
    setError(null);
    try {
      await toggleAutoRenew(!sub.autoRenew);
      setSub((prev) => ({ ...prev, autoRenew: !prev.autoRenew }));
      setSuccess(`Auto-renew ${!sub.autoRenew ? "enabled" : "disabled"}.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setToggling(false);
    }
  };

  const handlePurchase = (planId) => {
    // PayPal integration goes here
    alert(`PayPal checkout for ${planId} plan — coming soon`);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );

  const isActive = sub?.status === "active";
  const isExpired = sub?.status === "expired";
  const isNearExpiry = isActive && sub?.daysLeft <= 30;

  // match plan object to current subscription
  const currentPlanKey = sub?.plan?.toLowerCase();
  const currentPlan = PLANS.find(
    (p) => p.name.toLowerCase() === currentPlanKey,
  );
  const PlanIcon = currentPlan?.icon || Shield;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Restaurant Subscription
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your verified status and plan
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
          ❌ {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm">
          ✅ {success}
        </div>
      )}

      {/* ✅ ACTIVE subscription card */}
      {isActive && sub && (
        <div
          className={`rounded-xl border-2 p-6 ${isNearExpiry ? "border-yellow-400 bg-yellow-50" : `${currentPlan?.border || "border-green-300"} ${currentPlan?.bg || "bg-green-50"}`}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Plan icon */}
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${currentPlan?.color || "from-green-400 to-green-600"}`}
              >
                <PlanIcon className="w-7 h-7 text-white" />
              </div>

              <div>
                {/* Name + verified badge */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-gray-900">
                    {sub.plan || "Verified"} Plan
                  </h2>
                  <VerifiedBadge plan={currentPlanKey || "gold"} />
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${currentPlan?.badge || "bg-green-200 text-green-800"}`}
                  >
                    {isNearExpiry ? "⚠️ Expiring Soon" : "✓ Active"}
                  </span>
                </div>

                {/* Subscription details */}
                <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                  <div>
                    <span className="text-gray-500">Purchase Date</span>
                    <p className="font-medium text-gray-900">
                      {sub.startDate
                        ? new Date(sub.startDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Expiry Date</span>
                    <p className="font-medium text-gray-900">
                      {new Date(sub.expiresAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Days Remaining</span>
                    <p
                      className={`font-bold ${isNearExpiry ? "text-yellow-600" : "text-green-600"}`}
                    >
                      {sub.daysLeft} days
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Auto-Renew</span>
                    <p className="font-medium text-gray-900">
                      {sub.autoRenew ? "✅ Enabled" : "❌ Disabled"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 sm:items-end shrink-0">
              <button
                onClick={() => setShowPlans((p) => !p)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
              >
                {currentPlanKey === "platinum" ? "Renew Plan" : "Upgrade Plan"}
              </button>
              <button
                onClick={handleToggleAutoRenew}
                disabled={toggling}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <RefreshCw className="w-3 h-3" />
                {toggling
                  ? "Updating..."
                  : sub.autoRenew
                    ? "Disable Auto-Renew"
                    : "Enable Auto-Renew"}
              </button>
            </div>
          </div>

          {/* Near expiry warning */}
          {isNearExpiry && (
            <div className="mt-4 flex items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-lg p-3">
              <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0" />
              <p className="text-sm text-yellow-700">
                Your subscription expires in{" "}
                <strong>{sub.daysLeft} days</strong>. Renew now to keep your
                verified status.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ✅ EXPIRED card */}
      {isExpired && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500 rounded-xl">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-900">
                Subscription Expired
              </h2>
              <p className="text-red-700 text-sm mt-1">
                Expired on {new Date(sub.expiresAt).toLocaleDateString()}. Renew
                to restore verified status.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPlans(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 shrink-0"
          >
            Reactivate Now
          </button>
        </div>
      )}

      {/* ✅ NO subscription */}
      {sub?.status === "none" && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-blue-900">
                Claim Your Restaurant
              </h2>
              <p className="text-blue-700 text-sm mt-1">
                Get verified and unlock all features. Starting from $160.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPlans(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 shrink-0"
          >
            View Plans
          </button>
        </div>
      )}

      {/* ✅ 3 PLAN cards — shown on demand */}
      {(showPlans || !isActive) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {isActive
              ? currentPlanKey === "platinum"
                ? "Renew Your Plan"
                : "Upgrade Your Plan"
              : "Choose a Plan"}
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isCurrent = plan.name.toLowerCase() === currentPlanKey;
              return (
                <div
                  key={plan.id}
                  onClick={() => !isCurrent && setSelected(plan.id)}
                  className={`relative rounded-xl border-2 p-5 transition-all ${
                    isCurrent
                      ? `${plan.border} ${plan.bg} opacity-60 cursor-not-allowed`
                      : selectedPlan === plan.id
                        ? `${plan.border} ${plan.bg} cursor-pointer`
                        : "border-gray-200 hover:border-gray-300 cursor-pointer"
                  }`}
                >
                  {plan.popular && !isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-orange-500 text-white text-xs px-3 py-0.5 rounded-full font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gray-500 text-white text-xs px-3 py-0.5 rounded-full font-medium">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${plan.color}`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-xs text-gray-500">{plan.duration}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-500 text-sm"> USD</span>
                  </div>

                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f) => (
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
                    onClick={() => !isCurrent && handlePurchase(plan.id)}
                    disabled={isCurrent}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                      isCurrent
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : selectedPlan === plan.id
                          ? "bg-orange-500 text-white hover:bg-orange-600"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {isCurrent ? "Current Plan" : `Get ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Benefits */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Verified Restaurant Benefits
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg shrink-0">
                  <Icon className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{b.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <p className="text-sm font-medium text-blue-900">
            Secure Payment via PayPal
          </p>
        </div>
        <p className="text-sm text-blue-700">
          Instant verification upon payment. Auto-renewal on by default. Email
          receipts for all transactions.
        </p>
      </div>
    </div>
  );
};

export default DashboardClaimSubscription;
