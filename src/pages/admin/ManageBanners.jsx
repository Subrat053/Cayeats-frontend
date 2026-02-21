import { useState, useEffect } from "react";
import {
  Check,
  X,
  Image,
  Eye,
  EyeOff,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  getPendingBanners,
  approveBanner,
  rejectBanner,
} from "../../api/adminService";

const ManageBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  const flash = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  useEffect(() => {
    getPendingBanners()
      .then((data) => setBanners(data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    await approveBanner(id);
    setBanners((prev) => prev.filter((b) => b._id !== id));
    flash("Banner approved and made active");
  };

  const handleReject = async (id) => {
    await rejectBanner(id, "Rejected by admin");
    setBanners((prev) => prev.filter((b) => b._id !== id));
    flash("Banner rejected");
  };

  const stats = {
    total: banners.length,
    pending: banners.filter((b) => b.status === "pending").length,
    active: banners.filter((b) => b.status === "active").length,
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
        <h1 className="text-2xl font-bold text-gray-900">Manage Banners</h1>
        <p className="text-gray-600 mt-1">
          Review and approve banner ad submissions from restaurants
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Total Submissions</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
      </div>

      {/* Banner list */}
      <div className="space-y-4">
        {banners.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              No pending banner submissions
            </p>
            <p className="text-sm text-gray-400 mt-1">
              When restaurants submit banner ads they will appear here for
              review
            </p>
          </div>
        ) : (
          banners.map((banner) => (
            <div
              key={banner._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image preview */}
                {banner.image ? (
                  <div className="w-full sm:w-64 h-36 shrink-0">
                    <img
                      src={banner.image}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full sm:w-64 h-36 shrink-0 bg-gray-100 flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-300" />
                  </div>
                )}

                {/* Details */}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">
                          {banner.restaurant?.fullName || "Unknown Restaurant"}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            banner.zone === "top"
                              ? "bg-purple-100 text-purple-700"
                              : banner.zone === "middle"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {banner.zone?.toUpperCase() || "N/A"} Zone
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">
                          {banner.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-3 text-sm text-gray-500">
                        <div>
                          Duration:{" "}
                          <span className="font-medium text-gray-700">
                            {banner.duration || "N/A"}
                          </span>
                        </div>
                        <div>
                          Submitted:{" "}
                          <span className="font-medium text-gray-700">
                            {new Date(banner.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {banner.startDate && (
                          <div>
                            Start:{" "}
                            <span className="font-medium text-gray-700">
                              {new Date(banner.startDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {banner.endDate && (
                          <div>
                            End:{" "}
                            <span className="font-medium text-gray-700">
                              {new Date(banner.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {banner.linkUrl && (
                        <a
                          href={banner.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline mt-2 inline-block"
                        >
                          🔗 {banner.linkUrl}
                        </a>
                      )}
                    </div>

                    {/* Actions */}
                    {banner.status === "pending" && (
                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() => handleApprove(banner._id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(banner._id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200"
                        >
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    )}

                    {banner.status === "active" && (
                      <span className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg font-medium shrink-0">
                        ✓ Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageBanners;
