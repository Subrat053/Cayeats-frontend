import { useState, useEffect } from "react";
import { fetchCuisineCategories } from "../api/browseServices";
import { CuisineCard } from "../components/restaurant";

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
  greek: "🫒",
  thai: "🍲",
  french: "🥐",
  spanish: "🥘",
  pizza: "🍕",
  burgers: "🍔",
  vegan: "🌱",
  bbq: "🍖",
  steakhouse: "🥩",
};

const CuisinesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCuisineCategories()
      .then((data) => {
        // Map API response to shape CuisineCard expects
        const mapped = data.map((c) => ({
          id: encodeURIComponent(c.name.toLowerCase()),
          name: c.name,
          count: c.count,
          icon: CUISINE_ICONS[c.name.toLowerCase()] || "🍽️",
          image: null,
        }));
        setCategories(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Explore Cuisines
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            Discover the diverse culinary landscape of the Cayman Islands. From
            Caribbean classics to international favorites.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🍽️</div>
            <p className="text-gray-500">No cuisine categories found yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cuisine) => (
              <CuisineCard key={cuisine.id} cuisine={cuisine} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CuisinesPage;
