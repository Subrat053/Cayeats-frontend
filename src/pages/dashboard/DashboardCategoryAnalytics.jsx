import React, { useState, useEffect } from "react";
import { getCategoryAnalytics } from "../../api/categoryService";
import { getRestaurantProfile } from "../../api/restaurantService";

const CategoryAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState({
    loading: true,
    isApproved: true,
  });

  useEffect(() => {
    fetchAnalytics();
    getRestaurantProfile()
      .then((data) => {
        setApprovalStatus({
          loading: false,
          isApproved: data?.isApproved !== false,
        });
      })
      .catch(() => {
        setApprovalStatus({ loading: false, isApproved: true });
      });
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategoryAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load category analytics");
    } finally {
      setLoading(false);
    }
  };

  const totalViews = analytics.reduce((sum, cat) => sum + cat.viewCount, 0);
  const totalClicks = analytics.reduce((sum, cat) => sum + cat.clickCount, 0);
  const totalEngagement = analytics.reduce(
    (sum, cat) => sum + cat.engagement,
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            📊 Category Analytics
          </h1>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!approvalStatus.loading && !approvalStatus.isApproved && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 text-sm font-semibold uppercase">
            ⏳ WAITING FOR ADMIN APPROVAL.
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Views</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {totalViews.toLocaleString()}
                </p>
              </div>
              <div className="text-4xl">👁️</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Clicks
                </p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {totalClicks.toLocaleString()}
                </p>
              </div>
              <div className="text-4xl">🖱️</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Avg Engagement
                </p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {(totalEngagement / analytics.length || 0).toFixed(0)}%
                </p>
              </div>
              <div className="text-4xl">⚡</div>
            </div>
          </div>
        </div>

        {/* Analytics Table */}
        {analytics.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Items
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                      Views
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                      Clicks
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                      Engagement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Last Viewed
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analytics.map((category, index) => (
                    <tr
                      key={category._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {category.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              #{index + 1} by engagement
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {category.productCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-gray-900">
                          {category.viewCount.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-gray-900">
                          {category.clickCount.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all"
                              style={{
                                width: `${Math.min(category.engagement, 100)}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-700 min-w-12 text-right">
                            {category.engagement.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-left text-sm text-gray-600">
                        {category.lastViewedAt
                          ? new Date(category.lastViewedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : "Never"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-2xl text-gray-400 mb-4">📭</p>
            <p className="text-lg text-gray-600 font-medium">
              No categories yet
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Create categories to start tracking analytics
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            📊 How Analytics Work
          </h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>
              • <strong>Views:</strong> Number of times customers viewed your
              menu (each category view tracked)
            </li>
            <li>
              • <strong>Clicks:</strong> Number of times the "Add to Order"
              button was clicked for items in this category
            </li>
            <li>
              • <strong>Engagement:</strong> Combined view and click activity
              (higher = more popular category)
            </li>
            <li>
              • <strong>Last Viewed:</strong> When this category was last viewed
              by a customer
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryAnalytics;
