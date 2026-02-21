import { useState, useEffect } from "react";
import {
  Save,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Camera,
  X,
  Plus,
} from "lucide-react";
import {
  getRestaurantProfile,
  updateRestaurantProfile,
} from "../../api/restaurantService";
import { cuisineCategories } from "../../data/mockData";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DashboardProfile = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // ✅ Load real data from backend
  useEffect(() => {
    getRestaurantProfile()
      .then((data) => {
        setFormData({
          fullName: data.fullName || "",
          address: data.address || "",
          cuisineTypes: data.cuisineTypes || [],
          phone: data.phone || "",
          email: data.email || "",
          website: data.website || "",
          instagram: data.instagram || "",
          openingHours: data.openingHours || {},
          // ✅ NO delivery URLs - admin only per spec
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleHoursChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: { ...prev.openingHours[day], [field]: value },
      },
    }));
    setHasChanges(true);
  };

  // ✅ Real save to backend
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await updateRestaurantProfile(formData);
      setHasChanges(false);
      setSuccessMsg("Profile saved successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );

  if (error && !formData)
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      </div>
    );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Restaurant Profile
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your restaurant's information
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
            hasChanges
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Success / Error messages */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm">
          ✅ {successMsg}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Basic Information
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine Type
            </label>
            <select
              value={formData.cuisineTypes[0] || ""}
              onChange={(e) => handleChange("cuisineTypes", [e.target.value])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
            >
              <option value="">Select cuisine</option>
              {cuisineCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contact & Location */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Contact & Location
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" /> Street Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" /> Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" /> Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="w-4 h-4 inline mr-1" /> Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Instagram className="w-4 h-4 inline mr-1" /> Instagram Handle
            </label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => handleChange("instagram", e.target.value)}
              placeholder="@yourrestaurant"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Operating Hours
        </h2>
        <div className="space-y-4">
          {DAYS.map((day) => (
            <div key={day} className="flex items-center gap-4">
              <div className="w-28">
                <span className="font-medium text-gray-900 capitalize">
                  {day}
                </span>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!formData.openingHours[day]?.closed}
                  onChange={() =>
                    handleHoursChange(
                      day,
                      "closed",
                      !formData.openingHours[day]?.closed,
                    )
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-600">Open</span>
              </label>
              {!formData.openingHours[day]?.closed ? (
                <>
                  <input
                    type="time"
                    value={formData.openingHours[day]?.open || "09:00"}
                    onChange={(e) =>
                      handleHoursChange(day, "open", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={formData.openingHours[day]?.close || "21:00"}
                    onChange={(e) =>
                      handleHoursChange(day, "close", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </>
              ) : (
                <span className="text-gray-400 italic">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Delivery URLs removed - ADMIN ONLY per CayEats spec */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Delivery Provider Links
        </h2>
        <p className="text-sm text-gray-500">
          🔒 Delivery provider URLs are managed by the CayEats admin team.
          Contact support if your delivery links need to be updated.
        </p>
      </div>
    </div>
  );
};

export default DashboardProfile;
