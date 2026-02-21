import { useState, useEffect } from "react";
import {
  Database,
  Download,
  Users,
  Store,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Tag,
  BarChart3,
  FileSpreadsheet,
  CheckCircle,
  Info,
  Loader,
} from "lucide-react";
import { getAllRestaurants } from "../../api/adminService";

const AdminCRM = () => {
  const [activeTab, setActiveTab] = useState("contacts");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch restaurants and users (you may need to add a user endpoint)
        const restaurantsData = await getAllRestaurants();
        const restaurants = Array.isArray(restaurantsData)
          ? restaurantsData
          : restaurantsData?.data || [];

        // Transform restaurant data to match contact format
        const formattedContacts = restaurants.map((r) => ({
          id: r._id || r.id,
          name: r.fullName,
          email: r.email,
          phone: r.phone,
          type: "restaurant",
          location: r.location || "Not specified",
          lastActive: new Date(r.updatedAt || r.lastActive)
            .toISOString()
            .split("T")[0],
          tier: r.subscriptionTier || "Basic",
          status: r.status === "active" ? "active" : "inactive",
        }));

        setContacts(formattedContacts);
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
        setError("Failed to load contacts. Please try again.");
        // Fallback to empty for now
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Filter contacts based on type and search
  const filteredContacts = contacts.filter((c) => {
    const matchesType = typeFilter === "all" || c.type === typeFilter;
    const matchesSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Calculate dynamic counts for export templates
  const getTemplateData = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeRestaurants = contacts.filter(
      (c) => c.type === "restaurant" && c.status === "active",
    );
    const inactiveUsers = contacts.filter(
      (c) => c.type === "user" && new Date(c.lastActive) < thirtyDaysAgo,
    );

    return {
      subscribers: Math.ceil(contacts.length * 0.7), // Assuming 70% opted in
      activeRestaurants: activeRestaurants.length,
      inactiveUsers: inactiveUsers.length,
    };
  };

  const templateData = getTemplateData();

  const handleExportCSV = (data = filteredContacts) => {
    if (!data.length) {
      alert("No contacts to export");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Type",
      "Location",
      "Last Active",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...data.map(
        (c) =>
          `"${c.name}","${c.email}","${c.phone}","${c.type}","${c.location}","${c.lastActive}","${c.status}"`,
      ),
    ].join("\n");

    downloadFile(csvContent, "contacts.csv", "text/csv");
  };

  const handleExportJSON = (data = filteredContacts) => {
    if (!data.length) {
      alert("No contacts to export");
      return;
    }

    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, "contacts.json", "application/json");
  };

  const downloadFile = (content, filename, type) => {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:${type};charset=utf-8,${encodeURIComponent(content)}`,
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            CRM &amp; Data Export
          </h1>
          <p className="text-gray-600 mt-1">
            Manage contacts and export data for newsletters and external CRM
            tools
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCSV()}
            disabled={loading || !filteredContacts.length}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 text-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => handleExportJSON()}
            disabled={loading || !filteredContacts.length}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 text-sm"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Contacts",
            value: contacts.length,
            icon: Database,
            color: "bg-primary/10 text-primary",
          },
          {
            label: "Restaurants",
            value: contacts.filter((c) => c.type === "restaurant").length,
            icon: Store,
            color: "bg-orange-100 text-orange-600",
          },
          {
            label: "Users",
            value: contacts.filter((c) => c.type === "user").length,
            icon: Users,
            color: "bg-indigo-100 text-indigo-700",
          },
          {
            label: "Active (30d)",
            value: contacts.filter((c) => c.status === "active").length,
            icon: CheckCircle,
            color: "bg-green-100 text-green-600",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-4"
          >
            <div className={`p-2 rounded-lg ${stat.color} inline-flex mb-2`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter & Search */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm bg-transparent focus:outline-none w-full"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="all">All Types</option>
          <option value="user">Users Only</option>
          <option value="restaurant">Restaurants Only</option>
        </select>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="flex items-center justify-center py-8 bg-white rounded-xl border border-gray-200">
          <Loader className="w-5 h-5 text-primary animate-spin mr-2" />
          <span className="text-gray-600">Loading contacts...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Contacts Table */}
      {!loading && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {filteredContacts.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Phone
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Location
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Last Active
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {contact.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {contact.email}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {contact.phone}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${contact.type === "restaurant" ? "bg-orange-100 text-orange-700" : "bg-indigo-100 text-indigo-700"}`}
                        >
                          {contact.type === "restaurant" ? (
                            <Store className="w-3 h-3" />
                          ) : (
                            <Users className="w-3 h-3" />
                          )}
                          {contact.type === "restaurant"
                            ? "Restaurant"
                            : "User"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {contact.location}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {contact.lastActive}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${contact.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                        >
                          {contact.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No contacts found matching your search criteria</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Export Templates */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Quick Export Templates
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: "All Restaurants",
              desc: "Export all active restaurants for outreach",
              count: contacts.filter(
                (c) => c.type === "restaurant" && c.status === "active",
              ).length,
              action: () =>
                handleExportJSON(
                  contacts.filter(
                    (c) => c.type === "restaurant" && c.status === "active",
                  ),
                ),
            },
            {
              title: "Active Restaurants (30d)",
              desc: "Restaurants with activity in last 30 days",
              count: contacts.filter((c) => {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return (
                  c.type === "restaurant" &&
                  new Date(c.lastActive) >= thirtyDaysAgo
                );
              }).length,
              action: () => {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                handleExportJSON(
                  contacts.filter(
                    (c) =>
                      c.type === "restaurant" &&
                      new Date(c.lastActive) >= thirtyDaysAgo,
                  ),
                );
              },
            },
            {
              title: "All Users Export",
              desc: "Export user contacts for external CRM integration",
              count: contacts.filter((c) => c.type === "user").length,
              action: () =>
                handleExportJSON(contacts.filter((c) => c.type === "user")),
            },
          ].map((tmpl, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900">{tmpl.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{tmpl.desc}</p>
              <p className="text-xs text-gray-500 mt-2">
                {tmpl.count} contacts
              </p>
              <button
                onClick={tmpl.action}
                disabled={tmpl.count === 0}
                className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 disabled:bg-gray-400"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <strong>CRM Data:</strong> Export contacts as CSV or JSON to import
          into external CRM tools (Mailchimp, HubSpot, etc.) for newsletters and
          marketing campaigns. Data is calculated dynamically based on current
          active records.
        </div>
      </div>
    </div>
  );
};

export default AdminCRM;
