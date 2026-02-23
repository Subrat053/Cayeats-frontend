import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Phone,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { getOrders, updateOrderStatus } from "../../api/restaurantService";

const STATUS_CONFIG = {
  Pending: {
    color: "bg-gray-100 text-gray-700",
    icon: Clock,
    dot: "bg-gray-400",
  },
  Preparing: {
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
    dot: "bg-yellow-400",
  },
  Ready: {
    color: "bg-blue-100 text-blue-700",
    icon: Package,
    dot: "bg-blue-400",
  },
  Delivered: {
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
    dot: "bg-green-400",
  },
  Cancelled: {
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
    dot: "bg-red-400",
  },
};

const NEXT_STATUS = {
  Pending: "Preparing",
  Preparing: "Ready",
  Ready: "Delivered",
};

const DashboardOrders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    today: 0,
    preparing: 0,
    ready: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeframe, setTimeframe] = useState("today");
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders({ status: filterStatus, timeframe });
      setOrders(data?.orders || []);
      setStats(
        data?.stats || { today: 0, preparing: 0, ready: 0, totalRevenue: 0 },
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, timeframe]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: updated.status } : o,
        ),
      );
      // refresh stats
      fetchOrders();
    } catch (err) {
      setError("Failed to update status: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchTerm) return true;
    return (
      o._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const isUrgent = (order) =>
    order.status === "Preparing" &&
    new Date() - new Date(order.createdAt) > 30 * 60 * 1000;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500 mt-1">Track and manage incoming orders</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Today's Orders",
            value: stats.today,
            icon: Package,
            bg: "bg-blue-100",
            color: "text-blue-600",
          },
          {
            label: "Preparing",
            value: stats.preparing,
            icon: Clock,
            bg: "bg-yellow-100",
            color: "text-yellow-600",
          },
          {
            label: "Ready",
            value: stats.ready,
            icon: CheckCircle,
            bg: "bg-green-100",
            color: "text-green-600",
          },
          {
            label: "Revenue",
            value: `$${stats.totalRevenue?.toFixed(2)}`,
            icon: Truck,
            bg: "bg-purple-100",
            color: "text-purple-600",
          },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
              <div className={`p-2 ${bg} rounded-lg`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
            />
          </div>
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
          >
            {[
              "all",
              "Pending",
              "Preparing",
              "Ready",
              "Delivered",
              "Cancelled",
            ].map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Orders" : s}
              </option>
            ))}
          </select>
          {/* Timeframe */}
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
          >
            {[
              { value: "today", label: "Today" },
              { value: "yesterday", label: "Yesterday" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
            ].map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-medium text-gray-900 mb-1">No Orders Found</h3>
          <p className="text-sm text-gray-500">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filters."
              : "No orders yet for this timeframe."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
            const StatusIcon = config.icon;
            const urgent = isUrgent(order);
            const expanded = expandedId === order._id;
            const nextStatus = NEXT_STATUS[order.status];

            return (
              <div
                key={order._id}
                className={`bg-white rounded-xl border-2 transition-all ${
                  urgent ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
              >
                {/* Order Header */}
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`p-2 rounded-lg ${config.color.split(" ")[0]}`}
                    >
                      <StatusIcon
                        className={`w-4 h-4 ${config.color.split(" ")[1]}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 text-sm">
                          #{order._id?.slice(-6).toUpperCase()}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.color}`}
                        >
                          {order.status}
                        </span>
                        {urgent && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-500 text-white animate-pulse">
                            URGENT
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {order.customerName} · ${order.totalAmount?.toFixed(2)}{" "}
                        · {order.items?.length} item
                        {order.items?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>

                    {/* Next status button */}
                    {nextStatus && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(order._id, nextStatus)
                        }
                        disabled={updatingId === order._id}
                        className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 disabled:opacity-50"
                      >
                        {updatingId === order._id
                          ? "..."
                          : `Mark ${nextStatus}`}
                      </button>
                    )}

                    {/* Expand toggle */}
                    <button
                      onClick={() => setExpandedId(expanded ? null : order._id)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {expanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Items */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 text-sm">
                          Order Items
                        </h4>
                        <div className="space-y-1.5">
                          {order.items?.map((item, i) => (
                            <div
                              key={i}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-gray-600">
                                {item.quantity}× {item.name}
                              </span>
                              <span className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                          <div className="border-t border-gray-100 pt-1.5 flex justify-between font-semibold text-sm">
                            <span>Total</span>
                            <span>${order.totalAmount?.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Delivery info */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 text-sm">
                          Delivery Details
                        </h4>
                        <div className="space-y-1.5 text-sm text-gray-600">
                          {order.deliveryProvider && (
                            <div className="flex items-center gap-2">
                              <Truck className="w-3.5 h-3.5 shrink-0" />
                              <span>{order.deliveryProvider}</span>
                            </div>
                          )}
                          {order.deliveryAddress && (
                            <p className="text-gray-600">
                              📍 {order.deliveryAddress}
                            </p>
                          )}
                          {order.customerPhone && (
                            <p className="text-gray-600">
                              📞 {order.customerPhone}
                            </p>
                          )}
                          {order.customerNotes && (
                            <p className="text-gray-600 bg-yellow-50 border border-yellow-100 rounded p-2 text-xs mt-2">
                              📝 {order.customerNotes}
                            </p>
                          )}
                          {order.estimatedDelivery && (
                            <p className="text-gray-500 text-xs">
                              ETA:{" "}
                              {new Date(
                                order.estimatedDelivery,
                              ).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                      {order.customerPhone && (
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                        >
                          <Phone className="w-3.5 h-3.5" /> Call Customer
                        </a>
                      )}
                      {order.status !== "Cancelled" &&
                        order.status !== "Delivered" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order._id, "Cancelled")
                            }
                            disabled={updatingId === order._id}
                            className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 disabled:opacity-50"
                          >
                            Cancel Order
                          </button>
                        )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Info notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-3">
        <Truck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-blue-900">
            Multi-Platform Integration
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            Orders from all your connected delivery platforms appear here. Use
            the status buttons to track orders from Pending → Preparing → Ready
            → Delivered.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOrders;
