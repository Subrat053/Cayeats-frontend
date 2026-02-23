import { useState, useEffect } from "react";
import {
  Save,
  DollarSign,
  Star,
  Clock,
  Info,
  Check,  
  Sparkles,
  Truck,
  Image,
  Tag,
  Calculator,
  Loader,
  Percent,
  RefreshCw,
} from "lucide-react";
import { getAdminSettings, updateAdminSettings } from "../../api/adminService";

const PricingSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // ── State ──────────────────────────────────────────────
  const [firstYearDiscount, setFirstYearDiscount] = useState(50);

  const [claimPricing, setClaimPricing] = useState({
    semiAnnual: 160,
    annual: 240,
  });

  const [productPlans, setProductPlans] = useState({
    basic: { semiAnnual: 99, annual: 179 },
    professional: { semiAnnual: 199, annual: 349 },
    enterprise: { semiAnnual: 399, annual: 699 },
  });

  const [adPricing, setAdPricing] = useState({
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
  });

  const [promoPricing, setPromoPricing] = useState({
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
    bottomBanner: { monthly: 300, label: "Bottom Banner", desc: "Footer area" },
  });

  const [cravingsPricing, setCravingsPricing] = useState({
    daily: 25,
    weekly: 140,
  });
  const [priorityDeliveryMonthly, setPriorityDeliveryMonthly] = useState(150);

  // ── Load from API ──────────────────────────────────────
  useEffect(() => {
    getAdminSettings()
      .then((data) => {
        if (!data) return;
        if (data.firstYearDiscount !== undefined)
          setFirstYearDiscount(data.firstYearDiscount);
        if (data.claimPricing) setClaimPricing(data.claimPricing);
        if (data.productPlans) setProductPlans(data.productPlans);
        if (data.adPricing)
          setAdPricing((prev) => mergeAdPricing(prev, data.adPricing));
        if (data.promoPricing)
          setPromoPricing((prev) => mergeAdPricing(prev, data.promoPricing));
        if (data.cravingsPricing) setCravingsPricing(data.cravingsPricing);
        if (data.priorityDeliveryMonthly !== undefined)
          setPriorityDeliveryMonthly(data.priorityDeliveryMonthly);
      })
      .catch((err) => setError("Failed to load settings: " + err.message))
      .finally(() => setLoading(false));
  }, []);

  // Merge preserving labels/desc from local state
  const mergeAdPricing = (local, remote) => {
    const merged = { ...local };
    Object.keys(remote).forEach((key) => {
      if (merged[key]) merged[key] = { ...merged[key], ...remote[key] };
    });
    return merged;
  };

  const mark = () => setHasChanges(true);

  // ── Helpers ────────────────────────────────────────────
  const calcSemiAnnual = (monthly) => Math.round(monthly * 6 * 0.95);
  const calcAnnual = (monthly) => Math.round(monthly * 12 * 0.9);
  const applyDiscount = (price) =>
    Math.round(price * (1 - firstYearDiscount / 100));

  // ── Save ───────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      // Strip labels/desc before sending to backend
      const cleanAd = {};
      Object.entries(adPricing).forEach(([k, v]) => {
        cleanAd[k] = { monthly: v.monthly };
      });
      const cleanPromo = {};
      Object.entries(promoPricing).forEach(([k, v]) => {
        cleanPromo[k] = { monthly: v.monthly };
      });

      await updateAdminSettings({
        firstYearDiscount,
        claimPricing,
        productPlans,
        adPricing: cleanAd,
        promoPricing: cleanPromo,
        cravingsPricing,
        priorityDeliveryMonthly,
      });
      setSuccess("Pricing saved successfully!");
      setHasChanges(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Sub-components ─────────────────────────────────────
  const MoneyInput = ({
    value,
    onChange,
    size = "text-2xl",
    width = "w-20",
  }) => (
    <div className="flex items-center gap-1">
      <span className="text-gray-400">$</span>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => {
          onChange(parseFloat(e.target.value) || 0);
          mark();
        }}
        className={`${width} ${size} font-bold text-gray-900 bg-transparent border-b-2 border-gray-200 hover:border-gray-400 focus:border-orange-500 focus:outline-none text-center`}
      />
    </div>
  );

  const ReadonlyMoney = ({ value, discounted = false }) => (
    <div className="text-center">
      <span className="inline-block px-3 py-1 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-bold">
        ${value.toLocaleString()}
      </span>
      {discounted && (
        <div className="mt-1">
          <span className="text-xs text-green-600 font-medium line-through">
            ${value.toLocaleString()}
          </span>
          <span className="ml-1 text-xs font-bold text-green-700">
            ${applyDiscount(value).toLocaleString()} 1st yr
          </span>
        </div>
      )}
    </div>
  );

  const SectionHeader = ({
    icon: Icon,
    iconBg,
    iconColor,
    title,
    subtitle,
  }) => (
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className={`p-2 ${iconBg} rounded-lg`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
      </div>
    );

  return (
    <div className="space-y-8 pb-10">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing Settings</h1>
          <p className="text-gray-500 mt-1">
            Configure all subscription, advertising, and product plan rates
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
            hasChanges && !saving
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {saving ? (
            <>
              <Loader className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save All Changes
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm flex gap-2">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm flex gap-2">
          <Check className="w-4 h-4 mt-0.5 shrink-0" />
          {success}
        </div>
      )}

      {/* ── 🎉 First Year Discount ── */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 overflow-hidden">
        <div className="p-6 border-b border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Percent className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                First Year Discount
              </h2>
              <p className="text-sm text-gray-600">
                Applied automatically to all new restaurant subscriptions in
                year 1
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="100"
              value={firstYearDiscount}
              onChange={(e) => {
                setFirstYearDiscount(parseFloat(e.target.value) || 0);
                mark();
              }}
              className="text-5xl font-bold text-green-700 bg-transparent border-b-2 border-green-300 focus:border-green-600 focus:outline-none w-24 text-center"
            />
            <span className="text-4xl font-bold text-green-600">%</span>
            <span className="text-gray-600 font-medium">
              OFF
              <br />
              first year
            </span>
          </div>
          <div className="flex-1 bg-white rounded-xl p-4 border border-green-200">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Preview — What new restaurants pay in Year 1:
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Semi-Annual claim:</span>
                <span className="font-bold text-green-700">
                  ${applyDiscount(claimPricing.semiAnnual)}{" "}
                  <span className="line-through text-gray-400 font-normal">
                    ${claimPricing.semiAnnual}
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Annual claim:</span>
                <span className="font-bold text-green-700">
                  ${applyDiscount(claimPricing.annual)}{" "}
                  <span className="line-through text-gray-400 font-normal">
                    ${claimPricing.annual}
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Basic semi-annual:</span>
                <span className="font-bold text-green-700">
                  ${applyDiscount(productPlans.basic.semiAnnual)}{" "}
                  <span className="line-through text-gray-400 font-normal">
                    ${productPlans.basic.semiAnnual}
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Professional annual:</span>
                <span className="font-bold text-green-700">
                  ${applyDiscount(productPlans.professional.annual)}{" "}
                  <span className="line-through text-gray-400 font-normal">
                    ${productPlans.professional.annual}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 1. Claim Pricing ── */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <SectionHeader
          icon={DollarSign}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          title="Restaurant Claim Pricing"
          subtitle="Semi-Annual & Annual only — no monthly option"
        />
        <div className="p-6 grid md:grid-cols-2 gap-6">
          {[
            {
              key: "semiAnnual",
              label: "Semi-Annual",
              period: "/6 months",
              highlight: false,
            },
            {
              key: "annual",
              label: "Annual",
              period: "/year",
              highlight: true,
            },
          ].map(({ key, label, period, highlight }) => (
            <div
              key={key}
              className={`rounded-xl border-2 p-6 ${highlight ? "border-orange-400 bg-orange-50" : "border-gray-200"}`}
            >
              {highlight && (
                <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-medium mb-3 inline-block">
                  Best Value
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-3">{label}</h3>
              <MoneyInput
                size="text-4xl"
                width="w-28"
                value={claimPricing[key]}
                onChange={(v) => setClaimPricing({ ...claimPricing, [key]: v })}
              />
              <p className="text-gray-500 text-sm mt-1">{period}</p>
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700 font-medium">
                  Year 1 price (with {firstYearDiscount}% off):
                </p>
                <p className="text-2xl font-bold text-green-700">
                  ${applyDiscount(claimPricing[key])}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 2. Product Plans ── */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <SectionHeader
          icon={Tag}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          title="Restaurant Product Plans"
          subtitle="Feature dishes, recipes & images. Semi-Annual & Annual only. Zero transaction fee."
        />
        <div className="p-6 grid md:grid-cols-3 gap-6">
          {[
            {
              key: "basic",
              name: "Basic",
              popular: false,
              products: 5,
              images: 3,
            },
            {
              key: "professional",
              name: "Professional",
              popular: true,
              products: 15,
              images: 5,
            },
            {
              key: "enterprise",
              name: "Enterprise",
              popular: false,
              products: 100,
              images: 10,
            },
          ].map(({ key, name, popular, products, images }) => (
            <div
              key={key}
              className={`rounded-xl border-2 p-6 ${popular ? "border-orange-400 bg-orange-50" : "border-gray-200"}`}
            >
              {popular && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full mb-3">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-4">{name}</h3>
              {["semiAnnual", "annual"].map((period) => (
                <div key={period} className="mb-4">
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    {period === "semiAnnual" ? "Semi-Annual" : "Annual"}
                  </label>
                  <MoneyInput
                    value={productPlans[key][period]}
                    onChange={(v) =>
                      setProductPlans({
                        ...productPlans,
                        [key]: { ...productPlans[key], [period]: v },
                      })
                    }
                  />
                  <p className="text-xs text-green-600 mt-1">
                    1st yr: ${applyDiscount(productPlans[key][period])}
                  </p>
                </div>
              ))}
              <div className="mt-3 space-y-1.5 text-sm text-gray-600 border-t border-gray-100 pt-3">
                {[
                  `${products} products`,
                  `${images} images per product`,
                  "No transaction fee",
                  "Links to restaurant profile",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Advertising Rates ── */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <SectionHeader
          icon={Star}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
          title="Advertising Rates"
          subtitle="Enter monthly rate. Semi-Annual = ×6 −5%. Annual = ×12 −10%."
        />
        <div className="p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500">
                <th className="text-left py-3 px-4">Placement</th>
                <th className="text-center py-3 px-4">Monthly</th>
                <th className="text-center py-3 px-4">
                  Semi-Annual <span className="text-green-600">(−5%)</span>
                </th>
                <th className="text-center py-3 px-4">
                  Annual <span className="text-green-600">(−10%)</span>
                </th>
                <th className="text-left py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(adPricing).map(([key, ad]) => (
                <tr key={key}>
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {ad.label}
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
                    <span className="px-3 py-1 bg-gray-100 rounded-lg font-bold text-gray-700">
                      ${calcSemiAnnual(ad.monthly).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-3 py-1 bg-gray-100 rounded-lg font-bold text-gray-700">
                      ${calcAnnual(ad.monthly).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">{ad.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 4. Banner Promo ── */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <SectionHeader
          icon={Image}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          title="Banner Promo Pricing (3-Level)"
          subtitle="Top, Middle & Bottom banners. Enter monthly, rest auto-calculated."
        />
        <div className="p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500">
                <th className="text-left py-3 px-4">Zone</th>
                <th className="text-center py-3 px-4">Monthly</th>
                <th className="text-center py-3 px-4">
                  Semi-Annual <span className="text-green-600">(−5%)</span>
                </th>
                <th className="text-center py-3 px-4">
                  Annual <span className="text-green-600">(−10%)</span>
                </th>
                <th className="text-left py-3 px-4">Position</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(promoPricing).map(([key, promo]) => (
                <tr key={key}>
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {promo.label}
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
                    <span className="px-3 py-1 bg-gray-100 rounded-lg font-bold text-gray-700">
                      ${calcSemiAnnual(promo.monthly).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-3 py-1 bg-gray-100 rounded-lg font-bold text-gray-700">
                      ${calcAnnual(promo.monthly).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {promo.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 5. Tonight's Cravings ── */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <SectionHeader
          icon={Clock}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          title="Tonight's Cravings"
          subtitle="Evening promo placement (5PM–10PM). Daily & Weekly durations only."
        />
        <div className="p-6 grid md:grid-cols-2 gap-6">
          {[
            { key: "daily", label: "Daily", period: "/day" },
            { key: "weekly", label: "Weekly", period: "/week" },
          ].map(({ key, label, period }) => (
            <div
              key={key}
              className="rounded-xl border-2 border-gray-200 p-6 text-center"
            >
              <h3 className="font-semibold text-gray-900 mb-4">{label}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-gray-400 text-xl">$</span>
                <input
                  type="number"
                  min="0"
                  value={cravingsPricing[key]}
                  onChange={(e) => {
                    setCravingsPricing({
                      ...cravingsPricing,
                      [key]: parseFloat(e.target.value) || 0,
                    });
                    mark();
                  }}
                  className="text-4xl font-bold text-gray-900 bg-transparent border-b-2 border-gray-200 hover:border-gray-400 focus:border-orange-500 focus:outline-none w-24 text-center"
                />
                <span className="text-gray-500">{period}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Priority Delivery ── */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <SectionHeader
          icon={Truck}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
          title="Priority Delivery Upgrade"
          subtitle="Only 1 priority delivery per restaurant. Enter monthly — semi-annual & annual auto-calculated."
        />
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-xl border-2 border-orange-400 bg-orange-50 p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-1">Monthly</h3>
              <p className="text-xs text-gray-500 mb-3">(editable)</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-gray-400 text-xl">$</span>
                <input
                  type="number"
                  min="0"
                  value={priorityDeliveryMonthly}
                  onChange={(e) => {
                    setPriorityDeliveryMonthly(parseFloat(e.target.value) || 0);
                    mark();
                  }}
                  className="text-4xl font-bold text-gray-900 bg-transparent border-b-2 border-orange-300 focus:border-orange-600 focus:outline-none w-24 text-center"
                />
                <span className="text-gray-500">/mo</span>
              </div>
            </div>
            <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-1">Semi-Annual</h3>
              <p className="text-xs text-green-600 mb-3">×6 −5%</p>
              <p className="text-4xl font-bold text-gray-900">
                ${calcSemiAnnual(priorityDeliveryMonthly).toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-1">Annual</h3>
              <p className="text-xs text-green-600 mb-3">×12 −10%</p>
              <p className="text-4xl font-bold text-gray-900">
                ${calcAnnual(priorityDeliveryMonthly).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex items-start gap-3">
            <Calculator className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
            <p className="text-sm text-indigo-800">
              <strong>Formula:</strong> Semi-Annual = ${priorityDeliveryMonthly}{" "}
              × 6 × 0.95 ={" "}
              <strong>${calcSemiAnnual(priorityDeliveryMonthly)}</strong>{" "}
              &nbsp;|&nbsp; Annual = ${priorityDeliveryMonthly} × 12 × 0.90 ={" "}
              <strong>${calcAnnual(priorityDeliveryMonthly)}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── Pricing Rules ── */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-2">Pricing Rules</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • <strong>First Year Discount</strong> applies to all new
              restaurant subscriptions automatically.
            </li>
            <li>
              • <strong>Claim & Product Plans:</strong> Semi-Annual & Annual
              only — no monthly option.
            </li>
            <li>
              • <strong>Promos (Banners, Featured, Classifieds):</strong>{" "}
              Monthly entered; Semi-Annual = ×6 −5%; Annual = ×12 −10%.
            </li>
            <li>
              • <strong>Tonight's Cravings:</strong> Daily & Weekly only.
            </li>
            <li>
              • <strong>Priority Delivery:</strong> Max 1 per restaurant.
              Monthly entered; Semi-Annual & Annual auto-calculated.
            </li>
            <li>
              • All prices in USD. Changes apply to new purchases immediately
              after saving.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PricingSettings;
