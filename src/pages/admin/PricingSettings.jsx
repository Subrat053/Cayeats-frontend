import { useState, useEffect } from "react";
import {
  Save,
  DollarSign,
  Star,
  Megaphone,
  Clock,
  Info,
  Check,
  Sparkles,
  Truck,
  Image,
  Tag,
  Calculator,
  Loader,
} from "lucide-react";
import { useAppData } from "../../context/AppDataContext";

const PricingSettings = () => {
  const { pricingTiers, setPricingTiers, updatePricingTier } = useAppData();
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // --- CLAIM PRICING (Semi-Annual & Annual only) ---
  const [claimPricing, setClaimPricing] = useState(() => {
    const stored = localStorage.getItem("claimPricing");
    return stored
      ? JSON.parse(stored)
      : {
          semiAnnual: { price: 160, label: "Semi-Annual" },
          annual: { price: 240, label: "Annual" },
        };
  });

  // --- RESTAURANT PRODUCT PLANS ---
  const [productPlans, setProductPlans] = useState(() => {
    const stored = localStorage.getItem("productPlans");
    return stored
      ? JSON.parse(stored)
      : {
          basic: {
            name: "Basic",
            semiAnnual: 99,
            annual: 179,
            products: 5,
            imagesPerProduct: 3,
            video: false,
            storeMap: false,
            docs: false,
          },
          professional: {
            name: "Professional",
            semiAnnual: 199,
            annual: 349,
            products: 15,
            imagesPerProduct: 5,
            video: false,
            storeMap: false,
            docs: false,
          },
          enterprise: {
            name: "Enterprise",
            semiAnnual: 399,
            annual: 699,
            products: 100,
            imagesPerProduct: 10,
            video: true,
            storeMap: true,
            docs: true,
          },
        };
  });

  // --- ADVERTISING RATES ---
  const [adPricing, setAdPricing] = useState(() => {
    const stored = localStorage.getItem("adPricing");
    return stored
      ? JSON.parse(stored)
      : {
          featuredListing: {
            monthly: 250,
            label: "Featured Listing",
            desc: "Top of ALL Restaurants + Cuisine Category pages",
          },
          categoryBanner: {
            monthly: 180,
            label: "Category Banner",
            desc: "Top banner per cuisine category page",
          },
          classifiedAd: {
            monthly: 120,
            label: "Classified / Product Ad",
            desc: "Real estate and general product ads",
          },
        };
  });

  // --- PROMO PRICING ---
  const [promoPricing, setPromoPricing] = useState(() => {
    const stored = localStorage.getItem("promoPricing");
    return stored
      ? JSON.parse(stored)
      : {
          topBanner: {
            monthly: 800,
            label: "Top Banner",
            desc: "Prime placement above fold",
          },
          middleBanner: {
            monthly: 500,
            label: "Middle Banner",
            desc: "Between featured and categories",
          },
          bottomBanner: {
            monthly: 300,
            label: "Bottom Banner",
            desc: "Footer area",
          },
        };
  });

  // --- TONIGHT'S CRAVINGS ---
  const [cravingsPricing, setCravingsPricing] = useState(() => {
    const stored = localStorage.getItem("cravingsPricing");
    return stored
      ? JSON.parse(stored)
      : {
          daily: 25,
          weekly: 140,
        };
  });

  // --- PRIORITY DELIVERY ---
  const [priorityDeliveryMonthly, setPriorityDeliveryMonthly] = useState(() => {
    const stored = localStorage.getItem("priorityDeliveryMonthly");
    return stored ? JSON.parse(stored) : 150;
  });

  // Auto-calculation helpers
  const calcSemiAnnual = (monthly) => Math.round(monthly * 6 * 0.95);
  const calcAnnual = (monthly) => Math.round(monthly * 12 * 0.9);

  // Save all pricing to localStorage
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      // Save all pricing tiers to localStorage
      localStorage.setItem("claimPricing", JSON.stringify(claimPricing));
      localStorage.setItem("productPlans", JSON.stringify(productPlans));
      localStorage.setItem("adPricing", JSON.stringify(adPricing));
      localStorage.setItem("promoPricing", JSON.stringify(promoPricing));
      localStorage.setItem("cravingsPricing", JSON.stringify(cravingsPricing));
      localStorage.setItem(
        "priorityDeliveryMonthly",
        JSON.stringify(priorityDeliveryMonthly),
      );

      setSuccess("Pricing settings saved successfully!");
      setHasChanges(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to save pricing: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const markChanged = () => setHasChanges(true);

  // ---- Helpers for inline editing ----
  const MoneyInput = ({ value, onChange, width = "w-20" }) => (
    <div className="flex items-center gap-1">
      <span className="text-gray-400">$</span>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => {
          onChange(parseFloat(e.target.value) || 0);
          markChanged();
        }}
        className={`${width} text-center border border-gray-300 rounded-lg py-1 focus:ring-2 focus:ring-primary/20 focus:border-primary`}
      />
    </div>
  );

  const ReadonlyMoney = ({ value }) => (
    <span className="inline-block px-3 py-1 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-medium">
      ${value.toLocaleString()}
    </span>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure all subscription, advertising, and product plan rates
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || loading}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${hasChanges && !loading ? "bg-primary text-white hover:bg-primary/90" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save All Changes
            </>
          )}
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
          <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* ====== 1. CLAIM PRICING (Semi-Annual & Annual ONLY) ====== */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Restaurant Claim Pricing
              </h2>
              <p className="text-sm text-gray-600">
                Semi-Annual &amp; Annual only — no monthly option
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Semi-Annual
            </h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-gray-500">$</span>
              <input
                type="number"
                value={claimPricing.semiAnnual.price}
                onChange={(e) => {
                  setClaimPricing({
                    ...claimPricing,
                    semiAnnual: {
                      ...claimPricing.semiAnnual,
                      price: parseFloat(e.target.value) || 0,
                    },
                  });
                  markChanged();
                }}
                className="text-3xl font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary focus:outline-none w-24"
              />
              <span className="text-gray-500">/6 months</span>
            </div>
          </div>
          <div className="rounded-xl border-2 border-primary p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Annual</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-gray-500">$</span>
              <input
                type="number"
                value={claimPricing.annual.price}
                onChange={(e) => {
                  setClaimPricing({
                    ...claimPricing,
                    annual: {
                      ...claimPricing.annual,
                      price: parseFloat(e.target.value) || 0,
                    },
                  });
                  markChanged();
                }}
                className="text-3xl font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary focus:outline-none w-24"
              />
              <span className="text-gray-500">/year</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 2. RESTAURANT PRODUCT PLANS (Semi-Annual & Annual, no transaction fee) ====== */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Tag className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Restaurant Product Plans
              </h2>
              <p className="text-sm text-gray-600">
                Feature dishes, recipes &amp; images. Plans: Semi-Annual &amp;
                Annual only.{" "}
                <span className="font-semibold text-green-700">
                  Zero transaction fee.
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 grid md:grid-cols-3 gap-6">
          {Object.entries(productPlans).map(([key, plan]) => (
            <div
              key={key}
              className={`rounded-xl border-2 p-6 ${key === "professional" ? "border-primary bg-primary/5" : "border-gray-200"}`}
            >
              {key === "professional" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-white text-xs font-medium rounded-full mb-3">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {plan.name}
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                {plan.products} products · {plan.imagesPerProduct} images each
                {plan.video && " · Video"}
                {plan.storeMap && " · Store Map"}
                {plan.docs && " · Documents"}
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">Semi-Annual</label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-gray-400">$</span>
                    <input
                      type="number"
                      value={plan.semiAnnual}
                      onChange={(e) => {
                        setProductPlans({
                          ...productPlans,
                          [key]: {
                            ...plan,
                            semiAnnual: parseFloat(e.target.value) || 0,
                          },
                        });
                        markChanged();
                      }}
                      className="text-2xl font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary focus:outline-none w-20"
                    />
                    <span className="text-gray-500 text-sm">/6mo</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Annual</label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-gray-400">$</span>
                    <input
                      type="number"
                      value={plan.annual}
                      onChange={(e) => {
                        setProductPlans({
                          ...productPlans,
                          [key]: {
                            ...plan,
                            annual: parseFloat(e.target.value) || 0,
                          },
                        });
                        markChanged();
                      }}
                      className="text-2xl font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary focus:outline-none w-20"
                    />
                    <span className="text-gray-500 text-sm">/yr</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  {plan.products} products
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Up to {plan.imagesPerProduct} images per product
                </div>
                {plan.video && (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Video uploads
                  </div>
                )}
                {plan.storeMap && (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Store map
                  </div>
                )}
                {plan.docs && (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Document attachments
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  No transaction fee
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Links to restaurant profile
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== 3. ADVERTISING RATES: Monthly entered, semi-annual & annual auto-calculated ====== */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Advertising Rates
              </h2>
              <p className="text-sm text-gray-600">
                Enter <strong>monthly</strong> rate only. Semi-Annual = monthly
                × 6 − 5%. Annual = monthly × 12 − 10%.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Placement
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  Monthly (editable)
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  Semi-Annual{" "}
                  <span className="text-xs text-green-600">(−5%)</span>
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  Annual <span className="text-xs text-green-600">(−10%)</span>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(adPricing).map(([key, ad]) => (
                <tr key={key}>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">
                      {ad.label}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      <MoneyInput
                        value={ad.monthly}
                        onChange={(v) =>
                          setAdPricing({
                            ...adPricing,
                            [key]: { ...ad, monthly: v },
                          })
                        }
                      />
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <ReadonlyMoney value={calcSemiAnnual(ad.monthly)} />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <ReadonlyMoney value={calcAnnual(ad.monthly)} />
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{ad.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ====== 4. BANNER PROMO PRICING (3 Levels: Top/Middle/Bottom) Monthly, Semi-Annual, Annual ====== */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Image className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Banner Promo Pricing (3-Level)
              </h2>
              <p className="text-sm text-gray-600">
                Top, Middle &amp; Bottom user-side banners. Enter monthly, rest
                auto-calculated.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Zone
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  Monthly (editable)
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  Semi-Annual{" "}
                  <span className="text-xs text-green-600">(−5%)</span>
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  Annual <span className="text-xs text-green-600">(−10%)</span>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Position
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(promoPricing).map(([key, promo]) => (
                <tr key={key}>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">
                      {promo.label}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      <MoneyInput
                        value={promo.monthly}
                        onChange={(v) =>
                          setPromoPricing({
                            ...promoPricing,
                            [key]: { ...promo, monthly: v },
                          })
                        }
                      />
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <ReadonlyMoney value={calcSemiAnnual(promo.monthly)} />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <ReadonlyMoney value={calcAnnual(promo.monthly)} />
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {promo.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ====== 5. TONIGHT'S CRAVINGS (Daily & Weekly ONLY) ====== */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Tonight's Cravings
              </h2>
              <p className="text-sm text-gray-600">
                Evening promo placement (5PM–10PM). Daily &amp; Weekly durations
                only.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border-2 border-gray-200 p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Daily</h3>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                value={cravingsPricing.daily}
                onChange={(e) => {
                  setCravingsPricing({
                    ...cravingsPricing,
                    daily: parseFloat(e.target.value) || 0,
                  });
                  markChanged();
                }}
                className="text-3xl font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary focus:outline-none w-20 text-center"
              />
              <span className="text-gray-500">/day</span>
            </div>
          </div>
          <div className="rounded-xl border-2 border-primary p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Weekly</h3>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                value={cravingsPricing.weekly}
                onChange={(e) => {
                  setCravingsPricing({
                    ...cravingsPricing,
                    weekly: parseFloat(e.target.value) || 0,
                  });
                  markChanged();
                }}
                className="text-3xl font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary focus:outline-none w-20 text-center"
              />
              <span className="text-gray-500">/week</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 6. PRIORITY DELIVERY (Only 1 per restaurant, monthly entered, rest extrapolated) ====== */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Truck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Priority Delivery Upgrade
              </h2>
              <p className="text-sm text-gray-600">
                Only <strong>1 priority delivery per restaurant</strong>. Name
                appears top, 15-20% bigger &amp; bolder. Enter{" "}
                <strong>monthly</strong> price — semi-annual &amp; annual are
                auto-calculated with 5% deduction per slot.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-xl border-2 border-primary p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-1">Monthly</h3>
              <p className="text-xs text-gray-500 mb-3">(You enter this)</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-gray-400">$</span>
                <input
                  type="number"
                  value={priorityDeliveryMonthly}
                  onChange={(e) => {
                    setPriorityDeliveryMonthly(parseFloat(e.target.value) || 0);
                    markChanged();
                  }}
                  className="text-3xl font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary focus:outline-none w-24 text-center"
                />
                <span className="text-gray-500">/mo</span>
              </div>
            </div>
            <div className="rounded-xl border-2 border-gray-200 p-6 text-center bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-1">Semi-Annual</h3>
              <p className="text-xs text-green-600 mb-3">monthly × 6 − 5%</p>
              <div className="text-3xl font-bold text-gray-900">
                <ReadonlyMoney
                  value={calcSemiAnnual(priorityDeliveryMonthly)}
                />
              </div>
            </div>
            <div className="rounded-xl border-2 border-gray-200 p-6 text-center bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-1">Annual</h3>
              <p className="text-xs text-green-600 mb-3">monthly × 12 − 10%</p>
              <div className="text-3xl font-bold text-gray-900">
                <ReadonlyMoney value={calcAnnual(priorityDeliveryMonthly)} />
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-start gap-3">
            <Calculator className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
            <div className="text-sm text-purple-800">
              <strong>How it works:</strong> Only one delivery agent can hold
              priority status per restaurant. Their name appears at the top,
              15-20% bigger and bolder than others. Only enter the monthly price
              — the system auto-calculates:
              <br />
              Semi-Annual = ${priorityDeliveryMonthly} × 6 × 0.95 ={" "}
              <strong>${calcSemiAnnual(priorityDeliveryMonthly)}</strong> |
              Annual = ${priorityDeliveryMonthly} × 12 × 0.90 ={" "}
              <strong>${calcAnnual(priorityDeliveryMonthly)}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ====== Summary & Pricing Notes ====== */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-blue-900">Pricing Rules</h3>
          <ul className="text-sm text-blue-700 mt-1 space-y-1">
            <li>
              • <strong>Plans</strong> (Restaurant Claim &amp; Product Plans):
              Semi-Annual &amp; Annual only — no monthly option.
            </li>
            <li>
              • <strong>Promos</strong> (Banners, Featured Listings,
              Classifieds): Monthly, Semi-Annual, Annual. Semi-Annual = monthly
              × 6 − 5%. Annual = monthly × 12 − 10%.
            </li>
            <li>
              • <strong>Tonight's Cravings:</strong> Daily &amp; Weekly only.
            </li>
            <li>
              • <strong>Priority Delivery:</strong> Enter monthly only.
              Semi-Annual = monthly × 6 − 5%. Annual = monthly × 12 − 10%. Max 1
              per restaurant.
            </li>
            <li>
              • <strong>Product Plans:</strong> Zero transaction fee across all
              tiers.
            </li>
            <li>
              • All prices are in USD. Changes apply to new purchases
              immediately.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PricingSettings;
