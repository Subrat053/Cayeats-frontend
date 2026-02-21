import { useState, useEffect } from "react";
import { Check, X, Image, Clock, Store, AlertCircle } from "lucide-react";
import {
  getPendingCravings,
  approveCraving,
  rejectCraving,
  getPendingBanners,
  approveBanner,
  rejectBanner,
} from "../../api/adminService";

const AdminMarketing = () => {
  const [tab, setTab] = useState("cravings");
  const [cravings, setCravings] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const flash = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  useEffect(() => {
    Promise.all([getPendingCravings(), getPendingBanners()])
      .then(([c, b]) => {
        setCravings(c || []);
        setBanners(b || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleApproveCraving = async (id) => {
    await approveCraving(id);
    setCravings((prev) => prev.filter((c) => c._id !== id));
    flash("Craving approved and made active");
  };

  const handleRejectCraving = async (id) => {
    await rejectCraving(id);
    setCravings((prev) => prev.filter((c) => c._id !== id));
    flash("Craving rejected");
  };

  const handleApproveBanner = async (id) => {
    await approveBanner(id);
    setBanners((prev) => prev.filter((b) => b._id !== id));
    flash("Banner approved and made active");
  };

  const handleRejectBanner = async (id) => {
    await rejectBanner(id, "Rejected by admin");
    setBanners((prev) => prev.filter((b) => b._id !== id));
    flash("Banner rejected");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Marketing Approvals
        </h1>
        <p className="text-gray-600 mt-1">
          Approve or reject Tonight's Cravings and Banner Ad submissions
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

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Cravings</p>
              <p className="text-2xl font-bold text-orange-600">
                {cravings.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Image className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Banners</p>
              <p className="text-2xl font-bold text-blue-600">
                {banners.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          {[
            {
              id: "cravings",
              label: `Tonight's Cravings (${cravings.length})`,
            },
            { id: "banners", label: `Banner Ads (${banners.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`py-3 border-b-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cravings Tab */}
      {tab === "cravings" && (
        <div className="space-y-4">
          {cravings.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No pending cravings</p>
              <p className="text-sm text-gray-400 mt-1">
                All submissions have been reviewed
              </p>
            </div>
          ) : (
            cravings.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {c.image && (
                    <img
                      src={c.image}
                      alt="Craving"
                      className="w-full sm:w-48 h-32 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {c.headline || "No headline"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          <Store className="w-3 h-3 inline mr-1" />
                          {c.restaurant?.fullName || "Unknown restaurant"}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>
                            Duration: <strong>{c.duration}</strong>
                          </span>
                          <span>
                            Submitted:{" "}
                            <strong>
                              {new Date(c.createdAt).toLocaleDateString()}
                            </strong>
                          </span>
                          {c.startDate && (
                            <span>
                              Starts:{" "}
                              <strong>
                                {new Date(c.startDate).toLocaleDateString()}
                              </strong>
                            </span>
                          )}
                        </div>
                        {c.description && (
                          <p className="text-sm text-gray-600 mt-2">
                            {c.description}
                          </p>
                        )}
                        {c.cta && (
                          <p className="text-xs text-orange-600 mt-1">
                            CTA: {c.cta}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() => handleApproveCraving(c._id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => handleRejectCraving(c._id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200"
                        >
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Banners Tab */}
      {tab === "banners" && (
        <div className="space-y-4">
          {banners.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No pending banners</p>
              <p className="text-sm text-gray-400 mt-1">
                All submissions have been reviewed
              </p>
            </div>
          ) : (
            banners.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {b.image && (
                    <img
                      src={b.image}
                      alt="Banner"
                      className="w-full sm:w-64 h-24 object-cover rounded-lg border border-gray-200"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {b.restaurant?.fullName || "Unknown"}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              b.zone === "top"
                                ? "bg-purple-100 text-purple-700"
                                : b.zone === "middle"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {b.zone?.toUpperCase()} banner
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>
                            Duration: <strong>{b.duration}</strong>
                          </span>
                          <span>
                            Submitted:{" "}
                            <strong>
                              {new Date(b.createdAt).toLocaleDateString()}
                            </strong>
                          </span>
                        </div>
                        {b.linkUrl && (
                          <p className="text-xs text-blue-500 mt-1">
                            Link: {b.linkUrl}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() => handleApproveBanner(b._id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => handleRejectBanner(b._id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200"
                        >
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminMarketing;
