import React, { useState, useEffect } from "react";
import api from "../../api/axios"; // ✅ Import the api instance, not axios directly

const DashboardMenu = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Use the api instance instead of axios directly
      // This will use baseURL: http://localhost:5000/api
      // And automatically add the token to headers

      const response = await api.get("/restaurant/products");

      console.log("📥 Full Response:", response.data);
      console.log("📥 Response.data.data:", response.data.data);
      console.log("📥 Is Array:", Array.isArray(response.data.data));

      // Extract the products data
      const productsData = response.data.data || [];

      console.log("✅ Setting products:", productsData);
      console.log("✅ Products count:", productsData.length);

      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      setError(err.response?.data?.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  // Filter products by category and search
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);

  // Get unique categories from products
  const categories = ["all", ...new Set(products.map((p) => p.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg font-medium">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              📋 Restaurant Menu
            </h1>
            <button
              onClick={fetchProducts}
              title="Refresh menu"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                🔍
              </span>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                {/* Product Image */}
                {product.image && (
                  <div className="h-48 w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-grow">
                  {/* Name and Price */}
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <span className="text-xl font-bold text-green-600 whitespace-nowrap">
                      ₹{product.price}
                    </span>
                  </div>

                  {/* Description */}
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {/* Category and Stock Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full capitalize">
                      {product.category}
                    </span>
                    {product.stock !== undefined && (
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
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-400 mb-2">😔</p>
            <p className="text-lg text-gray-600 font-medium mb-1">
              No menu items found
            </p>
            {searchTerm && (
              <p className="text-gray-500">Try a different search term</p>
            )}
          </div>
        )}

        {/* Product Count */}
        {filteredProducts.length > 0 && (
          <div className="mt-8 text-center text-gray-600 font-medium">
            Showing {filteredProducts.length} of {products.length} items
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardMenu;
