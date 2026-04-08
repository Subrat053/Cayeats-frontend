import React, { useState, useEffect } from "react";
import api from "../../api/axios"; // ✅ Import the api instance, not axios directly
import { useCurrency } from "../../context/CurrencyContext";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getRestaurantProfile,
} from "../../api/restaurantService";
import { getCategories } from "../../api/categoryService";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  stock: "",
};

const DashboardMenu = () => {
  const { currencySymbol, refreshCurrency } = useCurrency();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState({
    loading: true,
    isApproved: true,
  });

  useEffect(() => {
    // Load initial data - currency is already loaded from localStorage by context
    const loadInitialData = async () => {
      try {
        // Verify currency is latest from server (non-blocking)
        refreshCurrency();
        // Load menu data
        await fetchData();
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();

    getRestaurantProfile()
      .then((data) => {
        setApprovalStatus({
          loading: false,
          isApproved: data?.isApproved !== false,
        });
      })
      .catch(() => {
        setApprovalStatus({ loading: false, isApproved: true });
      });
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both products and categories
      const [productsResponse, categoriesData] = await Promise.all([
        api.get("/restaurant/products"),
        getCategories(),
      ]);

      const productsData = productsResponse.data.data || [];
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    if (!approvalStatus.isApproved) {
      setError("Waiting for admin approval");
      return;
    }
    if (categories.length === 0) {
      setError("Please create at least one category first");
      return;
    }
    setForm({
      ...EMPTY_FORM,
      category: categories[0]._id,
    });
    setEditingId(null);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (product) => {
    if (!approvalStatus.isApproved) {
      setError("Waiting for admin approval");
      return;
    }
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category?._id || "",
      image: product.image || "",
      stock: product.stock ?? "",
    });
    setEditingId(product._id);
    setError(null);
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    if (!approvalStatus.isApproved) {
      setError("Waiting for admin approval");
      return;
    }
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, image: url || "" }));
    } catch (err) {
      setError("Image upload failed: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!form.name || !form.price || !form.category) {
      setError("Name, price, and category are required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        await addProduct(form);
      }
      setShowModal(false);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!approvalStatus.isApproved) {
      setError("Waiting for admin approval");
      return;
    }
    if (!window.confirm("Delete this item?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  // Group products by category
  const getProductsByCategory = (categoryId) => {
    return products.filter((p) => p.category?._id === categoryId);
  };

  // Filter products by search term
  const filteredCategories = categories.filter((category) => {
    const categoryProducts = getProductsByCategory(category._id);
    return (
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoryProducts.some(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    );
  });

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
            <div className="flex items-center gap-3">
              <button
                onClick={openAdd}
                disabled={!approvalStatus.isApproved || categories.length === 0}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 font-bold ${
                  approvalStatus.isApproved && categories.length > 0
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                ➕ Add Item
              </button>
              <button
                onClick={fetchData}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-bold"
              >
                🔄 Refresh
              </button>
            </div>
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
        {!approvalStatus.loading && !approvalStatus.isApproved && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 text-sm font-semibold uppercase">
            ⏳ WAITING FOR ADMIN APPROVAL. MENU CHANGES ARE DISABLED.
          </div>
        )}
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
        </div>

        {/* Content - Conditional Display */}

        {categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-2xl text-gray-400 mb-4">📭</p>
            <p className="text-lg text-gray-600 font-medium mb-2">
              No categories created yet
            </p>
            <p className="text-gray-500 mb-6">
              Create categories in the Categories section before adding menu
              items
            </p>
          </div>
        ) : (
          <>
            {/* Categories with Products */}
            {filteredCategories.length > 0 ? (
              <div className="space-y-8">
                {filteredCategories.map((category) => {
                  const categoryProducts = getProductsByCategory(category._id);
                  const filteredProducts = categoryProducts.filter(
                    (p) =>
                      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      p.description
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                  );

                  if (filteredProducts.length === 0 && searchTerm) return null;

                  return (
                    <div key={category._id}>
                      {/* Category Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{category.icon}</span>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {category.name}
                          </h2>
                          {category.description && (
                            <p className="text-sm text-gray-600">
                              {category.description}
                            </p>
                          )}
                        </div>
                        {filteredProducts.length > 0 && (
                          <span className="ml-auto text-sm font-semibold text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                            {filteredProducts.length} items
                          </span>
                        )}
                      </div>

                      {/* Products Grid */}
                      {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                          {filteredProducts.map((product) => (
                            <div
                              key={product._id}
                              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                            >
                              <div className="flex justify-end gap-2 p-3">
                                <button
                                  onClick={() => openEdit(product)}
                                  disabled={!approvalStatus.isApproved}
                                  className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-orange-100 text-gray-700 disabled:opacity-50"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(product._id)}
                                  disabled={!approvalStatus.isApproved}
                                  className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-red-100 text-gray-700 disabled:opacity-50"
                                >
                                  Remove
                                </button>
                              </div>
                              {/* Product Image */}
                              {product.image && (
                                <div className="h-48 w-full bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center">
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
                                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                                    {product.name}
                                  </h3>
                                  <span className="text-xl font-bold text-green-600 whitespace-nowrap">
                                    {currencySymbol}
                                    {product.price}
                                  </span>
                                </div>

                                {/* Description */}
                                {product.description && (
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {product.description}
                                  </p>
                                )}

                                {/* Stock Badge */}
                                {product.stock !== undefined && (
                                  <div className="mt-auto">
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
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg mb-8">
                          <p className="text-gray-500">
                            No items in this category yet
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
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
            {products.length > 0 && (
              <div className="mt-8 text-center text-gray-600 font-medium">
                Total: {products.length} items across {categories.length}{" "}
                categories
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit Menu Item" : "Add Menu Item"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {[
                {
                  label: "Name *",
                  field: "name",
                  type: "text",
                  placeholder: "e.g. Butter Chicken",
                },
                {
                  label: `Price * (${currencySymbol})`,
                  field: "price",
                  type: "number",
                  placeholder: `Enter price in ${currencySymbol}`,
                },
                {
                  label: "Description",
                  field: "description",
                  type: "text",
                  placeholder: "e.g. Mains, Drinks",
                },
                {
                  label: "Stock",
                  field: "stock",
                  type: "number",
                  placeholder: "0",
                },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[field]}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-sm"
                  />
                  {uploadingImage && (
                    <span className="text-xs text-gray-500">Uploading...</span>
                  )}
                </div>
                {form.image && (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="mt-3 w-24 h-24 object-cover rounded-lg border"
                  />
                )}
              </div>

              <button
                onClick={handleSaveProduct}
                disabled={saving}
                className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMenu;
