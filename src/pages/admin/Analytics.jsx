import { useState, useEffect } from "react";
import { TrendingUp, Eye, MousePointer, Store } from "lucide-react";
import { getAdminAnalytics, getAdminDashboard } from "../../api/adminService";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getAdminAnalytics(), getAdminDashboard()])
      .then(([a, s]) => {
        setAnalytics(a);
        setStats(s);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
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

  const providerEntries = Object.entries(analytics?.providerTotals || {});
  const totalProviderClicks = providerEntries.reduce((s, [, v]) => s + v, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-gray-600 mt-1">Real-time data from your MongoDB</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Views",
            value: stats?.totalViews?.toLocaleString() ?? 0,
            icon: Eye,
            bg: "bg-blue-50",
            color: "text-blue-600",
          },
          {
            label: "Total Clicks",
            value: stats?.totalClicks?.toLocaleString() ?? 0,
            icon: MousePointer,
            bg: "bg-orange-50",
            color: "text-orange-600",
          },
          {
            label: "Total Revenue",
            value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`,
            icon: TrendingUp,
            bg: "bg-green-50",
            color: "text-green-600",
          },
          {
            label: "Restaurants",
            value: stats?.totalRestaurants ?? 0,
            icon: Store,
            bg: "bg-purple-50",
            color: "text-purple-600",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{s.label}</span>
                <div className={`p-2 ${s.bg} rounded-lg`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top by Views */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">
              Top Restaurants by Views
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {analytics?.topByViews?.length === 0 ? (
              <p className="p-5 text-sm text-gray-400 text-center">
                No data yet
              </p>
            ) : (
              analytics?.topByViews?.map((r, i) => (
                <div
                  key={r.name}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="font-medium text-gray-900 text-sm">
                      {r.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {r.views.toLocaleString()} views
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top by Clicks */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">
              Top Restaurants by Delivery Clicks
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {analytics?.topByClicks?.length === 0 ? (
              <p className="p-5 text-sm text-gray-400 text-center">
                No data yet
              </p>
            ) : (
              analytics?.topByClicks?.map((r, i) => (
                <div
                  key={r.name}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="font-medium text-gray-900 text-sm">
                      {r.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {r.clicks.toLocaleString()} clicks
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Provider breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-5">
          Delivery Provider Breakdown
        </h2>
        {providerEntries.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No click data yet
          </p>
        ) : (
          <div className="space-y-4">
            {providerEntries
              .sort((a, b) => b[1] - a[1])
              .map(([name, clicks]) => {
                const pct =
                  totalProviderClicks > 0
                    ? Math.round((clicks / totalProviderClicks) * 100)
                    : 0;
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 text-sm">
                        {name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {clicks.toLocaleString()} clicks ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="h-2.5 bg-orange-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
