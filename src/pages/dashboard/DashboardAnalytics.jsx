import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  ExternalLink,
  Users,
  Clock,
  Download,
  Star,
  ArrowRight,
} from "lucide-react";
import {
  getRestaurantStats,
  getDeliveryClicks,
} from "../../api/restaurantService";

const DashboardAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [clicks, setClicks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("30d");

  useEffect(() => {
    Promise.all([getRestaurantStats(), getDeliveryClicks()])
      .then(([s, c]) => {
        setStats(s?.data || s);
        setClicks(c?.data || c);
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
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-600">
        ❌ {error}
      </div>
    );

  // ── Real data ──────────────────────────────────────────
  const totalViews = stats?.viewCount || 0;
  const totalClicks = stats?.totalClicks || 0;
  const avgRating = stats?.avgRating || 0;
  const reviewCount = stats?.reviewCount || 0;

  // Delivery provider breakdown from real click data
  const providers = clicks?.providers || [];
  const totalProviderClicks = providers.reduce(
    (s, p) => s + (p.clickCount || 0),
    0,
  );

  // Build delivery stats with percentages
  const deliveryStats = providers.map((p, i) => {
    const pct =
      totalProviderClicks > 0
        ? Math.round((p.clickCount / totalProviderClicks) * 100)
        : 0;
    const colors = ["#ff6b35", "#22c55e", "#3b82f6", "#a855f7", "#f59e0b"];
    return {
      provider: p.providerName,
      clicks: p.clickCount || 0,
      percentage: pct,
      color: colors[i % colors.length],
    };
  });

  // ── Overview cards ─────────────────────────────────────
  const overviewCards = [
    {
      title: "Profile Views",
      value: totalViews,
      icon: Eye,
      trend: totalViews > 0 ? "up" : "neutral",
      sub: "Total all-time views",
    },
    {
      title: "Delivery Clicks",
      value: totalProviderClicks,
      icon: ExternalLink,
      trend: totalProviderClicks > 0 ? "up" : "neutral",
      sub: "Clicks to delivery partners",
    },
    {
      title: "Reviews",
      value: reviewCount,
      icon: Users,
      trend: reviewCount > 0 ? "up" : "neutral",
      sub: "Customer reviews received",
    },
    {
      title: "Avg. Rating",
      value: avgRating ? avgRating.toFixed(1) : "—",
      icon: Star,
      trend: avgRating >= 4 ? "up" : avgRating > 0 ? "neutral" : "neutral",
      sub: "Out of 5 stars",
    },
  ];

  const StatCard = ({ title, value, icon: Icon, trend, sub }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <div className="p-2 bg-orange-50 rounded-lg">
          <Icon className="w-5 h-5 text-orange-500" />
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">{sub}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">
            Track your restaurant's performance on CayEats
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
            {["7d", "30d", "90d"].map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  dateRange === r
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Delivery Provider Clicks */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-6">
          Delivery Provider Clicks
        </h3>
        {deliveryStats.length === 0 ? (
          <div className="text-center py-12">
            <ExternalLink className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 font-medium">No delivery clicks yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Clicks will appear here when customers click your delivery
              provider links
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {deliveryStats
                .sort((a, b) => b.clicks - a.clicks)
                .map((provider) => (
                  <div key={provider.provider}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: provider.color }}
                        />
                        <span className="font-medium text-gray-900">
                          {provider.provider}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {provider.clicks} clicks ({provider.percentage}%)
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${provider.percentage}%`,
                          backgroundColor: provider.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Total clicks to delivery providers:{" "}
                <span className="font-semibold text-gray-900">
                  {totalProviderClicks}
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                These clicks redirect customers to order from your delivery
                services
              </p>
            </div>
          </>
        )}
      </div>

      {/* Profile Views Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Profile Performance
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <p className="text-3xl font-bold text-orange-600">
              {totalViews.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Profile Views</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <p className="text-3xl font-bold text-blue-600">
              {totalProviderClicks.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Delivery Clicks</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-3xl font-bold text-green-600">
              {totalViews > 0
                ? `${Math.round((totalProviderClicks / totalViews) * 100)}%`
                : "0%"}
            </p>
            <p className="text-sm text-gray-600 mt-1">Click-Through Rate</p>
          </div>
        </div>
      </div>

      {/* Empty state insight or real insight */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shrink-0">
            <Star className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Performance Insights
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {totalViews === 0 ? (
                <>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                    <span>
                      Your restaurant is live — views will appear here as
                      customers discover you.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                    <span>
                      Add your delivery provider links so customers can order
                      directly from your profile.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                    <span>
                      Consider a Featured Listing to boost your visibility on
                      the homepage.
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>
                      Your profile has received <strong>{totalViews}</strong>{" "}
                      views — keep your menu updated to convert visitors.
                    </span>
                  </li>
                  {totalProviderClicks > 0 && (
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>
                        <strong>{totalProviderClicks}</strong> customers clicked
                        your delivery links — great engagement!
                      </span>
                    </li>
                  )}
                  {totalViews > 0 && totalProviderClicks === 0 && (
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                      <span>
                        You have views but no delivery clicks — make sure your
                        delivery provider links are set up in your profile.
                      </span>
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
