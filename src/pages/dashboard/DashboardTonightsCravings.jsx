import { useState, useEffect } from "react";
import {
  Clock,
  CreditCard,
  Eye,
  CheckCircle,
  Upload,
  X,
  Info,
} from "lucide-react";
import {
  getAdsPricing,
  getCravingsStatus,
  purchaseTonightsCravings,
  uploadImage,
} from "../../api/restaurantService.js";

const DashboardTonightsCravings = () => {
  const [pricing, setPricing] = useState(null);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [uploading, setUploading] = useState(false); // ✅ image upload state
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    image: null, // ✅ will be a real Cloudinary URL
    imagePreview: null, // ✅ separate preview for display
    headline: "",
    cta: "Order Now",
    duration: "weekly",
  });

  useEffect(() => {
    Promise.all([getAdsPricing(), getCravingsStatus()])
      .then(([p, a]) => {
        setPricing(p);
        setActive(a);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ✅ real upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // show local preview immediately
    const preview = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, imagePreview: preview }));

    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file); // ✅ uploads to Cloudinary, returns real URL
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err) {
      setError("Image upload failed. Please try again.");
      setFormData((prev) => ({ ...prev, image: null, imagePreview: null }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      setError("Please wait for the image to finish uploading.");
      return;
    }
    setPurchasing(true);
    setError(null);
    try {
      const result = await purchaseTonightsCravings({
        image: formData.image, // ✅ real Cloudinary URL
        headline: formData.headline,
        cta: formData.cta,
        duration: formData.duration,
      });
      setSuccess(
        "Tonight's Cravings submitted! Goes live after admin approval.",
      );
      setActive(result.data);
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

  const plans = pricing
    ? [
        { id: "daily", name: "Daily", price: pricing.tonightsCravings.daily },
        {
          id: "weekly",
          name: "Weekly",
          price: pricing.tonightsCravings.weekly,
          savings: `Save $${pricing.tonightsCravings.daily * 7 - pricing.tonightsCravings.weekly} vs 7×daily`,
        },
      ]
    : [];

  const selectedPlan = plans.find((p) => p.id === formData.duration);
  const daysLeft = active?.endDate
    ? Math.ceil((new Date(active.endDate) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tonight's Cravings
          </h1>
          <p className="text-gray-600 mt-1">
            Prime evening placement when customers decide where to eat
          </p>
        </div>
        {!active && (
          <button
            onClick={() => setShowForm((p) => !p)}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 text-sm font-medium"
          >
            {showForm ? "Cancel" : "Create Promotion"}
          </button>
        )}
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

      {/* Active craving */}
      {active && (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-orange-600" />
            <h2 className="font-semibold text-orange-900">
              Active Tonight's Cravings
            </h2>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex gap-4">
              {active.image && (
                <img
                  src={active.image}
                  alt={active.headline}
                  className="w-24 h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {active.headline}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  CTA: "{active.cta}"
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      active.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {active.status === "active"
                      ? "✅ Live"
                      : "⏳ Pending Approval"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {daysLeft} days remaining
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Views</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {active.views ?? 0}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Clicks</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {active.clicks ?? 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          How Tonight's Cravings Works
        </h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
          <ul className="space-y-2">
            <li>• Featured prominently during evening hours</li>
            <li>• Catches customers during dinner decision time</li>
            <li>• Automatic scheduling — no daily management needed</li>
          </ul>
          <ul className="space-y-2">
            <li>• High-quality food image (1200×800px recommended)</li>
            <li>• Compelling headline (max 60 characters)</li>
            <li>• Call-to-action text (max 20 characters)</li>
          </ul>
        </div>
      </div>

      {/* Create form */}
      {showForm && !active && (
        <div className="bg-white rounded-xl border-2 border-orange-500 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Create Tonight's Cravings
            </h2>
            <button onClick={() => setShowForm(false)}>
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ✅ Image upload with real Cloudinary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Promotion Image *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {formData.imagePreview ? (
                  <div className="relative">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {/* ✅ uploading spinner overlay */}
                    {uploading && (
                      <div className="absolute inset-0 bg-white/70 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2" />
                          <p className="text-sm text-orange-600 font-medium">
                            Uploading...
                          </p>
                        </div>
                      </div>
                    )}
                    {/* ✅ uploaded confirmation */}
                    {!uploading && formData.image && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Uploaded
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          image: null,
                          imagePreview: null,
                        }))
                      }
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      Click to upload
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG up to 5MB (1200×800px recommended)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-3"
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
                onChange={(e) =>
                  setFormData((p) => ({ ...p, headline: e.target.value }))
                }
                placeholder="e.g., Authentic Italian Tonight!"
                maxLength={60}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.headline.length}/60
              </p>
            </div>

            {/* CTA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call to Action *
              </label>
              <input
                type="text"
                value={formData.cta}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, cta: e.target.value }))
                }
                placeholder="Order Now"
                maxLength={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.cta.length}/20
              </p>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Duration *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() =>
                      setFormData((p) => ({ ...p, duration: plan.id }))
                    }
                    className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                      formData.duration === plan.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-medium text-gray-900">{plan.name}</p>
                    <p className="text-xl font-bold text-orange-500">
                      ${plan.price}
                    </p>
                    {plan.savings && (
                      <p className="text-xs text-green-600 mt-1">
                        {plan.savings}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            {selectedPlan && formData.headline && formData.image && (
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-orange-500">
                    ${selectedPlan.price} USD
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
                  purchasing ||
                  uploading
                }
                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                {uploading
                  ? "Uploading image..."
                  : purchasing
                    ? "Submitting..."
                    : "Purchase & Submit"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">
          All Tonight's Cravings submissions require admin approval before going
          live.
        </p>
      </div>
    </div>
  );
};

export default DashboardTonightsCravings;
