import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Settings,
  Clock,
  LogOut,
  ChevronRight,
  Camera,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAppData } from "../context/AppDataContext";
import RestaurantCard from "../components/restaurant/RestaurantCard";

const UserProfilePage = () => {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { restaurants } = useAppData();
  const [activeTab, setActiveTab] = useState("favorites");

  // Match favorites against real restaurant data using _id
  const favoriteRestaurants = restaurants.filter(
    (r) => favorites.includes(r._id) || favorites.includes(r.id),
  );

  const tabs = [
    {
      id: "favorites",
      label: "Favorites",
      icon: Heart,
      count: favorites.length,
    },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const initials = (user?.name || user?.fullName || "U")
    .charAt(0)
    .toUpperCase();
  const displayName = user?.name || user?.fullName || "Guest User";
  const memberYear = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-orange-500 text-3xl font-bold shadow-lg">
                {initials}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md text-gray-500 hover:text-orange-500 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white">{displayName}</h1>
              <p className="text-orange-100 mt-1">
                {user?.email || "Sign in to save your favorites"}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-5 mt-3 flex-wrap">
                <span className="flex items-center gap-1.5 text-sm text-white/90 bg-white/10 px-3 py-1 rounded-full">
                  <Heart className="w-3.5 h-3.5" />
                  {favorites.length} Favorites
                </span>
                <span className="flex items-center gap-1.5 text-sm text-white/90 bg-white/10 px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  Member since {memberYear}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 border-b-2 transition-colors font-medium ${
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-500"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        activeTab === tab.id
                          ? "bg-orange-100 text-orange-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Favorites Tab ───────────────────────────── */}
        {activeTab === "favorites" &&
          (favoriteRestaurants.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant._id || restaurant.id}
                  restaurant={restaurant}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Start exploring restaurants and tap the heart icon to save your
                favorites for quick access later.
              </p>
              <Link
                to="/restaurants"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
              >
                Explore Restaurants <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}

        {/* ── Settings Tab ────────────────────────────── */}
        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-4">
            {/* Profile Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-5">
                Profile Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={displayName}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue={user?.phone || ""}
                    placeholder="+1 (345) 555-0123"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none"
                  />
                </div>
                <button className="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-5">Preferences</h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Email notifications for new restaurants",
                    defaultChecked: true,
                  },
                  {
                    label: "Email notifications for promotions",
                    defaultChecked: true,
                  },
                  {
                    label: "Show only open restaurants by default",
                    defaultChecked: false,
                  },
                ].map((pref) => (
                  <label
                    key={pref.label}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {pref.label}
                    </span>
                    <input
                      type="checkbox"
                      defaultChecked={pref.defaultChecked}
                      className="w-4 h-4 text-orange-500 rounded focus:ring-orange-400 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Account</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left">
                  <div>
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-500">
                      Update your account password
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-left"
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium text-red-600">Sign Out</p>
                    <p className="text-sm text-red-400">
                      Sign out of your account
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
