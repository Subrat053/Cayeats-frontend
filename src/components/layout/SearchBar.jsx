import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cuisineCategories, deliveryProviders } from '../../data/mockData';

const SearchBar = ({ 
  variant = 'default', 
  placeholder = 'Search restaurants, cuisines...',
  showFilters = false,
  onSearch,
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    cuisine: '',
    deliveryProvider: '',
    openNow: false,
    hasPickup: false,
    hasDineIn: false,
  });
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ query, ...filters });
    } else {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (filters.cuisine) params.set('cuisine', filters.cuisine);
      if (filters.deliveryProvider) params.set('provider', filters.deliveryProvider);
      if (filters.openNow) params.set('open', 'true');
      if (filters.hasPickup) params.set('pickup', 'true');
      if (filters.hasDineIn) params.set('dinein', 'true');
      
      navigate(`/restaurants?${params.toString()}`);
    }
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      cuisine: '',
      deliveryProvider: '',
      openNow: false,
      hasPickup: false,
      hasDineIn: false,
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v);

  const variants = {
    default: 'bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-500',
    hero: 'bg-white shadow-lg',
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch} className={`flex items-center gap-1 lg:gap-2 rounded-xl px-2 lg:px-4 py-2.5 transition-all ${variants[variant]}`}>
        <Search className="w-5 h-5 text-gray-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 text-sm "
        />
        {showFilters && (
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-1.5 rounded-lg transition-colors ${
              hasActiveFilters 
                ? 'bg-primary-100 text-primary-600' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="bg-primary-500 text-white px-2 lg:px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Filter Dropdown */}
      {isFilterOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsFilterOpen(false)} 
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-20 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-primary-500 hover:text-primary-600"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Cuisine Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Cuisine
                </label>
                <select
                  value={filters.cuisine}
                  onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All cuisines</option>
                  {cuisineCategories.map((cuisine) => (
                    <option key={cuisine.id} value={cuisine.id}>
                      {cuisine.icon} {cuisine.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Provider Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Delivery Provider
                </label>
                <select
                  value={filters.deliveryProvider}
                  onChange={(e) => setFilters({ ...filters, deliveryProvider: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All providers</option>
                  {deliveryProviders.filter(p => p.enabled).map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Toggle Filters */}
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.openNow}
                    onChange={(e) => setFilters({ ...filters, openNow: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Open Now</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasPickup}
                    onChange={(e) => setFilters({ ...filters, hasPickup: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Pickup</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasDineIn}
                    onChange={(e) => setFilters({ ...filters, hasDineIn: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Dine-in</span>
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSearch}
              className="w-full mt-4 bg-primary-500 text-white py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchBar;
