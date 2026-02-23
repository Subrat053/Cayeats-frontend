import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { getBillingHistory } from "../../api/restaurantService";

const STATUS_CONFIG = {
  completed: { color: "text-green-600 bg-green-50", icon: CheckCircle },
  pending: { color: "text-yellow-600 bg-yellow-50", icon: Clock },
  failed: { color: "text-red-600 bg-red-50", icon: XCircle },
};

const DashboardBilling = () => {
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("transactions");
  const navigate = useNavigate();

  useEffect(() => {
    getBillingHistory()
      .then(setBilling)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );

  if (error)
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          Error: {error}
        </div>
      </div>
    );

  const {
    transactions = [],
    totalSpent = 0,
    pendingAmount = 0,
  } = billing?.data || billing || {};

  const activeServices = transactions.filter(
    (t) => t.status === "completed" && t.autoRenew && t.renewDate,
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Billing & Payments
          </h1>
          <p className="text-gray-500 mt-1">
            View your transaction history and manage subscriptions
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/subscription")}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium"
        >
          <CreditCard className="w-4 h-4" />
          Upgrade Plan
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900">
              ${totalSpent.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-gray-900">
              ${pendingAmount.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Processing</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-lg">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Active Services</p>
            <p className="text-2xl font-bold text-gray-900">
              {activeServices.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Auto-renewing</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <RefreshCw className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: "transactions", label: "Transaction History" },
            { key: "subscriptions", label: "Active Services" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Transactions */}
      {activeTab === "transactions" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Transaction History
          </h2>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No transactions yet</p>
              <button
                onClick={() => navigate("/dashboard/subscription")}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
              >
                View Plans
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((txn) => {
                const config =
                  STATUS_CONFIG[txn.status] || STATUS_CONFIG.pending;
                const StatusIcon = config.icon;
                return (
                  <div
                    key={txn._id}
                    className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                          <CreditCard className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 capitalize">
                            {txn.type?.replace(/_/g, " ")}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {txn.description}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                            <span>
                              {new Date(txn.createdAt).toLocaleDateString()}
                            </span>
                            {txn.paymentMethod && (
                              <span className="capitalize">
                                {txn.paymentMethod}
                              </span>
                            )}
                            {txn.stripeSessionId && (
                              <span className="text-blue-500">via Stripe</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-gray-900">
                          ${txn.amount?.toFixed(2)}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1 ${config.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {txn.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Active Services */}
      {activeTab === "subscriptions" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Active Services
          </h2>
          {activeServices.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <RefreshCw className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No active auto-renewing services</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeServices.map((service) => {
                const daysLeft = service.renewDate
                  ? Math.ceil(
                      (new Date(service.renewDate) - new Date()) /
                        (1000 * 60 * 60 * 24),
                    )
                  : null;
                return (
                  <div
                    key={service._id}
                    className="border border-gray-200 rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 capitalize">
                            {service.type?.replace(/_/g, " ")}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {service.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ${service.amount?.toFixed(2)}
                        </p>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      </div>
                    </div>
                    {daysLeft !== null && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{daysLeft} days until renewal</span>
                        </div>
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          Renews{" "}
                          {new Date(service.renewDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Stripe info */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-start gap-3">
        <CreditCard className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-gray-900">
            Secure Payment via Stripe
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            All payments are processed securely through Stripe. Your payment
            information is never stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardBilling;
