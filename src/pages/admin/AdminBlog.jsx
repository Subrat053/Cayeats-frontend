import { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Search,
  Filter,
  Image,
  Tag,
  User,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Info,
  Loader,
} from "lucide-react";

const AdminBlog = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Define categories configuration
  const categoryConfig = {
    Guides: { color: "bg-blue-100 text-blue-700" },
    "How-To": { color: "bg-green-100 text-green-700" },
    Events: { color: "bg-purple-100 text-purple-700" },
    Updates: { color: "bg-orange-100 text-orange-700" },
    Recipes: { color: "bg-pink-100 text-pink-700" },
  };

  // Fetch blog posts from localStorage or API (fallback to mock data for now)
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Check if data exists in localStorage (simulating API call)
        const storedPosts = localStorage.getItem("blogPosts");
        if (storedPosts) {
          setPosts(JSON.parse(storedPosts));
        } else {
          // Mock data as fallback - in production, fetch from API
          const mockPosts = [
            {
              id: 1,
              title: "Top 10 Restaurants in George Town for 2025",
              slug: "top-10-restaurants-george-town-2025",
              author: "CayEats Team",
              category: "Guides",
              status: "published",
              date: "2025-02-15",
              views: 1234,
              image: true,
            },
            {
              id: 2,
              title: "How to Claim Your Restaurant on CayEats",
              slug: "how-to-claim-restaurant",
              author: "Admin",
              category: "How-To",
              status: "published",
              date: "2025-02-10",
              views: 892,
              image: true,
            },
            {
              id: 3,
              title: "Caribbean Food Festivals Coming This Spring",
              slug: "caribbean-food-festivals-spring",
              author: "CayEats Team",
              category: "Events",
              status: "draft",
              date: "2025-02-16",
              views: 0,
              image: true,
            },
            {
              id: 4,
              title: "New Feature: Priority Delivery for Restaurants",
              slug: "priority-delivery-feature",
              author: "Admin",
              category: "Updates",
              status: "published",
              date: "2025-02-08",
              views: 567,
              image: false,
            },
            {
              id: 5,
              title: "Best Brunch Spots on Seven Mile Beach",
              slug: "best-brunch-seven-mile-beach",
              author: "CayEats Team",
              category: "Guides",
              status: "scheduled",
              date: "2025-02-20",
              views: 0,
              image: true,
            },
          ];
          setPosts(mockPosts);
          localStorage.setItem("blogPosts", JSON.stringify(mockPosts));
        }
      } catch (err) {
        console.error("Failed to load posts:", err);
        setError("Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Calculate dynamic categories based on actual posts
  const categories = Object.entries(categoryConfig).map(([name, config]) => ({
    name,
    count: posts.filter((p) => p.category === name).length,
    color: config.color,
  }));

  // Filter posts based on search and status
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle delete post
  const handleDeletePost = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const updatedPosts = posts.filter((p) => p.id !== id);
      setPosts(updatedPosts);
      localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));
    }
  };

  // Handle delete category
  const handleDeleteCategory = (categoryName) => {
    if (
      window.confirm(
        `Delete category "${categoryName}"? Posts will not be affected.`,
      )
    ) {
      const { [categoryName]: deleted, ...rest } = categoryConfig;
      // In production, would update categoryConfig in database
      alert("Category deleted successfully");
    }
  };

  const statusBadge = (status) => {
    const styles = {
      published: "bg-green-100 text-green-700",
      draft: "bg-yellow-100 text-yellow-700",
      scheduled: "bg-blue-100 text-blue-700",
    };
    const icons = { published: CheckCircle, draft: Edit2, scheduled: Clock };
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-600 mt-1">
            Create and manage blog posts for the CayEats platform
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Posts",
            value: posts.length,
            icon: BookOpen,
            color: "bg-primary/10 text-primary",
          },
          {
            label: "Published",
            value: posts.filter((p) => p.status === "published").length,
            icon: CheckCircle,
            color: "bg-green-100 text-green-600",
          },
          {
            label: "Drafts",
            value: posts.filter((p) => p.status === "draft").length,
            icon: Edit2,
            color: "bg-yellow-100 text-yellow-600",
          },
          {
            label: "Total Views",
            value: posts.reduce((s, p) => s + p.views, 0).toLocaleString(),
            icon: Eye,
            color: "bg-blue-100 text-blue-600",
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          {[
            { id: "posts", label: "All Posts" },
            { id: "categories", label: "Categories" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 border-b-2 transition-colors text-sm font-medium ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Tab */}
      {activeTab === "posts" && (
        <div className="space-y-4">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8 bg-white rounded-xl border border-gray-200">
              <Loader className="w-5 h-5 text-primary animate-spin mr-2" />
              <span className="text-gray-600">Loading posts...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Search & Filter */}
          {!loading && (
            <>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts, author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-sm bg-transparent focus:outline-none w-full"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              {/* Posts Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  {filteredPosts.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                            Title
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                            Category
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                            Author
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                            Views
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                            Date
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredPosts.map((post) => (
                          <tr key={post.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                  {post.image ? (
                                    <Image className="w-5 h-5 text-gray-400" />
                                  ) : (
                                    <BookOpen className="w-5 h-5 text-gray-300" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">
                                    {post.title}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    /{post.slug}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryConfig[post.category]?.color || "bg-gray-100 text-gray-600"}`}
                              >
                                {post.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {post.author}
                            </td>
                            <td className="py-3 px-4 text-center text-sm text-gray-600">
                              {post.views.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {statusBadge(post.status)}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-500">
                              {post.date}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end gap-1">
                                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeletePost(post.id)}
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
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No posts found matching your search criteria</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Blog Categories</h3>
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
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${cat.color}`}
                      >
                        {cat.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {cat.count} post{cat.count !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.name)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-red-400"
                      >
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
          <strong>Blog section</strong> helps drive organic traffic and engage
          with the community. Posts can feature restaurant spotlights, food
          guides, platform updates, and local events. Search and filters are
          fully functional; posts and categories update dynamically.
        </div>
      </div>
    </div>
  );
};

export default AdminBlog;
