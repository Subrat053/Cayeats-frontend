import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  Truck,
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowUpRight,
  CheckCircle,
  MousePointer,
  Eye,
} from "lucide-react";
import { getAdminDashboard } from "../../api/adminService";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAdminDashboard()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );

  if (error)
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          ❌ {error}
        </div>
      </div>
    );

  const stats = [
    {
      name: "Total Restaurants",
      value: data?.totalRestaurants ?? 0,
      icon: Store,
      href: "/admin/restaurants",
      bg: "bg-orange-50",
      color: "text-orange-500",
    },
    {
      name: "Total Clicks",
      value: data?.totalClicks?.toLocaleString() ?? 0,
      icon: MousePointer,
      href: "/admin/analytics",
      bg: "bg-blue-50",
      color: "text-blue-500",
    },
    {
      name: "Total Revenue",
      value: `$${(data?.totalRevenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
      href: "/admin/analytics",
      bg: "bg-green-50",
      color: "text-green-500",
    },
    {
      name: "Profile Views",
      value: data?.totalViews?.toLocaleString() ?? 0,
      icon: Eye,
      href: "/admin/analytics",
      bg: "bg-purple-50",
      color: "text-purple-500",
    },
  ];

  const pendingItems = [
    {
      type: "Restaurant Approvals",
      count: data?.pendingApprovals?.restaurants ?? 0,
      href: "/admin/restaurants",
    },
    {
      type: "Tonight's Cravings",
      count: data?.pendingApprovals?.cravings ?? 0,
      href: "/admin/marketing",
    },
    {
      type: "Banner Ads",
      count: data?.pendingApprovals?.banners ?? 0,
      href: "/admin/banners",
    },
  ];

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here's what's happening with CayEats.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.href}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 ${stat.bg} rounded-lg`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <ArrowUpRight className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-400">View details</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <h2 className="font-semibold text-gray-900">Pending Approvals</h2>
          </div>
          <div className="space-y-3">
            {pendingItems.map((item) => (
              <Link
                key={item.type}
                to={item.href}
                className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  {item.type}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    item.count > 0
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.count > 0 ? `${item.count} pending` : "All clear"}
                </span>
              </Link>
            ))}
          </div>
          <Link
            to="/admin/restaurants"
            className="block text-center mt-4 text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            View All Approvals →
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-orange-500" />
            <h2 className="font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                label: "Manage Restaurants",
                href: "/admin/restaurants",
                icon: Store,
              },
              {
                label: "Marketing Approvals",
                href: "/admin/marketing",
                icon: TrendingUp,
              },
              {
                label: "Banner Ads",
                href: "/admin/banners",
                icon: AlertCircle,
              },
              {
                label: "Pricing Settings",
                href: "/admin/pricing",
                icon: DollarSign,
              },
              { label: "User Management", href: "/admin/users", icon: Truck },
              { label: "Analytics", href: "/admin/analytics", icon: Eye },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.href}
                  className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-orange-50 rounded-lg transition-colors group"
                >
                  <Icon className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  <span className="text-xs font-medium text-gray-600 group-hover:text-orange-600 text-center">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Active Subscriptions</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {data?.activeSubscriptions ?? 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">Verified restaurants</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Pending Restaurants</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">
            {data?.pendingRestaurants ?? 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">Awaiting approval</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {data?.totalUsers ?? 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">Registered customers</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
