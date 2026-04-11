import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchRestaurantMenu } from "../../api/browseServices";
import { trackCategoryView } from "../../api/categoryService";
import { logger } from "../../utils/logger";
import { useCurrency } from "../../context/CurrencyContext";

const RestaurantMenu = ({ restaurantId, menuImages = [] }) => {
  const { currencySymbol, refreshCurrency } = useCurrency();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Load menu data - currency is already loaded from localStorage by context
    const loadMenuData = async () => {
      try {
        // Verify currency is latest from server (non-blocking)
        refreshCurrency();
        // Load menu
        await fetchMenu();
      } catch (error) {
        logger.error("Error loading menu data:", error);
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
      logger.error("Error fetching menu:", err);
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

  const goToPrevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + menuImages.length) % menuImages.length,
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % menuImages.length);
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

  const hasDigitalMenu = menu?.categories && menu.categories.length > 0;

  if (!hasDigitalMenu && menuImages.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p className="text-lg">No menu available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Menu Images Section */}
      {menuImages.length > 0 && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="relative bg-gray-900 aspect-video flex items-center justify-center group">
              {/* Extract URL from image object or use as string for backward compatibility */}
              {(() => {
                const currentImage = menuImages[currentImageIndex];
                const imageUrl =
                  typeof currentImage === "string"
                    ? currentImage
                    : currentImage?.url || currentImage;
                return (
                  <img
                    src={imageUrl}
                    alt={`Menu ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                );
              })()}

              {/* Navigation Buttons */}
              {menuImages.length > 1 && (
                <>
                  <button
                    onClick={goToPrevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {menuImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {menuImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {menuImages.length > 1 && (
              <div className="p-4 bg-gray-50 flex gap-2 overflow-x-auto">
                {menuImages.map((image, index) => {
                  const imageUrl =
                    typeof image === "string" ? image : image?.url || image;
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? "border-orange-500"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={imageUrl}
                        alt={`Menu thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Digital Menu Section */}
      {hasDigitalMenu && (
        <>
          {/* Divider */}
          {menuImages.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-gray-500 font-semibold">
                Or browse digital menu
              </span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
          )}

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
        </>
      )}
    </div>
  );
};

export default RestaurantMenu;
