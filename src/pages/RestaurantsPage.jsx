import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  Grid3X3, 
  List,
  ChevronDown,
  X
} from 'lucide-react';
// import { restaurants, cuisineCategories, deliveryProviders } from '../../data/mockData';
import { restaurants, cuisineCategories, deliveryProviders } from '../data/mockData';
import { RestaurantCard } from '../components/restaurant';
import { filterRestaurants } from '../utils/helpers';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const RestaurantsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get filters from URL
  const filters = {
    query: searchParams.get('q') || '',
    cuisine: searchParams.get('cuisine') || '',
    deliveryProvider: searchParams.get('provider') || '',
    openNow: searchParams.get('open') === 'true',
    hasPickup: searchParams.get('pickup') === 'true',
    hasDineIn: searchParams.get('dinein') === 'true',
    featured: searchParams.get('featured') === 'true',
  };

  // Filter restaurants
  const filteredRestaurants = useMemo(() => {
    let result = filterRestaurants(restaurants, filters);
    if (filters.featured) {
      result = result.filter(r => r.isFeatured);
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [filters]);

  // Update URL params
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const activeFilterCount = Object.values(filters).filter(v => v).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {filters.featured ? 'Featured Restaurants' : 'All Restaurants'}
          </h1>
          <p className="text-gray-500 mt-2">
            {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar 
              filters={filters} 
              updateFilter={updateFilter}
              clearAllFilters={clearAllFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={filters.query}
                    onChange={(e) => updateFilter('q', e.target.value)}
                    placeholder="Search restaurants..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 ml-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="primary" size="xs">{activeFilterCount}</Badge>
                  )}
                </button>

                {/* View Toggle */}
                <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-gray-500">Active filters:</span>
                {filters.query && (
                  <FilterTag label={`"${filters.query}"`} onRemove={() => updateFilter('q', '')} />
                )}
                {filters.cuisine && (
                  <FilterTag 
                    label={cuisineCategories.find(c => c.id === filters.cuisine)?.name || filters.cuisine} 
                    onRemove={() => updateFilter('cuisine', '')} 
                  />
                )}
                {filters.deliveryProvider && (
                  <FilterTag 
                    label={deliveryProviders.find(p => p.id === filters.deliveryProvider)?.name || filters.deliveryProvider} 
                    onRemove={() => updateFilter('provider', '')} 
                  />
                )}
                {filters.openNow && (
                  <FilterTag label="Open Now" onRemove={() => updateFilter('open', '')} />
                )}
                {filters.hasPickup && (
                  <FilterTag label="Pickup" onRemove={() => updateFilter('pickup', '')} />
                )}
                {filters.hasDineIn && (
                  <FilterTag label="Dine-in" onRemove={() => updateFilter('dinein', '')} />
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results */}
            {filteredRestaurants.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                <Button onClick={clearAllFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard 
                    key={restaurant.id} 
                    restaurant={restaurant}
                    variant={viewMode === 'list' ? 'compact' : 'default'}
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
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl animate-slide-up">
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
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
              <Button 
                className="w-full" 
                onClick={() => setShowMobileFilters(false)}
              >
                Show {filteredRestaurants.length} Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Filter Sidebar Component
const FilterSidebar = ({ filters, updateFilter, clearAllFilters }) => {
  return (
    <div className="space-y-6">
      {/* Cuisine Filter */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Cuisine</h3>
        <div className="space-y-2">
          {cuisineCategories.map((cuisine) => (
            <label key={cuisine.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="cuisine"
                checked={filters.cuisine === cuisine.id}
                onChange={() => updateFilter('cuisine', filters.cuisine === cuisine.id ? '' : cuisine.id)}
                className="w-4 h-4 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-primary-500">
                {cuisine.icon} {cuisine.name}
              </span>
              <span className="text-xs text-gray-400 ml-auto">{cuisine.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Delivery Provider Filter */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Delivery Provider</h3>
        <div className="space-y-2">
          {deliveryProviders.filter(p => p.enabled).map((provider) => (
            <label key={provider.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="provider"
                checked={filters.deliveryProvider === provider.id}
                onChange={() => updateFilter('provider', filters.deliveryProvider === provider.id ? '' : provider.id)}
                className="w-4 h-4 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-primary-500">
                {provider.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability Filters */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.openNow}
              onChange={(e) => updateFilter('open', e.target.checked ? 'true' : '')}
              className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-primary-500">
              Open Now
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.hasPickup}
              onChange={(e) => updateFilter('pickup', e.target.checked ? 'true' : '')}
              className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-primary-500">
              Pickup Available
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.hasDineIn}
              onChange={(e) => updateFilter('dinein', e.target.checked ? 'true' : '')}
              className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-primary-500">
              Dine-in Available
            </span>
          </label>
        </div>
      </div>

      {/* Clear All */}
      <button
        onClick={clearAllFilters}
        className="w-full py-2 text-sm text-primary-500 hover:text-primary-600 font-medium"
      >
        Clear All Filters
      </button>
    </div>
  );
};

// Filter Tag Component
const FilterTag = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
    {label}
    <button onClick={onRemove} className="hover:text-primary-900">
      <X className="w-3 h-3" />
    </button>
  </span>
);

export default RestaurantsPage;
