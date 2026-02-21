import { useState } from "react";
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  Eye,
  Phone,
  MessageSquare,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const DashboardOrders = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("today");

  // Mock order data
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      customerName: "John Smith",
      customerPhone: "+1-345-123-4567",
      items: [
        { name: "Margherita Pizza", quantity: 1, price: 18.5 },
        { name: "Caesar Salad", quantity: 1, price: 12.0 },
      ],
      total: 30.5,
      status: "preparing",
      deliveryProvider: "DoorDash",
      estimatedDelivery: "2024-01-25T19:30:00",
      orderTime: "2024-01-25T18:45:00",
      customerNotes: "No onions please",
      deliveryAddress: "123 West Bay Road, George Town",
    },
    {
      id: "ORD-002",
      customerName: "Sarah Johnson",
      customerPhone: "+1-345-234-5678",
      items: [
        { name: "Fish & Chips", quantity: 2, price: 25.0 },
        { name: "Iced Tea", quantity: 2, price: 6.0 },
      ],
      total: 31.0,
      status: "ready",
      deliveryProvider: "Uber Eats",
      estimatedDelivery: "2024-01-25T19:15:00",
      orderTime: "2024-01-25T18:30:00",
      customerNotes: "Extra tartar sauce",
      deliveryAddress: "456 Seven Mile Beach, George Town",
    },
    {
      id: "ORD-003",
      customerName: "Mike Wilson",
      customerPhone: "+1-345-345-6789",
      items: [
        { name: "Jerk Chicken", quantity: 1, price: 22.0 },
        { name: "Rice & Peas", quantity: 1, price: 8.0 },
        { name: "Plantains", quantity: 1, price: 6.0 },
      ],
      total: 36.0,
      status: "delivered",
      deliveryProvider: "CayEats Local",
      estimatedDelivery: "2024-01-25T18:45:00",
      orderTime: "2024-01-25T18:00:00",
      customerNotes: "Mild spice level",
      deliveryAddress: "789 Eastern Avenue, George Town",
    },
    {
      id: "ORD-004",
      customerName: "Lisa Davis",
      customerPhone: "+1-345-456-7890",
      items: [
        { name: "Conch Fritters", quantity: 1, price: 15.0 },
        { name: "Cayman Style Fish", quantity: 1, price: 28.0 },
      ],
      total: 43.0,
      status: "cancelled",
      deliveryProvider: "Grubhub",
      estimatedDelivery: "2024-01-25T20:00:00",
      orderTime: "2024-01-25T19:00:00",
      customerNotes: "Customer cancelled due to long wait time",
      deliveryAddress: "321 South Church Street, George Town",
    },
  ]);

  const orderStatuses = [
    { value: "all", label: "All Orders" },
    { value: "preparing", label: "Preparing" },
    { value: "ready", label: "Ready for Pickup" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const timeframes = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "preparing":
        return "warning";
      case "ready":
        return "info";
      case "delivered":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "preparing":
        return Clock;
      case "ready":
        return Package;
      case "delivered":
        return CheckCircle;
      case "cancelled":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const orderStats = {
    today: orders.filter(
      (o) => new Date(o.orderTime).toDateString() === new Date().toDateString(),
    ).length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    totalRevenue: orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + o.total, 0),
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((orders) =>
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-1">
          Track and manage incoming orders from all delivery platforms
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <Card.Content className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today's Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orderStats.today}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Preparing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orderStats.preparing}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ready</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orderStats.ready}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${orderStats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <Card.Content className="pt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                icon={Search}
                placeholder="Search by order ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {orderStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </Select>
            <Select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
            >
              {timeframes.map((timeframe) => (
                <option key={timeframe.value} value={timeframe.value}>
                  {timeframe.label}
                </option>
              ))}
            </Select>
          </div>
        </Card.Content>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            const isUrgent =
              order.status === "preparing" &&
              new Date() - new Date(order.orderTime) > 30 * 60 * 1000; // 30 minutes

            return (
              <Card
                key={order.id}
                className={isUrgent ? "border-red-300 bg-red-50" : ""}
              >
                <Card.Content className="pt-4">
                  <div className="flex items-start justify-between">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <StatusIcon
                            className={`w-5 h-5 ${
                              order.status === "preparing"
                                ? "text-yellow-600"
                                : order.status === "ready"
                                  ? "text-blue-600"
                                  : order.status === "delivered"
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {order.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {order.customerName}
                          </p>
                        </div>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                        {isUrgent && (
                          <Badge variant="danger" className="animate-pulse">
                            URGENT
                          </Badge>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Order Details */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Order Items
                          </h4>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between text-sm"
                              >
                                <span>
                                  {item.quantity}x {item.name}
                                </span>
                                <span>${item.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Delivery Info */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Delivery Details
                          </h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4" />
                              <span>{order.deliveryProvider}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>
                                Ordered:{" "}
                                {new Date(order.orderTime).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>
                                ETA:{" "}
                                {new Date(
                                  order.estimatedDelivery,
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MessageSquare className="w-4 h-4 mt-0.5" />
                              <span className="break-words">
                                {order.customerNotes}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="ml-6 flex flex-col gap-2">
                      <Button variant="outline" size="sm" icon={Phone}>
                        Call Customer
                      </Button>

                      {order.status === "preparing" && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            handleUpdateOrderStatus(order.id, "ready")
                          }
                        >
                          Mark Ready
                        </Button>
                      )}

                      {order.status === "ready" && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleUpdateOrderStatus(order.id, "delivered")
                          }
                        >
                          Mark Delivered
                        </Button>
                      )}

                      <Button variant="ghost" size="sm" icon={Eye}>
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Customer Address */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Delivery Address:</strong> {order.deliveryAddress}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Contact:</strong> {order.customerPhone}
                    </p>
                  </div>
                </Card.Content>
              </Card>
            );
          })
        ) : (
          <Card>
            <Card.Content className="pt-8 pb-8 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-1">
                No Orders Found
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "No orders for the selected timeframe."}
              </p>
            </Card.Content>
          </Card>
        )}
      </div>

      {/* Integration Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <Card.Content className="pt-4">
          <div className="flex gap-3">
            <Truck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">
                Multi-Platform Integration
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                This dashboard consolidates orders from all your connected
                delivery platforms. Order status updates are automatically
                synced with each delivery provider. For platform-specific
                features (like menu updates), use the respective provider's
                merchant portal.
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default DashboardOrders;
