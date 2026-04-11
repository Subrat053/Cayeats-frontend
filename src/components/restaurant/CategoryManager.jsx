import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from "../../api/categoryService";
import { logger } from "../../utils/logger";
import { getRestaurantProfile } from "../../api/restaurantService";

const EMOJI_ICONS = [
  // Main Dishes
  "🍽️",
  "🍕",
  "🍔",
  "🌮",
  "🌯",
  "🥙",
  "🥗",
  "🍝",
  "🍜",
  "🍲",
  // Asian
  "🍱",
  "🍛",
  "🍚",
  "🥟",
  "🥠",
  "🍤",
  "🍣",
  "🍢",
  // Desserts & Sweets
  "🍰",
  "🧁",
  "🍪",
  "🍩",
  "🍫",
  "🍬",
  "🍭",
  "🍮",
  "🍦",
  "🍨",
  "🍧",
  "🎂",
  "🥧",
  // Beverages
  "☕",
  "🍵",
  "🥤",
  "🧃",
  "🧋",
  "🍶",
  "🍾",
  "🍷",
  "🍸",
  "🍹",
  "🍺",
  "🍻",
  "🥂",
  // Additional Foods
  "🥓",
  "🍗",
  "🍖",
  "🌭",
  "🥪",
  "🥘",
  // Bread & Breakfast
  "🍞",
  "🥐",
  "🥖",
  "🥨",
  "🧇",
  "🥞",
  "🧈",
  // Fruits & Veggies
  "🍎",
  "🍊",
  "🥬",
  "🥒",
  "🌶️",
  "🧄",
  "🧅",
  "🥕",
  "🌽",
  // Special
  "🍴",
  "🍳",
  "⚡",
  "✨",
  "🌟",
  "⭐",
  "🎉",
  "🎊",
];

const CategoryManager = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState({
    loading: true,
    isApproved: true,
  });
  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "🍽️",
  });
  const [draggedFrom, setDraggedFrom] = useState(null);

  useEffect(() => {
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      logger.error("❌ Error fetching categories:", err);
      setError(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    if (!approvalStatus.isApproved) {
      setError("Waiting for admin approval");
      return;
    }
    setForm({ name: "", description: "", icon: "🍽️" });
    setEditingId(null);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (category) => {
    if (!approvalStatus.isApproved) {
      setError("Waiting for admin approval");
      return;
    }
    setForm({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "🍽️",
    });
    setEditingId(category._id);
    setError(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || form.name.trim() === "") {
      setError("Category name is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await updateCategory(editingId, form);
      } else {
        await createCategory(form);
      }
      setShowModal(false);
      await fetchCategories();
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
    if (
      !window.confirm(
        "Delete this category? (products in it must be reassigned first)",
      )
    )
      return;
    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  const handleDragStart = (index) => {
    setDraggedFrom(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (index) => {
    if (draggedFrom === null || draggedFrom === index) {
      setDraggedFrom(null);
      return;
    }

    if (!approvalStatus.isApproved) {
      setError("Waiting for admin approval");
      return;
    }

    const newCategories = [...categories];
    const [draggedCategory] = newCategories.splice(draggedFrom, 1);
    newCategories.splice(index, 0, draggedCategory);

    setCategories(newCategories);
    setDraggedFrom(null);

    try {
      await reorderCategories(newCategories);
    } catch (err) {
      setError("Failed to reorder categories");
      await fetchCategories();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading categories...
          </p>
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
              🏷️ Menu Categories
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={openAdd}
                disabled={!approvalStatus.isApproved}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 font-bold ${
                  approvalStatus.isApproved
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                ➕ Add Category
              </button>
              <button
                onClick={() => navigate("/dashboard/categories/analytics")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-bold"
              >
                📊 Analytics
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
            ⏳ WAITING FOR ADMIN APPROVAL. CATEGORY CHANGES ARE DISABLED.
          </div>
        )}

        {categories.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="divide-y">
              {categories.map((category, index) => (
                <div
                  key={category._id}
                  draggable={approvalStatus.isApproved}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    draggedFrom === index ? "bg-blue-50" : ""
                  } ${approvalStatus.isApproved ? "cursor-move" : ""}`}
                >
                  <div className="flex items-center gap-4 grow">
                    <span className="text-4xl">{category.icon}</span>
                    <div className="grow">
                      <h3 className="text-lg font-bold text-gray-900">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-gray-600">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEdit(category)}
                      disabled={!approvalStatus.isApproved}
                      className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      disabled={!approvalStatus.isApproved}
                      className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 px-6 py-4 text-sm text-gray-600">
              💡 Drag to reorder categories. They'll appear in this order on
              your menu.
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-2xl text-gray-400 mb-4">📭</p>
            <p className="text-lg text-gray-600 font-medium mb-6">
              No categories yet
            </p>
            <button
              onClick={openAdd}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors duration-200 font-bold ${
                approvalStatus.isApproved
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              ➕ Create Your First Category
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Appetizers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Optional description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Icon
                </label>
                <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
                  {EMOJI_ICONS.map((emoji, idx) => (
                    <button
                      key={`emoji-${idx}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setForm((prev) => ({ ...prev, icon: emoji }));
                      }}
                      className={`p-3 text-2xl rounded-lg border-2 transition-all cursor-pointer hover:scale-110 ${
                        form.icon === emoji
                          ? "border-blue-500 bg-blue-50 scale-110"
                          : "border-gray-300 hover:border-blue-400 bg-white"
                      }`}
                      title={emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : "Save Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
