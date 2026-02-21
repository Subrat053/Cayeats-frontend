import { useState, useEffect } from "react";
import {
  Star,
  TrendingUp,
  Calendar,
  CreditCard,
  CheckCircle,
  Info,
  XCircle,
} from "lucide-react";
import {
  getAdsPricing,
  getFeaturedListingStatus,
  purchaseFeaturedListing,
  cancelFeaturedListing,
} from "../../api/restaurantService";

const DashboardFeaturedListings = () => {
  const [pricing, setPricing] = useState(null);
  const [listings, setListings] = useState([]); // ✅ array now
  const [selectedDuration, setDuration] = useState("30days");
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [cancelling, setCancelling] = useState(null); // listingId being cancelled
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPurchase, setShowPurchase] = useState(false); // ✅ toggle purchase form

  useEffect(() => {
    Promise.all([getAdsPricing(), getFeaturedListingStatus()])
      .then(([p, data]) => {
        setPricing(p);
        // ✅ handle both array and single object response
        setListings(Array.isArray(data) ? data : data ? [data] : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handlePurchase = async () => {
    setPurchasing(true);
    setError(null);
    try {
      const result = await purchaseFeaturedListing(selectedDuration);
      setSuccess("Featured listing activated!");
      setListings((prev) => [result.data, ...prev]);
      setShowPurchase(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setPurchasing(false);
    }
  };

  const handleCancel = async (listingId) => {
    if (
      !confirm(
        "Cancel this featured listing? It will be deactivated immediately.",
      )
    )
      return;
    setCancelling(listingId);
    setError(null);
    try {
      await cancelFeaturedListing(listingId);
      setSuccess("Listing cancelled.");
      setListings((prev) =>
        prev.map((l) =>
          l._id === listingId ? { ...l, status: "inactive" } : l,
        ),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );

  const plans = pricing
    ? [
        {
          id: "30days",
          name: "30 Days",
          price: pricing.featuredListing["30days"],
        },
        {
          id: "90days",
          name: "90 Days",
          price: pricing.featuredListing["90days"],
          popular: true,
        },
        {
          id: "1year",
          name: "1 Year",
          price: pricing.featuredListing["1year"],
        },
      ]
    : [];

  const selectedPlan = plans.find((p) => p.id === selectedDuration);
  const activeListings = listings.filter((l) => l.status === "active");

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Featured Listing Placement
          </h1>
          <p className="text-gray-600 mt-1">
            Get premium placement at the top of restaurant listings
          </p>
        </div>
        {/* ✅ Always show Add button */}
        <button
          onClick={() => setShowPurchase((p) => !p)}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 text-sm font-medium"
        >
          <Star className="w-4 h-4" />
          {showPurchase ? "Cancel" : "Add Listing"}
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

      {/* ✅ Active listings list - with cancel button on each */}
      {listings.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Your Featured Listings
          </h2>
          <div className="space-y-3">
            {listings.map((listing) => {
              const daysLeft = listing.endDate
                ? Math.ceil(
                    (new Date(listing.endDate) - new Date()) /
                      (1000 * 60 * 60 * 24),
                  )
                : 0;
              const isActive = listing.status === "active";

              return (
                <div
                  key={listing._id}
                  className={`border rounded-lg p-4 flex items-center justify-between ${
                    isActive
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isActive ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 capitalize">
                          {listing.duration} listing
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {isActive ? "Active" : listing.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Expires{" "}
                          {new Date(listing.endDate).toLocaleDateString()}
                        </span>
                        {isActive && (
                          <span className="text-orange-600 font-medium">
                            {daysLeft} days left
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ✅ Cancel button - only on active listings */}
                  {isActive && (
                    <button
                      onClick={() => handleCancel(listing._id)}
                      disabled={cancelling === listing._id}
                      className="flex items-center gap-1 text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      {cancelling === listing._id ? "Cancelling..." : "Cancel"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          How Featured Listing Works
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-green-500 mt-0.5" />
              Top position in ALL Restaurants list
            </li>
            <li className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-green-500 mt-0.5" />
              Top position in your cuisine category page
            </li>
            <li className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-green-500 mt-0.5" />
              Featured across multiple categories if applicable
            </li>
          </ul>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
              Premium positioning and visibility
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
              Increased profile views and engagement
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
              Real-time analytics tracking
            </li>
          </ul>
        </div>
      </div>

      {/* ✅ Purchase form - toggled by Add Listing button */}
      {showPurchase && (
        <div className="bg-white rounded-xl border-2 border-orange-500 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {activeListings.length > 0
              ? "Add Another Featured Listing"
              : "Purchase Featured Listing"}
          </h2>

          {activeListings.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
              ℹ️ You already have {activeListings.length} active listing
              {activeListings.length > 1 ? "s" : ""}. Adding another will stack
              on top — your restaurant stays featured longer.
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setDuration(plan.id)}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                  selectedDuration === plan.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  </div>
                )}
                <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500"> USD</span>
                </div>
              </div>
            ))}
          </div>

          {selectedPlan && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Placement</span>
                  <span className="font-medium">All Categories</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-orange-500">
                    ${selectedPlan.price} USD
                  </span>
                </div>
              </div>
              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
              >
                <CreditCard className="w-5 h-5" />
                {purchasing ? "Processing..." : "Purchase Featured Listing"}
              </button>
              <p className="text-center text-sm text-gray-500 mt-3">
                Starts immediately after payment
              </p>
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Featured listing prices are set and controlled by CayEats
          administration.
        </p>
      </div>
    </div>
  );
};

export default DashboardFeaturedListings;
