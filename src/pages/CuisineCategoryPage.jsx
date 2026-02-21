import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { restaurants, cuisineCategories } from '../data/mockData';
import { RestaurantCard } from '../components/restaurant';
import Button from '../components/ui/Button';

const CuisineCategoryPage = () => {
  const { categoryId } = useParams();
  const cuisine = cuisineCategories.find(c => c.id === categoryId);
  
  const filteredRestaurants = restaurants.filter(r => 
    r.cuisines.includes(categoryId)
  ).sort((a, b) => {
    // Featured first, then alphabetically
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return a.name.localeCompare(b.name);
  });

  if (!cuisine) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cuisine Not Found</h1>
          <p className="text-gray-500 mb-6">The cuisine category you're looking for doesn't exist.</p>
          <Link to="/cuisines">
            <Button>Browse All Cuisines</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Find adjacent cuisines for navigation
  const currentIndex = cuisineCategories.findIndex(c => c.id === categoryId);
  const prevCuisine = cuisineCategories[currentIndex - 1];
  const nextCuisine = cuisineCategories[currentIndex + 1];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        {cuisine.image ? (
          <img 
            src={cuisine.image} 
            alt={cuisine.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        
        {/* Back Link */}
        <Link 
          to="/cuisines"
          className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          All Cuisines
        </Link>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <span className="text-5xl mb-4 block">{cuisine.icon}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {cuisine.name} Cuisine
            </h1>
            <p className="text-gray-200">
              {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Restaurants */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">{cuisine.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No restaurants yet</h3>
            <p className="text-gray-500 mb-6">
              We don't have any {cuisine.name.toLowerCase()} restaurants listed yet.
            </p>
            <Link to="/restaurants">
              <Button>Browse All Restaurants</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>

      {/* Navigation between cuisines */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {prevCuisine ? (
              <Link 
                to={`/cuisines/${prevCuisine.id}`}
                className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Previous:</span>
                <span className="font-medium">{prevCuisine.icon} {prevCuisine.name}</span>
              </Link>
            ) : (
              <div />
            )}
            
            {nextCuisine && (
              <Link 
                to={`/cuisines/${nextCuisine.id}`}
                className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors"
              >
                <span className="hidden sm:inline">Next:</span>
                <span className="font-medium">{nextCuisine.icon} {nextCuisine.name}</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuisineCategoryPage;
