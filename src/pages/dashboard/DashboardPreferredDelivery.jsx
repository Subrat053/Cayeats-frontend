import { useState, useEffect } from "react";
import {
  Crown,
  CheckCircle,
  Star,
  TrendingUp,
  Award,
  CreditCard,
  Info,
} from "lucide-react";
import {
  getAdsPricing,
  getPreferredDeliveryStatus,
  purchasePreferredDelivery,
  getRestaurantProfile,
} from "../../api/restaurantService";

const DashboardPreferredDelivery = () => {
  const [pricing, setPricing] = useState(null);
  const [active, setActive] = useState(null);
  const [providers, setProviders] = useState([]); // ✅ real providers from restaurant
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedProvider, setProvider] = useState("");
  const [selectedDuration, setDuration] = useState("6months");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    Promise.all([
      getAdsPricing(),
      getPreferredDeliveryStatus(),
      getRestaurantProfile(),
    ])
      .then(([p, activePreferred, profile]) => {
        setPricing(p);
        setActive(activePreferred);
        // ✅ real delivery providers from restaurant model
        setProviders(profile?.deliveryProviders || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handlePurchase = async () => {
    if (!selectedProvider || !selectedDuration) return;
    setPurchasing(true);
    setError(null);
    try {
      const result = await purchasePreferredDelivery({
        providerName: selectedProvider,
        duration: selectedDuration,
      });
      setSuccess(`${selectedProvider} is now your preferred delivery partner!`);
      setActive(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );

  const plans = pricing
    ? [
        {
          id: "6months",
          name: "6 Months",
          price: pricing.preferredDelivery["6months"],
        },
        {
          id: "1year",
          name: "1 Year",
          price: pricing.preferredDelivery["1year"],
          popular: true,
        },
      ]
    : [];

  const selectedPlan = plans.find((p) => p.id === selectedDuration);
  const daysLeft = active?.endDate
    ? Math.ceil((new Date(active.endDate) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Preferred Delivery</h1>
        <p className="text-gray-600 mt-1">
          One delivery partner gets top placement — button appears first and 40%
          larger
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

      {/* ✅ Active preferred - real data */}
      {active && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold text-purple-900">
              Active Preferred Partner
            </h2>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    {active.providerName}
                  </h3>
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" /> PREFERRED
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="text-green-600">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Appears first
                  </span>
                  <span className="text-green-600">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    40% larger button
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {daysLeft} days remaining
                </p>
                <p className="text-xs text-gray-400">
                  Expires {new Date(active.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {[
              {
                icon: Star,
                title: "Top Placement",
                desc: "Button appears first",
              },
              {
                icon: TrendingUp,
                title: "40% Larger",
                desc: "Bigger and bolder than others",
              },
              {
                icon: Award,
                title: "Preferred Label",
                desc: "Clearly labeled as Preferred",
              },
            ].map((b, i) => (
              <div key={i} className="bg-white rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <b.icon className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 text-sm">{b.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          How Preferred Delivery Works
        </h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              Button appears at the TOP of delivery list
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              Button is 40% larger than other providers
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              Clearly labeled as "Preferred"
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              Only ONE preferred slot per restaurant
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              Available periods: 6 months or 1 year only
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              Pricing set by CayEats admin
            </li>
          </ul>
        </div>
      </div>

      {/* Provider selection - ✅ real providers from restaurant */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Select Preferred Provider
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Choose from your restaurant's active delivery providers
        </p>

        {providers.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No delivery providers set up yet.</p>
            <p className="text-xs mt-1">
              Contact admin to add delivery providers to your restaurant.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {providers.map((provider) => (
              <div
                key={provider.providerName}
                onClick={() => setProvider(provider.providerName)}
                className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedProvider === provider.providerName
                    ? "border-orange-500 bg-orange-50"
                    : provider.isPreferred
                      ? "border-purple-300 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {provider.isPreferred && (
                  <span className="absolute top-2 right-2 bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Current
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {provider.providerName}
                    </h3>
                    {provider.orderUrl && (
                      <p className="text-xs text-green-600 mt-1">
                        ✅ Active link configured by admin
                      </p>
                    )}
                  </div>
                  {selectedProvider === provider.providerName && (
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Purchase */}
      {selectedProvider && (
        <div className="bg-white rounded-xl border-2 border-orange-500 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Purchase Preferred Placement
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setDuration(plan.id)}
                className={`relative p-5 border-2 rounded-xl cursor-pointer text-center transition-all ${
                  selectedDuration === plan.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Best Value
                    </span>
                  </div>
                )}
                <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-3xl font-bold text-orange-500 mt-2">
                  ${plan.price}
                </p>
                <p className="text-xs text-gray-500 mt-1">USD — one time</p>
              </div>
            ))}
          </div>

          {selectedPlan && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Provider</span>
                <span className="font-medium">{selectedProvider}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Benefits</span>
                <span className="font-medium">
                  Top + 40% Larger + Preferred Label
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-orange-500">
                  ${selectedPlan.price} USD
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handlePurchase}
            disabled={purchasing}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
          >
            <CreditCard className="w-5 h-5" />
            {purchasing ? "Processing..." : "Purchase Preferred Placement"}
          </button>
          <p className="text-center text-sm text-gray-500 mt-3">
            Placement starts immediately after payment
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Only <strong>one</strong> delivery provider can hold preferred status
          per restaurant. Purchasing a new preferred placement will replace the
          current one. Pricing is set by CayEats admin.
        </p>
      </div>
    </div>
  );
};

export default DashboardPreferredDelivery;
