import { Link } from 'react-router-dom';
import { cuisineCategories } from '../data/mockData';
import { CuisineCard } from '../components/restaurant';

const CuisinesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Explore Cuisines
          </h1>
          <p className="text-secondary-100 text-lg max-w-2xl mx-auto">
            Discover the diverse culinary landscape of the Cayman Islands. From Caribbean classics to international favorites.
          </p>
        </div>
      </div>

      {/* Cuisines Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cuisineCategories.map((cuisine) => (
            <CuisineCard key={cuisine.id} cuisine={cuisine} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CuisinesPage;
