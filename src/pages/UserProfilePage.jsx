import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, Settings, MapPin, Phone, Mail, Edit, Camera, ChevronRight, Star, Clock, LogOut } from 'lucide-react';
import { MainLayout } from '../components/layout';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { restaurants } from '../data/mockData';
import RestaurantCard from '../components/restaurant/RestaurantCard';

const UserProfilePage = () => {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState('favorites');

  // Get favorite restaurants
  const favoriteRestaurants = restaurants.filter(r => favorites.includes(r.id));

  const tabs = [
    { id: 'favorites', label: 'Favorites', icon: Heart, count: favorites.length },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary text-3xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg text-gray-600 hover:text-primary transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold">{user?.name || 'Guest User'}</h1>
              <p className="text-white/80 mt-1">{user?.email || 'Sign in to save your favorites'}</p>
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3">
                <span className="flex items-center gap-1 text-sm">
                  <Heart className="w-4 h-4" />
                  {favorites.length} Favorites
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Clock className="w-4 h-4" />
                  Member since Jan 2024
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div>
            {favoriteRestaurants.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900">No favorites yet</h3>
                <p className="text-gray-600 mt-2 max-w-md mx-auto">
                  Start exploring restaurants and tap the heart icon to save your favorites for quick access later.
                </p>
                <Link
                  to="/restaurants"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Explore Restaurants
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
              {/* Profile Settings */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+1 (345) 555-0123"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
                <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  Save Changes
                </button>
              </div>

              {/* Preferences */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Preferences</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Email notifications for new restaurants</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded focus:ring-primary" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Email notifications for promotions</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded focus:ring-primary" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Show only open restaurants by default</span>
                    <input type="checkbox" className="w-4 h-4 text-primary rounded focus:ring-primary" />
                  </label>
                </div>
              </div>

              {/* Account Actions */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Account</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                    <div>
                      <p className="font-medium text-gray-900">Change Password</p>
                      <p className="text-sm text-gray-500">Update your account password</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-600">Sign Out</p>
                        <p className="text-sm text-red-500">Sign out of your account</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
