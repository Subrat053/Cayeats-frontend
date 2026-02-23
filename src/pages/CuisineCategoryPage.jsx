import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import {
  fetchRestaurants,
  fetchCuisineCategories,
} from "../api/browseServices";
import { RestaurantCard } from "../components/restaurant";

const CUISINE_ICONS = {
  caribbean: "🌴",
  american: "🍔",
  italian: "🍕",
  asian: "🍜",
  mexican: "🌮",
  seafood: "🦞",
  indian: "🍛",
  "sushi & japanese": "🍣",
  sushi: "🍣",
  japanese: "🍣",
  breakfast: "🥞",
  desserts: "🍰",
  healthy: "🥗",
  "fast food": "🍟",
  chinese: "🥡",
  mediterranean: "🫒",
  thai: "🍲",
  french: "🥐",
  pizza: "🍕",
  burgers: "🍔",
  vegan: "🌱",
  bbq: "🍖",
  steakhouse: "🥩",
};

const CUISINE_GRADIENTS = {
  caribbean: "from-green-500 to-teal-600",
  american: "from-red-500 to-red-700",
  italian: "from-green-600 to-red-600",
  asian: "from-red-500 to-orange-600",
  mexican: "from-yellow-500 to-orange-600",
  seafood: "from-blue-500 to-teal-600",
  indian: "from-orange-500 to-red-600",
  sushi: "from-pink-500 to-red-500",
  breakfast: "from-yellow-400 to-orange-500",
  desserts: "from-pink-400 to-purple-500",
  healthy: "from-green-400 to-emerald-600",
  "fast food": "from-yellow-500 to-red-500",
};

const CuisineCategoryPage = () => {
  const { categoryId } = useParams();
  const [restaurants, setRestaurants] = useState([]);
  const [allCuisines, setAllCuisines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cuisineName = decodeURIComponent(categoryId);
  const displayName = cuisineName
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const icon = CUISINE_ICONS[cuisineName.toLowerCase()] || "🍽️";
  const gradient =
    CUISINE_GRADIENTS[cuisineName.toLowerCase()] ||
    "from-orange-500 to-orange-700";

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchRestaurants({ cuisine: displayName }),
      fetchCuisineCategories(),
    ])
      .then(([rests, cuisines]) => {
        setRestaurants(
          rests.sort((a, b) => {
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return (a.fullName || "").localeCompare(b.fullName || "");
          }),
        );
        setAllCuisines(cuisines);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryId]);

  const currentIndex = allCuisines.findIndex(
    (c) => (c.name || c).toLowerCase() === cuisineName.toLowerCase(),
  );
  const prevCuisine = allCuisines[currentIndex - 1];
  const nextCuisine = allCuisines[currentIndex + 1];
  const makeCuisineId = (c) => encodeURIComponent((c.name || c).toLowerCase());
  const featuredRestaurant = restaurants.find((r) => r.isFeatured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className={`relative h-64 md:h-80 bg-linear-to-br ${gradient}`}>
        <div className="absolute inset-0 bg-black/30" />
        <Link
          to="/cuisines"
          className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white transition-colors z-10"
        >
          <ChevronLeft className="w-4 h-4" /> All Cuisines
        </Link>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <span className="text-5xl mb-3 block">{icon}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {displayName} Cuisine
            </h1>
            <p className="text-white/80">
              {loading
                ? "Loading..."
                : `${restaurants.length} restaurant${restaurants.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
        </div>
      </div>

      {/* Featured Banner */}
      {!loading && featuredRestaurant && (
        <div className="bg-linear-to-r from-orange-500 to-orange-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                {featuredRestaurant.profileImage ? (
                  <img
                    src={featuredRestaurant.profileImage}
                    alt={featuredRestaurant.fullName}
                    className="w-14 h-14 rounded-xl object-cover border-2 border-white/30"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                    {icon}
                  </div>
                )}
                <div>
                  <p className="text-orange-100 text-xs font-medium uppercase tracking-wide">
                    ⭐ Featured Restaurant
                  </p>
                  <h3 className="text-white font-bold text-lg">
                    {featuredRestaurant.fullName}
                  </h3>
                  <p className="text-orange-100 text-sm">
                    {featuredRestaurant.address ||
                      `Top ${displayName} restaurant in the area`}
                  </p>
                </div>
              </div>
              <Link
                to={`/restaurant/${featuredRestaurant._id}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-colors shrink-0"
              >
                View Restaurant <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Generic promo if no featured */}
      {!loading && !featuredRestaurant && restaurants.length > 0 && (
        <div className="bg-linear-to-r from-gray-800 to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{icon}</span>
                <div>
                  <p className="text-white font-semibold">
                    {restaurants.length} {displayName} restaurants on CayEats
                  </p>
                  <p className="text-gray-400 text-sm">
                    Click delivery buttons to order from your favourite
                    restaurant
                  </p>
                </div>
              </div>
              <Link
                to="/partner"
                className="text-sm text-orange-400 hover:text-orange-300 font-medium whitespace-nowrap"
              >
                Own a restaurant? List it free →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Restaurants Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600 text-center">
            Failed to load restaurants: {error}
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="aspect-16/10 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {displayName} restaurants yet
            </h3>
            <p className="text-gray-500 mb-6">
              Check back soon — more restaurants are joining CayEats every day.
            </p>
            <Link
              to="/restaurants"
              className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
            >
              Browse All Restaurants
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant._id}
                restaurant={restaurant}
                variant="default"
              />
            ))}
          </div>
        )}
      </div>

      {/* Prev/Next Navigation */}
      {allCuisines.length > 0 && (
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between">
              {prevCuisine ? (
                <Link
                  to={`/cuisines/${makeCuisineId(prevCuisine)}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm">Previous:</span>
                  <span className="font-medium">
                    {CUISINE_ICONS[
                      (prevCuisine.name || prevCuisine).toLowerCase()
                    ] || "🍽️"}{" "}
                    {prevCuisine.name || prevCuisine}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {nextCuisine && (
                <Link
                  to={`/cuisines/${makeCuisineId(nextCuisine)}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <span className="hidden sm:inline text-sm">Next:</span>
                  <span className="font-medium">
                    {CUISINE_ICONS[
                      (nextCuisine.name || nextCuisine).toLowerCase()
                    ] || "🍽️"}{" "}
                    {nextCuisine.name || nextCuisine}
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CuisineCategoryPage;
