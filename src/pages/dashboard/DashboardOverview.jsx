import { useEffect, useState } from "react";
import {
  getDashboardData,
  uploadImage,
  updateRestaurantProfile,
} from "../../api/restaurantService.js";
import { useNavigate } from "react-router-dom";

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardData()
      .then((response) => {
        // ✅ unwrap — backend returns { success: true, data: restaurant }
        const data = response?.data || response;
        console.log("Dashboard data:", data);
        setStats(data);
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
        setError(err?.message || "Failed to load dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const url = await uploadImage(file);
      await updateRestaurantProfile({ profileImage: url });
      setStats((prev) => ({ ...prev, profileImage: url }));
    } catch (err) {
      setError("Image upload failed: " + err.message);
    } finally {
      setUploadingImg(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          Error: {error}
        </div>
      </div>
    );

  if (!stats)
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-600">
          No dashboard data available
        </div>
      </div>
    );

  // ✅ support both field names from restaurant model
  const profileImage = stats?.profileImage || stats?.image || null;

  return (
    <div className="p-6 space-y-6">
      {/* Subscription Banner */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex justify-between items-center">
        <div>
          <h2 className="font-bold text-gray-800">
            {stats?.isVerified
              ? "✓ Verified Restaurant"
              : "⏳ Pending Verification"}
          </h2>
          <p className="text-sm text-gray-600">
            {stats?.subscription?.plan || "No plan"} subscription
          </p>
          {stats?.subscription?.expiresAt ? (
            <p className="text-xs text-orange-600 mt-1">
              Expires:{" "}
              {new Date(stats.subscription.expiresAt).toLocaleDateString()}
            </p>
          ) : (
            <p className="text-xs text-orange-600 mt-1">No subscription data</p>
          )}
        </div>
        <button
          onClick={() => navigate("/dashboard/billing")}
          className="border border-orange-500 text-orange-500 px-4 py-1 rounded-md text-sm hover:bg-orange-50"
        >
          Renew Now
        </button>
      </div>

      {/* Restaurant Profile Card */}
      <div className="bg-orange-600 rounded-xl p-6 text-white flex justify-between items-center">
        <div className="flex gap-4 items-center">
          {/* Clickable profile image */}
          <div
            className="w-20 h-20 bg-white/20 rounded-lg overflow-hidden relative group cursor-pointer shrink-0 border-2 border-white/30"
            onClick={() => document.getElementById("profileImageInput").click()}
            title="Click to change photo"
          >
            {uploadingImg ? (
              <div className="w-full h-full flex items-center justify-center bg-black/40">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
              </div>
            ) : profileImage ? (
              <img
                src={profileImage}
                alt="Restaurant"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/80 text-xs text-center px-1 gap-1">
                <span className="text-2xl">📷</span>
                <span>Add Photo</span>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium">📷 Change</span>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            id="profileImageInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          <div>
            <h1 className="text-2xl font-bold">
              {stats?.fullName || "Your Restaurant"}
            </h1>
            <p className="opacity-90">{stats?.address || "Address not set"}</p>
            <p className="mt-2 text-sm">
              ⭐ {stats?.rating ?? 0} ({stats?.reviewCount ?? 0} reviews)
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard/profile")}
          className="bg-white text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100"
        >
          Edit Profile
        </button>
      </div>

      {/* Stale Hours Warning */}
      {stats?.staleHours && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 text-sm text-yellow-700">
          ⚠️ Your operating hours haven't been updated in 90 days.
          <button
            onClick={() => navigate("/dashboard/profile")}
            className="ml-4 font-bold underline"
          >
            Update Hours
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {stats?.totalOrders ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            ${stats?.totalRevenue ? stats.totalRevenue.toFixed(2) : "0.00"}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {stats?.totalProducts ?? 0}
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      {stats?.recentOrders && stats.recentOrders.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Orders
          </h2>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-sm text-gray-600">
                  Order #{order._id?.slice(-6)}
                </span>
                <span className="text-sm font-medium">
                  ${order.totalAmount?.toFixed(2) || "0.00"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
