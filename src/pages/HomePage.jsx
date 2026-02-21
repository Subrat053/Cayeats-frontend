import { Link } from "react-router-dom";
import { ArrowRight, Utensils, Truck, MapPin } from "lucide-react";
import { useAdminSettings } from "../context/AdminSettingsContext";
import { useAppData } from "../context/AppDataContext";
import SearchBar from "../components/layout/SearchBar";
import { RestaurantCard, CuisineCard } from "../components/restaurant";

const HomePage = () => {
  const { settings } = useAdminSettings();
  const {
    restaurants,
    cuisineCategories,
    deliveryProviders,
    loading,
    banners,
  } = useAppData();

  // ✅ real data - featured restaurants are those with isFeatured flag
  const featuredRestaurants = restaurants.filter((r) => r.isFeatured);
  const allRestaurants = [...restaurants].sort((a, b) =>
    (a.fullName || "").localeCompare(b.fullName || ""),
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {settings.showHeroSection && (
        <section className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-white rounded-full" />
            <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-white rounded-full" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Discover Island
                <span className="block text-orange-200">Dining Excellence</span>
              </h1>
              <p className="text-lg md:text-xl text-orange-100 mb-8">
                Find the best restaurants in the Cayman Islands and order from
                your favorite delivery providers — all in one place.
              </p>
              <div className="max-w-2xl mx-auto">
                <SearchBar
                  variant="hero"
                  placeholder="Search restaurants, cuisines..."
                  showFilters
                />
              </div>
              {/* Quick Stats - real counts */}
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mt-12">
                <div className="flex items-center gap-2 text-white">
                  <Utensils className="w-5 h-5 text-orange-200" />
                  <span className="font-semibold">
                    {restaurants.length}+ Restaurants
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <MapPin className="w-5 h-5 text-orange-200" />
                  <span className="font-semibold">
                    {cuisineCategories.length} Cuisines
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Truck className="w-5 h-5 text-orange-200" />
                  <span className="font-semibold">
                    {deliveryProviders.length} Delivery Partners
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 50L48 45.7C96 41 192 33 288 35.8C384 39 480 53 576 58.2C672 64 768 60 864 51.8C960 43 1056 31 1152 30.3C1248 29 1344 39 1392 43.8L1440 49V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
                fill="#F9FAFB"
              />
            </svg>
          </div>
        </section>
      )}

      {/* Top Banner */}
      {settings.showTopBanner && banners?.top?.active && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BannerAd banner={banners.top} />
        </section>
      )}

      {/* Cuisine Categories - real data */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Explore Cuisines
            </h2>
            <p className="text-gray-500 mt-1">
              Browse restaurants by cuisine type
            </p>
          </div>
          <Link
            to="/cuisines"
            className="flex items-center gap-1 text-orange-500 font-medium hover:text-orange-600 text-sm"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {cuisineCategories.slice(0, 6).map((cuisine) => (
            <Link
              key={cuisine.name}
              to={`/cuisines/${encodeURIComponent(cuisine.name)}`}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all text-center"
            >
              <span className="text-2xl">🍽️</span>
              <span className="text-sm font-medium text-gray-900">
                {cuisine.name}
              </span>
              <span className="text-xs text-gray-400">
                {cuisine.count} places
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Listings - real data */}
      {settings.showFeaturedListings && featuredRestaurants.length > 0 && (
        <section className="bg-gradient-to-b from-orange-50 to-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  ⭐ Featured Restaurants
                </h2>
                <p className="text-gray-500 mt-1">Sponsored listings</p>
              </div>
              <Link
                to="/restaurants?featured=true"
                className="flex items-center gap-1 text-orange-500 font-medium hover:text-orange-600 text-sm"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRestaurants.slice(0, 3).map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Middle Banner */}
      {settings.showMiddleBanner && banners?.middle?.active && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BannerAd banner={banners.middle} />
        </section>
      )}

      {/* All Restaurants A-Z - real data */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              All Restaurants
            </h2>
            <p className="text-gray-500 mt-1">Browse all restaurants A–Z</p>
          </div>
          <Link
            to="/restaurants"
            className="flex items-center gap-1 text-orange-500 font-medium hover:text-orange-600 text-sm"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {allRestaurants.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Utensils className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No restaurants yet</p>
            <p className="text-sm mt-1">
              Check back soon — restaurants are being added!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allRestaurants.slice(0, 8).map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </div>
            {allRestaurants.length > 8 && (
              <div className="text-center mt-8">
                <Link
                  to="/restaurants"
                  className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  View All {allRestaurants.length} Restaurants
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* Bottom Banner */}
      {settings.showBottomBanner && banners?.bottom?.active && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BannerAd banner={banners.bottom} />
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Own a Restaurant?
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Join CayEats and reach more customers. Get your restaurant
                listed and start receiving orders through our delivery partners.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link to="/partner">
                  <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                    Partner With Us
                  </button>
                </Link>
                <Link to="/register?type=restaurant">
                  <button className="border border-white/50 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
                    Claim Your Listing
                  </button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600"
                alt="Restaurant"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Banner Ad Component
const BannerAd = ({ banner }) => {
  if (!banner) return null;
  return (
    <Link
      to={banner.link || "#"}
      className="group block relative rounded-2xl overflow-hidden w-full"
    >
      <div
        className="relative w-full bg-gray-200"
        style={{ paddingBottom: "27.47%" }}
      >
        <img
          src={banner.image}
          alt={banner.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center p-4 md:p-8">
          <div>
            <h3 className="text-white text-lg md:text-2xl font-bold mb-1">
              {banner.title}
            </h3>
            <p className="text-gray-200 text-xs md:text-base">
              {banner.subtitle}
            </p>
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Ad
        </div>
      </div>
    </Link>
  );
};

export default HomePage;
