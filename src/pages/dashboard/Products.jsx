import { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from "../../api/restaurantService";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  stock: "",
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false); // ← NEW
  const [error, setError] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      category: p.category || "",
      image: p.image || "",
      stock: p.stock ?? "",
    });
    setEditingId(p._id);
    setError(null);
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, image: url }));
    } catch (err) {
      setError("Image upload failed: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      setError("Name and price are required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        const updated = await updateProduct(editingId, form);
        setProducts((prev) =>
          prev.map((p) => (p._id === editingId ? updated : p)),
        );
      } else {
        const created = await addProduct(form);
        setProducts((prev) => [created, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            {products.length} products on your menu
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-lg">No products yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Click "Add Product" to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {p.name}
                </h3>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {p.category || "Uncategorized"}
                </p>
                <p className="text-orange-500 font-bold mt-1">
                  ${Number(p.price).toFixed(2)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Stock: {p.stock ?? 0}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => openEdit(p)}
                  className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                  {error}
                </div>
              )}

              {[
                {
                  label: "Product Name *",
                  field: "name",
                  type: "text",
                  placeholder: "e.g. Jerk Chicken",
                },
                {
                  label: "Description",
                  field: "description",
                  type: "text",
                  placeholder: "Short description",
                },
                {
                  label: "Price *",
                  field: "price",
                  type: "number",
                  placeholder: "0.00",
                },
                {
                  label: "Category",
                  field: "category",
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
                    placeholder={placeholder}
                    value={form[field]}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 text-sm"
                  />
                </div>
              ))}

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>

                {/* Preview */}
                {form.image && !uploadingImage && (
                  <img
                    src={form.image}
                    alt="preview"
                    className="w-full h-36 object-cover rounded-lg mb-2 border border-gray-200"
                  />
                )}

                {/* Upload spinner */}
                {uploadingImage && (
                  <div className="w-full h-36 bg-gray-50 rounded-lg mb-2 border border-gray-200 flex flex-col items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
                    <p className="text-sm text-gray-500">
                      Uploading to Cloudinary...
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 disabled:opacity-50"
                />

                {form.image && !uploadingImage && (
                  <p className="text-xs text-green-600 mt-1">✓ Image ready</p>
                )}
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploadingImage}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm disabled:opacity-50 flex items-center gap-2"
              >
                {uploadingImage ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Uploading...
                  </>
                ) : saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Saving...
                  </>
                ) : editingId ? (
                  "Update Product"
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
