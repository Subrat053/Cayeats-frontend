import { useState, useEffect } from "react";
import {
  Save,
  Plus,
  Trash2,
  Edit2,
  X,
  Loader,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {
  getFooterSettings,
  updateFooterSettings,
  getContactSettings,
  updateContactSettings,
} from "../../api/adminService";
import { logger } from "../../utils/logger";

const AdminFooterSettings = () => {
  const [footerData, setFooterData] = useState({
    discover: [],
    forBusiness: [],
    support: [],
    legal: [],
  });

  const [contactData, setContactData] = useState({
    email: "",
    phone: "",
    address: "",
  });

  const [editingSection, setEditingSection] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [editHref, setEditHref] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [tempContactData, setTempContactData] = useState({
    email: "",
    phone: "",
    address: "",
  });

  // Load footer and contact data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getFooterSettings();
        logger.debug("Raw footer data from API:", data);

        if (data && typeof data === "object") {
          // Ensure all four sections exist with proper structure
          const completeFooterData = {
            discover: Array.isArray(data.discover) ? data.discover : [],
            forBusiness: Array.isArray(data.forBusiness)
              ? data.forBusiness
              : [],
            support: Array.isArray(data.support) ? data.support : [],
            legal: Array.isArray(data.legal) ? data.legal : [],
          };
          logger.debug("Initialized footer data:", completeFooterData);
          setFooterData(completeFooterData);

          // Load contact info
          if (data.contact) {
            setContactData({
              email: data.contact.email || "",
              phone: data.contact.phone || "",
              address: data.contact.address || "",
            });
            setTempContactData({
              email: data.contact.email || "",
              phone: data.contact.phone || "",
              address: data.contact.address || "",
            });
          }
        } else {
          logger.warn("Invalid footer data received:", data);
          setMessage({
            type: "error",
            text: "Invalid footer data received from server",
          });
        }
      } catch (error) {
        logger.error("Error loading settings:", error);
        setMessage({
          type: "error",
          text: "Failed to load settings: " + error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEditLink = (section, index, link) => {
    setEditingSection(section);
    setEditingIndex(index);
    setEditLabel(link.label);
    setEditHref(link.href);
  };

  const handleSaveEdit = async () => {
    if (!editLabel.trim() || !editHref.trim()) {
      setMessage({ type: "error", text: "Label and href are required" });
      return;
    }

    logger.debug(
      "Editing link in section:",
      editingSection,
      "at index:",
      editingIndex,
    );

    const updatedData = {
      discover:
        editingSection === "discover"
          ? footerData.discover.map((link, idx) =>
              idx === editingIndex
                ? { label: editLabel, href: editHref }
                : link,
            )
          : footerData.discover,
      forBusiness:
        editingSection === "forBusiness"
          ? footerData.forBusiness.map((link, idx) =>
              idx === editingIndex
                ? { label: editLabel, href: editHref }
                : link,
            )
          : footerData.forBusiness,
      support:
        editingSection === "support"
          ? footerData.support.map((link, idx) =>
              idx === editingIndex
                ? { label: editLabel, href: editHref }
                : link,
            )
          : footerData.support,
      legal:
        editingSection === "legal"
          ? footerData.legal.map((link, idx) =>
              idx === editingIndex
                ? { label: editLabel, href: editHref }
                : link,
            )
          : footerData.legal,
    };

    try {
      setSaving(true);
      await updateFooterSettings(updatedData);
      setFooterData(updatedData);
      setEditingSection(null);
      setEditingIndex(null);
      setEditLabel("");
      setEditHref("");
      setMessage({
        type: "success",
        text: "Link updated and saved successfully!",
      });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      logger.error("Error saving edit:", error);
      setMessage({
        type: "error",
        text: "Failed to save edit: " + error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLink = async (section, index) => {
    logger.debug("Deleting link from section:", section, "at index:", index);

    const updatedData = {
      discover:
        section === "discover"
          ? footerData.discover.filter((_, idx) => idx !== index)
          : footerData.discover,
      forBusiness:
        section === "forBusiness"
          ? footerData.forBusiness.filter((_, idx) => idx !== index)
          : footerData.forBusiness,
      support:
        section === "support"
          ? footerData.support.filter((_, idx) => idx !== index)
          : footerData.support,
      legal:
        section === "legal"
          ? footerData.legal.filter((_, idx) => idx !== index)
          : footerData.legal,
    };

    try {
      setSaving(true);
      await updateFooterSettings(updatedData);
      setFooterData(updatedData);
      setMessage({
        type: "success",
        text: "Link deleted and saved successfully!",
      });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      logger.error("Error deleting link:", error);
      setMessage({
        type: "error",
        text: "Failed to delete link: " + error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddLink = async (section) => {
    if (!editLabel.trim() || !editHref.trim()) {
      setMessage({ type: "error", text: "Label and href are required" });
      return;
    }

    logger.debug("Adding link to section:", section);
    logger.debug("Current footerData before add:", footerData);

    // Explicitly build the updated data to ensure all sections are preserved
    const updatedData = {
      discover:
        section === "discover"
          ? [
              ...(footerData.discover || []),
              { label: editLabel, href: editHref },
            ]
          : footerData.discover || [],
      forBusiness:
        section === "forBusiness"
          ? [
              ...(footerData.forBusiness || []),
              { label: editLabel, href: editHref },
            ]
          : footerData.forBusiness || [],
      support:
        section === "support"
          ? [
              ...(footerData.support || []),
              { label: editLabel, href: editHref },
            ]
          : footerData.support || [],
      legal:
        section === "legal"
          ? [...(footerData.legal || []), { label: editLabel, href: editHref }]
          : footerData.legal || [],
    };

    logger.debug("Updated data to send:", updatedData);

    try {
      setSaving(true);
      await updateFooterSettings(updatedData);
      setFooterData(updatedData);
      setEditLabel("");
      setEditHref("");
      setEditingSection(null);
      setMessage({
        type: "success",
        text: "Link added and saved successfully!",
      });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      logger.error("Error adding link:", error);
      setMessage({
        type: "error",
        text: "Failed to add link: " + error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  // Contact Info Handlers
  const handleSaveContact = async () => {
    if (!tempContactData.email.trim() || !tempContactData.phone.trim()) {
      setMessage({ type: "error", text: "Email and phone are required" });
      return;
    }

    try {
      setSaving(true);
      await updateContactSettings(tempContactData);
      setContactData(tempContactData);
      setEditingContact(false);
      setMessage({
        type: "success",
        text: "Contact information updated successfully!",
      });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      logger.error("Error saving contact:", error);
      setMessage({
        type: "error",
        text: "Failed to save contact: " + error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelContact = () => {
    setTempContactData(contactData);
    setEditingContact(false);
  };

  const handleEditContactClick = () => {
    setTempContactData(contactData);
    setEditingContact(true);
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
          Manage footer navigation links, sections, and contact information
        </p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💾 <strong>Auto-save enabled:</strong> All changes (add, edit,
            delete) are saved immediately and reflected on the website footer in
            real-time.
          </p>
        </div>
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

          {/* Contact Information Section */}
          <div className="mb-8 bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Information
              </h2>
            </div>

            <div className="p-6">
              {!editingContact ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    {/* Email Display */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                        <Mail className="w-4 h-4 text-orange-500" />
                        Email
                      </div>
                      <p className="text-gray-900 font-mono text-sm break-all">
                        {contactData.email || "Not set"}
                      </p>
                    </div>

                    {/* Phone Display */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                        <Phone className="w-4 h-4 text-orange-500" />
                        Phone
                      </div>
                      <p className="text-gray-900 font-mono text-sm">
                        {contactData.phone || "Not set"}
                      </p>
                    </div>

                    {/* Address Display */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        Address
                      </div>
                      <p className="text-gray-900 text-sm">
                        {contactData.address || "Not set"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleEditContactClick}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Contact Information
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={tempContactData.email}
                      onChange={(e) =>
                        setTempContactData({
                          ...tempContactData,
                          email: e.target.value,
                        })
                      }
                      placeholder="info@cayeats.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={tempContactData.phone}
                      onChange={(e) =>
                        setTempContactData({
                          ...tempContactData,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+1 (345) 999-9999"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={tempContactData.address}
                      onChange={(e) =>
                        setTempContactData({
                          ...tempContactData,
                          address: e.target.value,
                        })
                      }
                      placeholder="George Town, Grand Cayman, Cayman Islands"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveContact}
                      disabled={saving}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelContact}
                      disabled={saving}
                      className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg font-bold hover:bg-gray-500 disabled:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Links Section */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              📊 Loaded Sections:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(footerData).map(([section, links]) => (
                <div key={section} className="text-xs">
                  <span className="font-medium text-gray-900">
                    {sectionLabels[section]}:
                  </span>
                  <span className="text-gray-600 ml-1">
                    {links?.length || 0} links
                  </span>
                </div>
              ))}
            </div>
          </div>

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
                  {links && links.length > 0 ? (
                    links.map((link, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        {editingSection === sectionKey &&
                        editingIndex === idx ? (
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={editLabel}
                              onChange={(e) => setEditLabel(e.target.value)}
                              placeholder="Link label"
                              className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            />
                            <input
                              type="text"
                              value={editHref}
                              onChange={(e) => setEditHref(e.target.value)}
                              placeholder="Link href"
                              className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleSaveEdit}
                                disabled={saving}
                                className="flex-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                              >
                                {saving && (
                                  <Loader className="w-3 h-3 animate-spin" />
                                )}
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
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">
                                {link.label}
                              </p>
                              <p className="text-xs text-gray-500 break-all">
                                {link.href}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
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
                                onClick={() =>
                                  handleDeleteLink(sectionKey, idx)
                                }
                                disabled={saving}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors disabled:text-red-300 disabled:cursor-not-allowed"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <p className="text-sm">No links added yet</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click "Add Link" to get started
                      </p>
                    </div>
                  )}
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
                        className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 font-bold"
                      >
                        Add Link
                      </button>
                      <button
                        onClick={() => {
                          setEditingSection(null);
                          setEditLabel("");
                          setEditHref("");
                        }}
                        className="flex-1 px-3 py-2 bg-gray-400 text-white rounded-lg text-sm hover:bg-gray-500 font-bold"
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
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminFooterSettings;
