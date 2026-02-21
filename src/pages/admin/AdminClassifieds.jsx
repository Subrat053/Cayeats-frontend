import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Home,
  Tag,
  DollarSign,
  Image,
  MapPin,
  Calendar,
  MoreVertical,
  TrendingUp,
  AlertTriangle,
  Info,
  Loader,
} from "lucide-react";

const AdminClassifieds = () => {
  const [activeTab, setActiveTab] = useState("listings");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pricing configuration
  const [adPricing] = useState({
    classifiedBasic: {
      monthly: 50,
      label: "Basic Listing",
      desc: "Standard text + 3 images",
    },
    classifiedFeatured: {
      monthly: 120,
      label: "Featured Listing",
      desc: "Top placement + badge + 10 images",
    },
    classifiedPremium: {
      monthly: 250,
      label: "Premium Listing",
      desc: "Homepage spotlight + video + unlimited images",
    },
  });

  // Fetch listings from localStorage or API
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        // Check localStorage first
        const storedListings = localStorage.getItem("classifiedListings");
        if (storedListings) {
          setListings(JSON.parse(storedListings));
        } else {
          // Mock data as fallback
          const mockListings = [
            {
              id: 1,
              title: "Beachfront Restaurant Space for Lease",
              category: "real-estate",
              type: "lease",
              author: "Island Properties Ltd",
              price: "$3,500/mo",
              location: "Seven Mile Beach",
              status: "active",
              posted: "2025-02-10",
              views: 482,
              image: true,
            },
            {
              id: 2,
              title: "Commercial Kitchen Equipment - Full Set",
              category: "products",
              type: "sale",
              author: "Kitchen Depot CI",
              price: "$12,000",
              location: "George Town",
              status: "active",
              posted: "2025-02-12",
              views: 218,
              image: true,
            },
            {
              id: 3,
              title: "Prime Food Truck Location Available",
              category: "real-estate",
              type: "lease",
              author: "CI Commercial RE",
              price: "$800/mo",
              location: "Camana Bay",
              status: "pending",
              posted: "2025-02-14",
              views: 0,
              image: true,
            },
            {
              id: 4,
              title: "Industrial Refrigerator - Like New",
              category: "products",
              type: "sale",
              author: "Cool Solutions KY",
              price: "$2,500",
              location: "West Bay",
              status: "active",
              posted: "2025-02-08",
              views: 156,
              image: false,
            },
            {
              id: 5,
              title: "Restaurant for Sale - Turnkey Operation",
              category: "real-estate",
              type: "sale",
              author: "Cayman Business Brokers",
              price: "$350,000",
              location: "George Town",
              status: "active",
              posted: "2025-02-05",
              views: 891,
              image: true,
            },
            {
              id: 6,
              title: "POS System - 3 Terminals",
              category: "products",
              type: "sale",
              author: "TechServices CI",
              price: "$4,200",
              location: "George Town",
              status: "expired",
              posted: "2025-01-15",
              views: 312,
              image: true,
            },
            {
              id: 7,
              title: "Commercial Space - Downtown",
              category: "real-estate",
              type: "lease",
              author: "Downtown Realty",
              price: "$5,800/mo",
              location: "George Town",
              status: "pending",
              posted: "2025-02-15",
              views: 0,
              image: true,
            },
          ];
          setListings(mockListings);
          localStorage.setItem(
            "classifiedListings",
            JSON.stringify(mockListings),
          );
        }
      } catch (err) {
        console.error("Failed to load listings:", err);
        setError("Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Dynamically calculate categories from listings
  useEffect(() => {
    const dynamicCategories = [
      {
        name: "Real Estate - Commercial Lease",
        icon: Home,
        count: listings.filter(
          (l) => l.category === "real-estate" && l.type === "lease",
        ).length,
      },
      {
        name: "Real Estate - Business Sale",
        icon: Home,
        count: listings.filter(
          (l) => l.category === "real-estate" && l.type === "sale",
        ).length,
      },
      {
        name: "Products - Kitchen Equipment",
        icon: Tag,
        count: listings.filter(
          (l) =>
            l.category === "products" &&
            l.title.toLowerCase().includes("kitchen"),
        ).length,
      },
      {
        name: "Products - POS & Technology",
        icon: Tag,
        count: listings.filter(
          (l) =>
            l.category === "products" && l.title.toLowerCase().includes("pos"),
        ).length,
      },
      {
        name: "Products - Furniture & Fixtures",
        icon: Tag,
        count: listings.filter(
          (l) =>
            l.category === "products" &&
            l.title.toLowerCase().includes("furniture"),
        ).length,
      },
      {
        name: "Products - Vehicles & Fleet",
        icon: Tag,
        count: listings.filter(
          (l) =>
            l.category === "products" &&
            l.title.toLowerCase().includes("vehicle"),
        ).length,
      },
    ];
    setCategories(dynamicCategories);
  }, [listings]);

  // Handle approve/reject listing
  const handleApproveListing = (id) => {
    const updated = listings.map((l) =>
      l.id === id ? { ...l, status: "active" } : l,
    );
    setListings(updated);
    localStorage.setItem("classifiedListings", JSON.stringify(updated));
  };

  const handleRejectListing = (id) => {
    const updated = listings.map((l) =>
      l.id === id ? { ...l, status: "rejected" } : l,
    );
    setListings(updated);
    localStorage.setItem("classifiedListings", JSON.stringify(updated));
  };

  const handleDeleteListing = (id) => {
    if (window.confirm("Delete this listing?")) {
      const updated = listings.filter((l) => l.id !== id);
      setListings(updated);
      localStorage.setItem("classifiedListings", JSON.stringify(updated));
    }
  };

  const calcSemiAnnual = (m) => Math.round(m * 6 * 0.95);
  const calcAnnual = (m) => Math.round(m * 12 * 0.9);

  const statusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      expired: "bg-gray-100 text-gray-600",
      rejected: "bg-red-100 text-red-700",
    };
    const icons = {
      active: CheckCircle,
      pending: Clock,
      expired: XCircle,
      rejected: AlertTriangle,
    };
    const Icon = icons[status] || Clock;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
      >
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const categoryBadge = (cat) => (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cat === "real-estate" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}
    >
      {cat === "real-estate" ? (
        <Home className="w-3 h-3" />
      ) : (
        <Tag className="w-3 h-3" />
      )}
      {cat === "real-estate" ? "Real Estate" : "Product"}
    </span>
  );

  const filteredListings = listings
    .filter((l) => statusFilter === "all" || l.status === statusFilter)
    .filter((l) => categoryFilter === "all" || l.category === categoryFilter)
    .filter(
      (l) =>
        !searchQuery ||
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.location.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const tabs = [
    { id: "listings", label: "All Listings", count: listings.length },
    {
      id: "pending",
      label: "Pending Approval",
      count: listings.filter((l) => l.status === "pending").length,
    },
    { id: "pricing", label: "Ad Pricing" },
    { id: "categories", label: "Categories" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Classifieds &amp; Product Ads
          </h1>
          <p className="text-gray-600 mt-1">
            Manage real estate and general product classified listings
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8 bg-white rounded-xl border border-gray-200">
          <Loader className="w-5 h-5 text-primary animate-spin mr-2" />
          <span className="text-gray-600">Loading listings...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Listings",
              value: listings.length,
              icon: ShoppingBag,
              color: "bg-primary/10 text-primary",
            },
            {
              label: "Active",
              value: listings.filter((l) => l.status === "active").length,
              icon: CheckCircle,
              color: "bg-green-100 text-green-600",
            },
            {
              label: "Pending Review",
              value: listings.filter((l) => l.status === "pending").length,
              icon: Clock,
              color: "bg-yellow-100 text-yellow-600",
            },
            {
              label: "Total Views",
              value: listings.reduce((s, l) => s + l.views, 0).toLocaleString(),
              icon: TrendingUp,
              color: "bg-blue-100 text-blue-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 border-b-2 transition-colors text-sm font-medium ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"}`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* LISTINGS TAB */}
      {(activeTab === "listings" || activeTab === "pending") && (
        <div className="space-y-4">
          {activeTab === "listings" && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-sm">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-sm bg-transparent focus:outline-none w-full"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="all">All Categories</option>
                <option value="real-estate">Real Estate</option>
                <option value="products">Products</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Listing
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Location
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                      Views
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(activeTab === "pending"
                    ? listings.filter((l) => l.status === "pending")
                    : filteredListings
                  ).map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            {listing.image ? (
                              <Image className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ShoppingBag className="w-5 h-5 text-gray-300" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {listing.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {listing.author} · {listing.posted}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {categoryBadge(listing.category)}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {listing.price}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {listing.location}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">
                        {listing.views}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {statusBadge(listing.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          {listing.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApproveListing(listing.id)}
                                className="p-1.5 bg-green-50 hover:bg-green-100 rounded-lg text-green-600"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRejectListing(listing.id)}
                                className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-500"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteListing(listing.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRICING TAB */}
      {activeTab === "pricing" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              Classified Ad Pricing
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Monthly, Semi-Annual (−5%), Annual (−10%). Managed in Pricing
              Settings.
            </p>
          </div>
          <div className="p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Tier
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                    Monthly
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                    Semi-Annual
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                    Annual
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Features
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Object.entries(adPricing).map(([key, ad]) => (
                  <tr key={key}>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {ad.label}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-3 py-1 bg-gray-100 rounded-lg font-medium">
                        ${ad.monthly}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg font-medium">
                        ${calcSemiAnnual(ad.monthly)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg font-medium">
                        ${calcAnnual(ad.monthly)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {ad.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Listing Categories
              </h3>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary/90">
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {categories.length > 0 ? (
                categories.map((cat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <cat.icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{cat.name}</p>
                        <p className="text-xs text-gray-500">
                          {cat.count} active listing{cat.count !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No categories found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <strong>Classifieds &amp; Product Ads</strong> allow users to post
          real estate listings and general product ads, similar to a classifieds
          marketplace. All listings are reviewed before going live. Categories
          and counts are now calculated dynamically from actual listings.
          Pricing follows the standard model: Monthly, Semi-Annual (−5%), Annual
          (−10%).
        </div>
      </div>
    </div>
  );
};

export default AdminClassifieds;
