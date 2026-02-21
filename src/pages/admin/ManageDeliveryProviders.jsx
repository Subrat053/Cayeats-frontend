import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Truck,
  TrendingUp,
  ExternalLink,
  DollarSign,
  X,
  Check,
  ArrowUpDown,
} from "lucide-react";
import { getDeliveryProviders } from "../../api/adminService";

const PROVIDER_COLORS = {
  Bento: "#f97316",
  "Lets Eat": "#22c55e",
};

const getColor = (name) => PROVIDER_COLORS[name] || "#6366f1";

const ManageDeliveryProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  // New provider form state
  const [form, setForm] = useState({
    name: "",
    website: "",
    contactEmail: "",
    contactPhone: "",
    commission: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const flash = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  useEffect(() => {
    getDeliveryProviders()
      .then((data) => setProviders(data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = providers.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const stats = {
    total: providers.length,
    totalClicks: providers.reduce((s, p) => s + (p.totalClicks || 0), 0),
    restaurants: providers.reduce((s, p) => s + (p.restaurants || 0), 0),
  };

  const handleAddProvider = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      // For now adds to local list — wire to backend when provider model is added
      const newProvider = {
        name: form.name,
        website: form.website,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        commission: parseFloat(form.commission) || 0,
        totalClicks: 0,
        restaurants: 0,
        isNew: true,
      };
      setProviders((prev) => [...prev, newProvider]);
      setForm({
        name: "",
        website: "",
        contactEmail: "",
        contactPhone: "",
        commission: "",
        notes: "",
      });
      setShowModal(false);
      flash(`${form.name} added as a delivery provider`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Delivery Providers
          </h1>
          <p className="text-gray-600 mt-1">
            Manage delivery partners and platform-wide routing
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Provider
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Truck className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Providers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ExternalLink className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalClicks.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Restaurants Using</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.restaurants}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ArrowUpDown className="w-4 h-4" />
            {filtered.length} providers
          </div>
        </div>
      </div>

      {/* Provider list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              No delivery providers found
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Providers appear here when restaurants add delivery links to their
              profiles
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
            >
              Add First Provider
            </button>
          </div>
        ) : (
          filtered.map((provider, index) => {
            const color = getColor(provider.name);
            const totalPlatformClicks = stats.totalClicks || 1;
            const percentage = Math.round(
              (provider.totalClicks / totalPlatformClicks) * 100,
            );

            return (
              <div
                key={provider.name + index}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  {/* Icon + name */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {provider.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {provider.name}
                        </h3>
                        {provider.isNew && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      {provider.website && (
                        <a
                          href={provider.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <ExternalLink className="w-3 h-3" />{" "}
                          {provider.website}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {provider.totalClicks.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">Total Clicks</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {provider.restaurants}
                      </p>
                      <p className="text-xs text-gray-500">Restaurants</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-orange-600">
                        {percentage}%
                      </p>
                      <p className="text-xs text-gray-500">Platform Share</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full lg:w-48 shrink-0">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Click share</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                    {provider.contactEmail && (
                      <p className="text-xs text-gray-400 mt-2">
                        {provider.contactEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-medium text-blue-900 text-sm">
          About Provider Tracking
        </h3>
        <p className="text-sm text-blue-700 mt-1">
          Providers are automatically tracked when restaurants add delivery
          links to their profiles. Click counts update in real-time when
          customers click delivery buttons on restaurant pages. CayEats does not
          process orders — all clicks route to the provider's external platform.
        </p>
      </div>

      {/* Add Provider Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                Add Delivery Provider
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddProvider} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Bento, Lets Eat"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) =>
                    setForm({ ...form, website: e.target.value })
                  }
                  placeholder="https://bento.ky"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) =>
                      setForm({ ...form, contactEmail: e.target.value })
                    }
                    placeholder="partner@bento.ky"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={form.contactPhone}
                    onChange={(e) =>
                      setForm({ ...form, contactPhone: e.target.value })
                    }
                    placeholder="+1 345 555 0100"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission %
                </label>
                <input
                  type="number"
                  value={form.commission}
                  onChange={(e) =>
                    setForm({ ...form, commission: e.target.value })
                  }
                  placeholder="15"
                  min="0"
                  max="100"
                  step="0.5"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any additional notes..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !form.name.trim()}
                  className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {saving ? "Adding..." : "Add Provider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDeliveryProviders;
