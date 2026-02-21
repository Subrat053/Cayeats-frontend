import { useState, useEffect } from "react";
import {
  ImagePlus,
  Upload,
  Clock,
  CheckCircle,
  X,
  CreditCard,
  Eye,
  MousePointer,
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  getAdsPricing,
  getBannerAdStatus,
  purchaseBannerAd,
} from "../../api/restaurantService";

const ZONES = [
  {
    id: "top",
    name: "Top Banner",
    position: "Above hero section",
    size: "1200x200px",
    note: "Highest visibility",
  },
  {
    id: "middle",
    name: "Middle Banner",
    position: "Between featured and restaurant list",
    size: "1200x300px",
    note: "High visibility",
  },
  {
    id: "bottom",
    name: "Bottom Banner",
    position: "End of page",
    size: "1200x150px",
    note: "Medium visibility",
  },
];

const DURATIONS = [
  { id: "monthly", name: "Monthly", discount: 1 },
  {
    id: "semiAnnual",
    name: "Semi-Annual",
    discount: 0.95 * 6,
    savings: "5% off",
  },
  { id: "annual", name: "Annual", discount: 0.9 * 12, savings: "10% off" },
];

const DashboardBannerAds = () => {
  const [pricing, setPricing] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    zone: "top",
    image: null,
    headline: "",
    description: "",
    cta: "Learn More",
    url: "",
    duration: "monthly",
  });

  useEffect(() => {
    Promise.all([getAdsPricing(), getBannerAdStatus()])
      .then(([p, a]) => {
        setPricing(p);
        setAds(a || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const getPrice = (zone, duration) => {
    if (!pricing) return 0;
    const monthly = pricing.bannerAds[zone]?.monthly || 500;
    const d = DURATIONS.find((d) => d.id === duration);
    return Math.round(monthly * (d?.discount || 1));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFormData((p) => ({ ...p, image: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPurchasing(true);
    setError(null);
    try {
      const result = await purchaseBannerAd(formData);
      setSuccess("Banner ad submitted for admin approval!");
      setAds((prev) => [result.data, ...prev]);
      setShowForm(false);
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

  const pending = ads.filter((a) => a.status === "pending");
  const active = ads.filter((a) => a.status === "active");

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Banner Advertising
          </h1>
          <p className="text-gray-600 mt-1">
            Eye-catching banners with rotating placement and click tracking
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 text-sm font-medium"
        >
          <ImagePlus className="w-4 h-4" /> Create Banner Ad
        </button>
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

      {/* ✅ Pending - real data */}
      {pending.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-yellow-600" />
            <h2 className="font-semibold text-yellow-900">
              Pending Admin Approval
            </h2>
          </div>
          <div className="space-y-3">
            {pending.map((ad) => (
              <div
                key={ad._id}
                className="bg-white rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{ad.headline}</h3>
                  <p className="text-sm text-gray-500">
                    Zone: {ZONES.find((z) => z.id === ad.zone)?.name}
                  </p>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                  ⏳ Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Active ads - real data */}
      {active.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ImagePlus className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-blue-900">Active Banner Ads</h2>
          </div>
          <div className="space-y-4">
            {active.map((ad) => (
              <div key={ad._id} className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {ad.headline}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {ZONES.find((z) => z.id === ad.zone)?.name}
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Live
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                      <Eye className="w-4 h-4" />
                      <span className="text-xs">Views</span>
                    </div>
                    <p className="font-bold text-gray-900">
                      {ad.views?.toLocaleString() ?? 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                      <MousePointer className="w-4 h-4" />
                      <span className="text-xs">Clicks</span>
                    </div>
                    <p className="font-bold text-gray-900">
                      {ad.clicks?.toLocaleString() ?? 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                      <span className="text-xs">CTR</span>
                    </div>
                    <p className="font-bold text-gray-900">
                      {ad.views ? ((ad.clicks / ad.views) * 100).toFixed(1) : 0}
                      %
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zone info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Available Banner Zones
        </h2>
        <div className="space-y-3">
          {ZONES.map((zone) => (
            <div
              key={zone.id}
              className="flex items-center justify-between border border-gray-100 rounded-lg p-4"
            >
              <div>
                <h3 className="font-medium text-gray-900">{zone.name}</h3>
                <p className="text-sm text-gray-500">
                  {zone.position} • {zone.size}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {zone.note}
                </span>
                {pricing && (
                  <p className="text-sm font-semibold text-orange-500 mt-1">
                    from ${pricing.bannerAds[zone.id]?.monthly}/mo
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-xl border-2 border-orange-500 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Create Banner Ad
            </h2>
            <button onClick={() => setShowForm(false)}>
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Zone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Banner Zone *
              </label>
              <div className="space-y-2">
                {ZONES.map((zone) => (
                  <div
                    key={zone.id}
                    onClick={() =>
                      setFormData((p) => ({ ...p, zone: zone.id }))
                    }
                    className={`p-4 border-2 rounded-lg cursor-pointer flex justify-between items-center ${
                      formData.zone === zone.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{zone.name}</p>
                      <p className="text-sm text-gray-500">{zone.position}</p>
                    </div>
                    {pricing && (
                      <p className="font-bold text-orange-500">
                        ${getPrice(zone.id, formData.duration)}/mo
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({ ...p, image: null }))
                      }
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload banner image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Headline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Headline *
              </label>
              <input
                type="text"
                value={formData.headline}
                maxLength={80}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, headline: e.target.value }))
                }
                placeholder="Grand Opening Special!"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.headline.length}/80
              </p>
            </div>

            {/* CTA + URL */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call to Action *
                </label>
                <input
                  type="text"
                  value={formData.cta}
                  maxLength={25}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, cta: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Click URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, url: e.target.value }))
                  }
                  placeholder="https://"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Duration *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {DURATIONS.map((d) => (
                  <div
                    key={d.id}
                    onClick={() =>
                      setFormData((p) => ({ ...p, duration: d.id }))
                    }
                    className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                      formData.duration === d.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-medium text-gray-900">{d.name}</p>
                    <p className="text-xl font-bold text-orange-500">
                      ${getPrice(formData.zone, d.id)}
                    </p>
                    {d.savings && (
                      <p className="text-xs text-green-600">{d.savings}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">
                Admin approval required before your banner goes live. Payment is
                processed immediately.
              </p>
            </div>

            {formData.headline && formData.image && (
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-orange-500">
                    ${getPrice(formData.zone, formData.duration)} USD
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  !formData.image ||
                  !formData.headline ||
                  !formData.cta ||
                  purchasing
                }
                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                {purchasing ? "Submitting..." : "Submit for Approval"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DashboardBannerAds;
