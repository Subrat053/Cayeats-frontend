import { useState, useEffect } from "react";
import {
  Search,
  Check,
  X,
  Trash2,
  Eye,
  Filter,
  Shield,
  ShieldOff,
  Star,
} from "lucide-react";
import {
  getAllRestaurants,
  approveRestaurant,
  rejectRestaurant,
  deleteRestaurant,
  updateRestaurantSubscription,
} from "../../api/adminService";

const ManageRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [success, setSuccess] = useState(null);
  const [subModal, setSubModal] = useState(null); // restaurant for subscription edit

  const flash = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const load = () => {
    setLoading(true);
    getAllRestaurants()
      .then((res) => setRestaurants(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id) => {
    await approveRestaurant(id);
    setRestaurants((prev) =>
      prev.map((r) => (r._id === id ? { ...r, isApproved: true } : r)),
    );
    flash("Restaurant approved");
  };

  const handleReject = async (id) => {
    await rejectRestaurant(id);
    setRestaurants((prev) =>
      prev.map((r) =>
        r._id === id ? { ...r, isApproved: false, isVerified: false } : r,
      ),
    );
    flash("Restaurant rejected");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this restaurant?")) return;
    await deleteRestaurant(id);
    setRestaurants((prev) => prev.filter((r) => r._id !== id));
    flash("Restaurant deleted");
  };

  const handleSetSubscription = async (id, plan) => {
    await updateRestaurantSubscription(id, { plan });
    setRestaurants((prev) =>
      prev.map((r) =>
        r._id === id
          ? {
              ...r,
              isVerified: true,
              subscription: { ...r.subscription, plan },
            }
          : r,
      ),
    );
    setSubModal(null);
    flash(`${plan} plan assigned`);
  };

  const filtered = restaurants.filter((r) => {
    const matchSearch =
      r.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.owner?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "pending") return matchSearch && !r.isApproved;
    if (filter === "verified") return matchSearch && r.isVerified;
    if (filter === "approved") return matchSearch && r.isApproved;
    return matchSearch;
  });

  const stats = {
    total: restaurants.length,
    approved: restaurants.filter((r) => r.isApproved).length,
    pending: restaurants.filter((r) => !r.isApproved).length,
    verified: restaurants.filter((r) => r.isVerified).length,
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
        <h1 className="text-2xl font-bold text-gray-900">Manage Restaurants</h1>
        <p className="text-gray-600 mt-1">
          Approve, verify, and manage restaurant listings
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-gray-900" },
          { label: "Approved", value: stats.approved, color: "text-green-600" },
          { label: "Pending", value: stats.pending, color: "text-yellow-600" },
          { label: "Verified", value: stats.verified, color: "text-blue-600" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white p-4 rounded-xl border border-gray-200"
          >
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">All</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="verified">Verified</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Restaurant
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Owner
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Plan
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Stats
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No restaurants found
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {r.profileImage ? (
                          <img
                            src={r.profileImage}
                            className="w-10 h-10 rounded-lg object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                            {r.fullName?.[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {r.fullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {r.cuisineTypes?.join(", ")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <p>{r.owner?.fullName}</p>
                      <p className="text-xs text-gray-400">{r.owner?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSubModal(r)}
                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 rounded-full border border-gray-200 transition-colors"
                      >
                        {r.subscription?.plan || "No Plan"} ✎
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full w-fit font-medium ${r.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                        >
                          {r.isApproved ? "Approved" : "Pending"}
                        </span>
                        {r.isVerified && (
                          <span className="text-xs px-2 py-0.5 rounded-full w-fit font-medium bg-blue-100 text-blue-700">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <p>{r.viewCount || 0} views</p>
                      <p>
                        {r.deliveryProviders?.reduce(
                          (s, p) => s + (p.clickCount || 0),
                          0,
                        ) || 0}{" "}
                        clicks
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {!r.isApproved && (
                          <button
                            onClick={() => handleApprove(r._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {r.isApproved && (
                          <button
                            onClick={() => handleReject(r._id)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
          Showing {filtered.length} of {restaurants.length} restaurants
        </div>
      </div>

      {/* Subscription Modal */}
      {subModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-900 mb-1">
              Assign Subscription
            </h3>
            <p className="text-sm text-gray-500 mb-4">{subModal.fullName}</p>
            <div className="space-y-2">
              {["Silver", "Gold", "Platinum"].map((plan) => (
                <button
                  key={plan}
                  onClick={() => handleSetSubscription(subModal._id, plan)}
                  className={`w-full py-3 rounded-lg border-2 font-medium transition-colors ${
                    subModal.subscription?.plan === plan
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-200 hover:border-orange-300 text-gray-700"
                  }`}
                >
                  {plan} {subModal.subscription?.plan === plan && "✓ Current"}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSubModal(null)}
              className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRestaurants;
