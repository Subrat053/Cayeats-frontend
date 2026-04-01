import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Edit2, X, Loader } from "lucide-react";
import {
  getFooterSettings,
  updateFooterSettings,
} from "../../api/adminService";

const AdminFooterSettings = () => {
  const [footerData, setFooterData] = useState({
    discover: [],
    forBusiness: [],
    support: [],
    legal: [],
  });

  const [editingSection, setEditingSection] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [editHref, setEditHref] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load footer data from API
  useEffect(() => {
    const loadFooterData = async () => {
      try {
        setLoading(true);
        const data = await getFooterSettings();
        if (data) {
          setFooterData(data);
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: "Failed to load footer settings: " + error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    loadFooterData();
  }, []);

  const handleEditLink = (section, index, link) => {
    setEditingSection(section);
    setEditingIndex(index);
    setEditLabel(link.label);
    setEditHref(link.href);
  };

  const handleSaveEdit = () => {
    if (!editLabel.trim() || !editHref.trim()) {
      setMessage({ type: "error", text: "Label and href are required" });
      return;
    }

    setFooterData((prev) => ({
      ...prev,
      [editingSection]: prev[editingSection].map((link, idx) =>
        idx === editingIndex ? { label: editLabel, href: editHref } : link,
      ),
    }));

    setEditingSection(null);
    setEditingIndex(null);
    setEditLabel("");
    setEditHref("");
    setMessage({ type: "success", text: "Link updated successfully" });
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteLink = (section, index) => {
    setFooterData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, idx) => idx !== index),
    }));
    setMessage({ type: "success", text: "Link deleted successfully" });
    setTimeout(() => setMessage(""), 3000);
  };

  const handleAddLink = (section) => {
    if (!editLabel.trim() || !editHref.trim()) {
      setMessage({ type: "error", text: "Label and href are required" });
      return;
    }

    setFooterData((prev) => ({
      ...prev,
      [section]: [...prev[section], { label: editLabel, href: editHref }],
    }));

    setEditLabel("");
    setEditHref("");
    setEditingSection(null);
    setMessage({ type: "success", text: "Link added successfully" });
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      await updateFooterSettings(footerData);
      setMessage({
        type: "success",
        text: "Footer settings saved successfully!",
      });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to save footer settings: " + error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const sectionLabels = {
    discover: "Discover",
    forBusiness: "For Business",
    support: "Support",
    legal: "Legal",
  };

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Footer Settings</h1>
        <p className="text-gray-500 mt-2">
          Manage footer navigation links and sections
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="ml-3 text-gray-600">Loading footer settings...</p>
        </div>
      )}

      {!loading && (
        <>
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(footerData).map(([sectionKey, links]) => (
              <div
                key={sectionKey}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {sectionLabels[sectionKey]}
                </h2>

                {/* Links List */}
                <div className="space-y-3 mb-6">
                  {links.map((link, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                      {editingSection === sectionKey && editingIndex === idx ? (
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            placeholder="Link label"
                            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="text"
                            value={editHref}
                            onChange={(e) => setEditHref(e.target.value)}
                            placeholder="Link href"
                            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="flex-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingSection(null);
                                setEditingIndex(null);
                              }}
                              className="flex-1 px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {link.label}
                            </p>
                            <p className="text-xs text-gray-500">{link.href}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleEditLink(sectionKey, idx, link)
                              }
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLink(sectionKey, idx)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New Link */}
                {editingSection !== sectionKey && (
                  <button
                    onClick={() => {
                      setEditingSection(sectionKey);
                      setEditingIndex(null);
                      setEditLabel("");
                      setEditHref("");
                    }}
                    className="w-full px-4 py-2 border border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Link
                  </button>
                )}

                {/* Add New Link Form */}
                {editingSection === sectionKey && editingIndex === null && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                    <h3 className="font-medium text-gray-900 text-sm">
                      Add New Link
                    </h3>
                    <input
                      type="text"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      placeholder="Link label"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={editHref}
                      onChange={(e) => setEditHref(e.target.value)}
                      placeholder="Link href (e.g., /help)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddLink(sectionKey)}
                        className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 font-medium"
                      >
                        Add Link
                      </button>
                      <button
                        onClick={() => {
                          setEditingSection(null);
                          setEditLabel("");
                          setEditHref("");
                        }}
                        className="flex-1 px-3 py-2 bg-gray-400 text-white rounded-lg text-sm hover:bg-gray-500 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save All Changes
                </>
              )}
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminFooterSettings;
