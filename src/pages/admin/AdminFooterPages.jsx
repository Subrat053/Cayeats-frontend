import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Loader,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  getAllFooterPages,
  getFooterPageBySlug,
  createOrUpdateFooterPage,
  addFAQ,
  updateFAQ,
  deleteFAQ,
  updateContactInfo,
  togglePageStatus,
  initializeDefaultPages,
} from "../../api/adminService";
import { useFooterPage } from "../../context/FooterPageContext";

const AdminFooterPages = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const { invalidateCache, invalidateAllCache } = useFooterPage();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    contactInfo: {
      email: "",
      phone: "",
      address: "",
      hours: "",
    },
  });

  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "" });
  const [editingFAQData, setEditingFAQData] = useState(null);

  // Load all footer pages
  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      const data = await getAllFooterPages();
      setPages(data);
      if (data.length > 0) {
        selectPage(data[0]);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to load footer pages: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const selectPage = async (page) => {
    try {
      const fullPage = await getFooterPageBySlug(page.slug);
      setSelectedPage(fullPage);
      setFormData({
        title: fullPage.title || "",
        description: fullPage.description || "",
        content: fullPage.content || "",
        contactInfo: fullPage.contactInfo || {
          email: "",
          phone: "",
          address: "",
          hours: "",
        },
      });
      setNewFAQ({ question: "", answer: "" });
      setEditingFAQData(null);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to load page details: " + error.message,
      });
    }
  };

  const handleSavePage = async () => {
    if (!formData.title.trim()) {
      setMessage({ type: "error", text: "Title is required" });
      return;
    }

    try {
      setSaving(true);
      const updated = await createOrUpdateFooterPage(
        selectedPage.slug,
        formData,
      );
      setSelectedPage(updated);
      invalidateCache(selectedPage.slug); // Refresh cache
      setMessage({ type: "success", text: "Page saved successfully!" });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to save page: " + error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddFAQ = async () => {
    if (!newFAQ.question.trim() || !newFAQ.answer.trim()) {
      setMessage({ type: "error", text: "Question and answer are required" });
      return;
    }

    try {
      setSaving(true);
      const updated = await addFAQ(selectedPage.slug, newFAQ);
      setSelectedPage(updated);
      setNewFAQ({ question: "", answer: "" });
      setEditingFAQData(null);
      invalidateCache(selectedPage.slug); // Refresh cache
      setMessage({ type: "success", text: "FAQ added successfully!" });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to add FAQ: " + error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFAQ = async (faqId) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      setSaving(true);
      const updated = await deleteFAQ(selectedPage.slug, faqId);
      setSelectedPage(updated);
      setEditingFAQData(null);
      invalidateCache(selectedPage.slug); // Refresh cache
      setMessage({ type: "success", text: "FAQ deleted successfully!" });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to delete FAQ: " + error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateFAQ = async (faqId, updatedFAQ) => {
    if (!updatedFAQ.question.trim() || !updatedFAQ.answer.trim()) {
      setMessage({ type: "error", text: "Question and answer are required" });
      return;
    }

    try {
      setSaving(true);
      const updated = await updateFAQ(selectedPage.slug, faqId, updatedFAQ);
      setSelectedPage(updated);
      setEditingFAQData(null);
      invalidateCache(selectedPage.slug); // Refresh cache
      setMessage({ type: "success", text: "FAQ updated successfully!" });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update FAQ: " + error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateContact = async () => {
    try {
      setSaving(true);
      const updated = await updateContactInfo(
        selectedPage.slug,
        formData.contactInfo,
      );
      setSelectedPage(updated);
      invalidateCache(selectedPage.slug); // Refresh cache
      setMessage({
        type: "success",
        text: "Contact info updated successfully!",
      });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update contact info: " + error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInitializePages = async () => {
    if (!window.confirm("This will create default pages. Continue?")) return;

    try {
      setSaving(true);
      const result = await initializeDefaultPages();

      if (result.success) {
        // Clear entire cache after initialization
        invalidateAllCache();

        // Reload pages
        const data = await getAllFooterPages();
        setPages(data);
        if (data.length > 0) {
          const fullPage = await getFooterPageBySlug(data[0].slug);
          setSelectedPage(fullPage);
          setFormData({
            title: fullPage.title || "",
            description: fullPage.description || "",
            content: fullPage.content || "",
            contactInfo: fullPage.contactInfo || {
              email: "",
              phone: "",
              address: "",
              hours: "",
            },
          });
          setNewFAQ({ question: "", answer: "" });
          setEditingFAQData(null);
        }

        setMessage({
          type: "success",
          text: "Default pages initialized successfully!",
        });
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Initialize pages error:", error);
      setMessage({
        type: "error",
        text: "Failed to initialize pages: " + error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Footer Page Management</h1>
        <button
          onClick={handleInitializePages}
          disabled={saving}
          className="bg-secondary-500 text-white px-6 py-3 rounded font-bold hover:bg-secondary-600 active:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm"
        >
          <Plus size={18} />
          Initialize Default Pages
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 p-4 rounded ${
            message.type === "success"
              ? "bg-success-50 text-success-800"
              : "bg-error-50 text-error-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Page List */}
        <div className="col-span-3">
          <div className="bg-gray-50 rounded p-4">
            <h2 className="font-semibold text-lg mb-4">Pages</h2>
            <div className="space-y-2">
              {pages.map((page) => (
                <button
                  key={page._id}
                  onClick={() => selectPage(page)}
                  className={`w-full text-left p-3 rounded transition ${
                    selectedPage?._id === page._id
                      ? "bg-secondary-500 text-white"
                      : "bg-white hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <div className="font-medium">{page.title}</div>
                  <div className="text-sm opacity-75">{page.slug}</div>
                  <div className="text-xs mt-1">
                    {page.isActive ? (
                      <span className="text-success-600">Active</span>
                    ) : (
                      <span className="text-error-600">Inactive</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Page Editor */}
        <div className="col-span-9">
          {selectedPage ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  {/* Content Editor for non-special pages */}
                  {selectedPage.slug !== "faq" &&
                    selectedPage.slug !== "contact" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Content (Markdown Supported)
                          </label>
                          <textarea
                            value={formData.content}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                content: e.target.value,
                              })
                            }
                            rows={12}
                            className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-sm"
                            placeholder="Write content using markdown format:
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet point
- Another item

1. Numbered list
2. Another item

Use these formatting options for professional looking pages."
                          />

                          {/* Markdown Hints */}
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                            <h4 className="font-semibold text-sm text-blue-900 mb-2">
                              📝 Markdown Quick Guide:
                            </h4>
                            <ul className="text-xs text-blue-800 space-y-1">
                              <li>
                                <strong># Title</strong> - Large heading
                              </li>
                              <li>
                                <strong>## Subtitle</strong> - Medium heading
                              </li>
                              <li>
                                <strong>***text***</strong> - Bold text
                              </li>
                              <li>
                                <strong>- item</strong> - Bullet lists
                              </li>
                              <li>
                                <strong>1. item</strong> - Numbered lists
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* Preview Section */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Preview (How it will look)
                          </label>
                          <div className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 overflow-y-auto max-h-60 prose prose-sm">
                            {formData.content ? (
                              <div
                                className="text-sm text-gray-700 space-y-2"
                                dangerouslySetInnerHTML={{
                                  __html: formData.content
                                    .split("\n")
                                    .map((line) => {
                                      // Simple markdown preview
                                      if (line.startsWith("# "))
                                        return `<h2 class="font-bold text-gray-900">${line.replace("# ", "")}</h2>`;
                                      if (line.startsWith("## "))
                                        return `<h3 class="font-bold text-gray-800">${line.replace("## ", "")}</h3>`;
                                      if (line.startsWith("### "))
                                        return `<h4 class="font-bold text-gray-700">${line.replace("### ", "")}</h4>`;
                                      if (line.startsWith("- "))
                                        return `<li class="ml-4">${line.replace("- ", "")}</li>`;
                                      if (line.match(/^\d+\. /))
                                        return `<li class="ml-4">${line}</li>`;
                                      if (line.includes("**"))
                                        return `<p>${line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`;
                                      if (
                                        line.includes("*") &&
                                        !line.includes("**")
                                      )
                                        return `<p>${line.replace(/\*(.+?)\*/g, "<em>$1</em>")}</p>`;
                                      if (line.trim()) return `<p>${line}</p>`;
                                      return "";
                                    })
                                    .join(""),
                                }}
                              />
                            ) : (
                              <p className="text-gray-400 italic">
                                Preview will appear here
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                  <button
                    onClick={handleSavePage}
                    disabled={saving}
                    className="w-full bg-primary-500 text-white px-6 py-3 rounded font-bold hover:bg-primary-600 active:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </div>

              {/* FAQ Management */}
              {selectedPage.slug === "faq" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">FAQ Management</h2>

                  {/* Add New FAQ */}
                  <div className="bg-secondary-50 p-4 rounded mb-6">
                    <h3 className="font-medium mb-3">Add New FAQ</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Question"
                        value={newFAQ.question}
                        onChange={(e) =>
                          setNewFAQ({ ...newFAQ, question: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                      <textarea
                        placeholder="Answer"
                        value={newFAQ.answer}
                        onChange={(e) =>
                          setNewFAQ({ ...newFAQ, answer: e.target.value })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                      <button
                        onClick={handleAddFAQ}
                        disabled={saving}
                        className="w-full bg-success-500 text-white px-6 py-3 rounded font-bold hover:bg-success-600 active:bg-success-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        <Plus size={18} />
                        Add FAQ
                      </button>
                    </div>
                  </div>

                  {/* FAQ List */}
                  <div className="space-y-3">
                    {selectedPage.faqs && selectedPage.faqs.length > 0 ? (
                      selectedPage.faqs.map((faq) => (
                        <div
                          key={faq._id}
                          className="border border-gray-200 rounded"
                        >
                          <div
                            className="p-3 bg-gray-50 cursor-pointer flex justify-between items-center"
                            onClick={() =>
                              setExpandedFAQ(
                                expandedFAQ === faq._id ? null : faq._id,
                              )
                            }
                          >
                            <h4 className="font-medium">{faq.question}</h4>
                            <div className="flex items-center gap-2">
                              {expandedFAQ === faq._id ? (
                                <ChevronUp size={18} />
                              ) : (
                                <ChevronDown size={18} />
                              )}
                            </div>
                          </div>

                          {expandedFAQ === faq._id && (
                            <div className="p-3 border-t border-gray-200">
                              {editingFAQData &&
                              editingFAQData._id === faq._id ? (
                                <div className="space-y-3">
                                  <input
                                    type="text"
                                    value={editingFAQData.question}
                                    onChange={(e) =>
                                      setEditingFAQData({
                                        ...editingFAQData,
                                        question: e.target.value,
                                      })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                  />
                                  <textarea
                                    value={editingFAQData.answer}
                                    onChange={(e) =>
                                      setEditingFAQData({
                                        ...editingFAQData,
                                        answer: e.target.value,
                                      })
                                    }
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() =>
                                        handleUpdateFAQ(faq._id, editingFAQData)
                                      }
                                      className="flex-1 bg-success-500 text-white px-4 py-2 rounded font-bold hover:bg-success-600 active:bg-success-700 disabled:opacity-50 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                                    >
                                      <Save size={16} />
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingFAQData(null)}
                                      className="flex-1 bg-gray-500 text-white px-4 py-2 rounded font-bold hover:bg-gray-600 active:bg-gray-700 disabled:opacity-50 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                                    >
                                      <X size={16} />
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-gray-700 mb-3">
                                    {faq.answer}
                                  </p>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setEditingFAQData(faq)}
                                      className="flex-1 bg-secondary-500 text-white px-4 py-2 rounded font-bold hover:bg-secondary-600 active:bg-secondary-700 disabled:opacity-50 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                                    >
                                      <Edit2 size={16} />
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteFAQ(faq._id)}
                                      className="flex-1 bg-error-500 text-white px-4 py-2 rounded font-bold hover:bg-error-600 active:bg-error-700 disabled:opacity-50 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                                    >
                                      <Trash2 size={16} />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No FAQs yet
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Info Management */}
              {selectedPage.slug === "contact" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Contact Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.contactInfo.email || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactInfo: {
                              ...formData.contactInfo,
                              email: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.contactInfo.phone || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactInfo: {
                              ...formData.contactInfo,
                              phone: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Address
                      </label>
                      <textarea
                        value={formData.contactInfo.address || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactInfo: {
                              ...formData.contactInfo,
                              address: e.target.value,
                            },
                          })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Hours
                      </label>
                      <textarea
                        value={formData.contactInfo.hours || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactInfo: {
                              ...formData.contactInfo,
                              hours: e.target.value,
                            },
                          })
                        }
                        rows={3}
                        placeholder="e.g., Mon-Fri: 9AM-6PM, Sat: 10AM-4PM, Sun: Closed"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    <button
                      onClick={handleUpdateContact}
                      disabled={saving}
                      className="w-full bg-primary-500 text-white px-6 py-3 rounded font-bold hover:bg-primary-600 active:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Save size={18} />
                      Save Contact Info
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No page selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFooterPages;
