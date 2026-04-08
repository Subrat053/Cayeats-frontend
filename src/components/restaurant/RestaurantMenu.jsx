import React, { useState, useEffect } from "react";
import { fetchRestaurantMenu } from "../../api/browseServices";
import { trackCategoryView } from "../../api/categoryService";
import { useCurrency } from "../../context/CurrencyContext";

const RestaurantMenu = ({ restaurantId }) => {
  const { currencySymbol, refreshCurrency } = useCurrency();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load menu data - currency is already loaded from localStorage by context
    const loadMenuData = async () => {
      try {
        // Verify currency is latest from server (non-blocking)
        refreshCurrency();
        // Load menu
        await fetchMenu();
      } catch (error) {
        console.error("Error loading menu data:", error);
      }
    };

    loadMenuData();
  }, [restaurantId, refreshCurrency]);

  const fetchMenu = async (search = "") => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRestaurantMenu(restaurantId, search);
      setMenu(data);
    } catch (err) {
      console.error("Error fetching menu:", err);
      setError("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryVisiblity = (categoryId) => {
    // Track category view when it comes into viewport
    trackCategoryView(categoryId);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    fetchMenu(term);
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-flex items-center gap-2">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!menu?.categories || menu.categories.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p className="text-lg">No menu items available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-white py-4 rounded-lg shadow-sm p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
            🔍
          </span>
        </div>
      </div>

      {/* Categories and Products */}
      {menu.categories.map((category) => (
        <div
          key={category._id}
          data-category-id={category._id}
          className="scroll-mt-20"
        >
          {/* Category Header */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-orange-500">
            <span className="text-4xl">{category.icon}</span>
            <div className="grow">
              <h2 className="text-2xl font-bold text-gray-900">
                {category.name}
              </h2>
              {category.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {category.description}
                </p>
              )}
            </div>
            <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {category.products.length} items
            </span>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {category.products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                {/* Product Image */}
                {product.image && (
                  <div className="h-40 w-full bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="p-4 flex flex-col grow">
                  {/* Name and Price */}
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h3 className="text-base font-bold text-gray-900 line-clamp-2 grow">
                      {product.name}
                    </h3>
                    <span className="text-lg font-bold text-green-600 whitespace-nowrap">
                      {currencySymbol}
                      {product.price}
                    </span>
                  </div>

                  {/* Description */}
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 grow">
                      {product.description}
                    </p>
                  )}

                  {/* Stock Badge */}
                  {product.stock !== undefined && (
                    <div>
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          product.stock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock > 0
                          ? `📦 ${product.stock} in stock`
                          : "Out of Stock"}
                      </span>
                    </div>
                  )}

                  {/* Order Button */}
                  <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                    Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantMenu;
