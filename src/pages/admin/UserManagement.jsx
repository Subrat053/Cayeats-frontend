import { useState, useEffect } from "react";
import { Search, User, Store, Shield, Mail, Trash2, Ban } from "lucide-react";
import { getAllUsers } from "../../api/adminService";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const stats = {
    total: users.length,
    customers: users.filter((u) => u.role === "customer").length,
    restaurants: users.filter((u) => u.role === "restaurant").length,
  };

  const getRoleBadge = (role) => {
    const map = {
      customer: {
        bg: "bg-gray-100 text-gray-700",
        label: "Customer",
        icon: User,
      },
      restaurant: {
        bg: "bg-blue-100 text-blue-700",
        label: "Restaurant",
        icon: Store,
      },
      admin: { bg: "bg-red-100 text-red-700", label: "Admin", icon: Shield },
    };
    const cfg = map[role] || map.customer;
    const Icon = cfg.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg}`}
      >
        <Icon className="w-3 h-3" /> {cfg.label}
      </span>
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">
          View and manage all registered users
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: stats.total, color: "text-gray-900" },
          {
            label: "Customers",
            value: stats.customers,
            color: "text-blue-600",
          },
          {
            label: "Restaurants",
            value: stats.restaurants,
            color: "text-orange-600",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white p-4 rounded-xl border border-gray-200"
          >
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="restaurant">Restaurant Owners</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                          {u.fullName?.[0] || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {u.fullName}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(u.role)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
