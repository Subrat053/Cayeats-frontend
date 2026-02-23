import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Grid3X3, List, X } from "lucide-react";
import {
  fetchRestaurants,
  fetchCuisineCategories,
} from "../api/browseServices";
import { RestaurantCard } from "../components/restaurant";

const DELIVERY_PROVIDERS = [
  { id: "Bento", name: "Bento" },
  { id: "Let's Eat", name: "Let's Eat" },
  { id: "Cayman Delivery", name: "Cayman Delivery" },
];

const RestaurantsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [cuisineCategories, setCuisineCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Filters from URL ───────────────────────────────────
  const filters = {
    query: searchParams.get("q") || "",
    cuisine: searchParams.get("cuisine") || "",
    provider: searchParams.get("provider") || "",
    openNow: searchParams.get("open") === "true",
    featured: searchParams.get("featured") === "true",
  };

  // ── Load cuisine categories from API ──────────────────
  useEffect(() => {
    fetchCuisineCategories()
      .then(setCuisineCategories)
      .catch(() => {});
  }, []);

  // ── Load restaurants from API ─────────────────────────
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchRestaurants({
      search: filters.query,
      cuisine: filters.cuisine,
      provider: filters.provider,
      open: filters.openNow,
    })
      .then(setRestaurants)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters.query, filters.cuisine, filters.provider, filters.openNow]);

  // ── Client-side featured filter ───────────────────────
  const filteredRestaurants = useMemo(() => {
    let result = restaurants;
    if (filters.featured) result = result.filter((r) => r.isFeatured);
    return result;
  }, [restaurants, filters.featured]);

  const updateFilter = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value);
    else p.delete(key);
    setSearchParams(p);
  };

  const clearAllFilters = () => setSearchParams({});

  const activeFilterCount = [
    filters.query,
    filters.cuisine,
    filters.provider,
    filters.openNow,
    filters.featured,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {filters.featured ? "Featured Restaurants" : "All Restaurants"}
          </h1>
          <p className="text-gray-500 mt-2">
            {loading
              ? "Loading..."
              : `${filteredRestaurants.length} restaurant${filteredRestaurants.length !== 1 ? "s" : ""} found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar — Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              updateFilter={updateFilter}
              clearAllFilters={clearAllFilters}
              cuisineCategories={cuisineCategories}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={filters.query}
                  onChange={(e) => updateFilter("q", e.target.value)}
                  placeholder="Search restaurants..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400"}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter tags */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-gray-500">Active filters:</span>
                {filters.query && (
                  <FilterTag
                    label={`"${filters.query}"`}
                    onRemove={() => updateFilter("q", "")}
                  />
                )}
                {filters.cuisine && (
                  <FilterTag
                    label={filters.cuisine}
                    onRemove={() => updateFilter("cuisine", "")}
                  />
                )}
                {filters.provider && (
                  <FilterTag
                    label={filters.provider}
                    onRemove={() => updateFilter("provider", "")}
                  />
                )}
                {filters.openNow && (
                  <FilterTag
                    label="Open Now"
                    onRemove={() => updateFilter("open", "")}
                  />
                )}
                {filters.featured && (
                  <FilterTag
                    label="Featured"
                    onRemove={() => updateFilter("featured", "")}
                  />
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results */}
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600 text-center">
                Failed to load restaurants: {error}
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-[16/10] bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredRestaurants.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No restaurants found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant._id}
                    restaurant={restaurant}
                    variant={viewMode === "list" ? "compact" : "default"}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-140px)]">
              <FilterSidebar
                filters={filters}
                updateFilter={updateFilter}
                clearAllFilters={clearAllFilters}
                cuisineCategories={cuisineCategories}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
              <button
                className="w-full py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
                onClick={() => setShowMobileFilters(false)}
              >
                Show {filteredRestaurants.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Filter Sidebar ─────────────────────────────────────────
const CUISINE_ICONS = {
  caribbean: "🌴",
  american: "🍔",
  italian: "🍕",
  asian: "🍜",
  mexican: "🌮",
  seafood: "🦞",
  indian: "🍛",
  sushi: "🍣",
  breakfast: "🥞",
  desserts: "🍰",
  healthy: "🥗",
  "fast food": "🍟",
};

const FilterSidebar = ({
  filters,
  updateFilter,
  clearAllFilters,
  cuisineCategories,
}) => (
  <div className="space-y-6">
    {/* Cuisine */}
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">Cuisine</h3>
      <div className="space-y-2">
        {cuisineCategories.length === 0
          ? // Fallback static list if API returns empty
            [
              "Caribbean",
              "American",
              "Italian",
              "Asian",
              "Mexican",
              "Seafood",
              "Indian",
              "Sushi & Japanese",
              "Breakfast",
              "Desserts",
              "Healthy",
              "Fast Food",
            ].map((c) => (
              <label
                key={c}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="cuisine"
                  checked={filters.cuisine === c}
                  onChange={() =>
                    updateFilter("cuisine", filters.cuisine === c ? "" : c)
                  }
                  className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-orange-500">
                  {CUISINE_ICONS[c.toLowerCase()] || "🍽️"} {c}
                </span>
              </label>
            ))
          : cuisineCategories.map((c) => (
              <label
                key={c.name || c}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="cuisine"
                  checked={filters.cuisine === (c.name || c)}
                  onChange={() =>
                    updateFilter(
                      "cuisine",
                      filters.cuisine === (c.name || c) ? "" : c.name || c,
                    )
                  }
                  className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-orange-500">
                  {CUISINE_ICONS[(c.name || c).toLowerCase()] || "🍽️"}{" "}
                  {c.name || c}
                </span>
                {c.count && (
                  <span className="text-xs text-gray-400 ml-auto">
                    {c.count}
                  </span>
                )}
              </label>
            ))}
      </div>
    </div>

    {/* Delivery Provider */}
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">Delivery Provider</h3>
      <div className="space-y-2">
        {DELIVERY_PROVIDERS.map((p) => (
          <label
            key={p.id}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              type="radio"
              name="provider"
              checked={filters.provider === p.id}
              onChange={() =>
                updateFilter("provider", filters.provider === p.id ? "" : p.id)
              }
              className="w-4 h-4 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-orange-500">
              {p.name}
            </span>
          </label>
        ))}
      </div>
    </div>

    {/* Availability */}
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.openNow}
            onChange={(e) =>
              updateFilter("open", e.target.checked ? "true" : "")
            }
            className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
          />
          <span className="text-sm text-gray-700 group-hover:text-orange-500">
            Open Now
          </span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.featured}
            onChange={(e) =>
              updateFilter("featured", e.target.checked ? "true" : "")
            }
            className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
          />
          <span className="text-sm text-gray-700 group-hover:text-orange-500">
            Featured Only
          </span>
        </label>
      </div>
    </div>

    <button
      onClick={clearAllFilters}
      className="w-full py-2 text-sm text-orange-500 hover:text-orange-600 font-medium"
    >
      Clear All Filters
    </button>
  </div>
);

// ── Filter Tag ─────────────────────────────────────────────
const FilterTag = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">
    {label}
    <button onClick={onRemove} className="hover:text-orange-900">
      <X className="w-3 h-3" />
    </button>
  </span>
);

export default RestaurantsPage;
