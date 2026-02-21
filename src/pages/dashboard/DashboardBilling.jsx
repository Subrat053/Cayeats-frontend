import { useState, useEffect } from "react";
import {
  CreditCard,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import {
  getBillingHistory,
  toggleAutoRenew,
} from "../../api/restaurantService";

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
  } = billing || {};

  // Active services = completed transactions with autoRenew
  const activeServices = transactions.filter(
    (t) => t.status === "completed" && t.autoRenew && t.renewDate,
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Billing & Purchases
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your subscriptions and view transaction history
        </p>
      </div>

      {/* Summary Cards - real data */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900">${totalSpent}</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-gray-900">${pendingAmount}</p>
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
          {["transactions", "subscriptions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab === "transactions"
                ? "Transaction History"
                : "Active Services"}
            </button>
          ))}
        </nav>
      </div>

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Transaction History
          </h2>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((txn) => {
                const config =
                  STATUS_CONFIG[txn.status] || STATUS_CONFIG.pending;
                const StatusIcon = config.icon;
                return (
                  <div
                    key={txn._id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <CreditCard className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 capitalize">
                            {txn.type.replace(/_/g, " ")}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {txn.description}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span>
                              {new Date(txn.createdAt).toLocaleDateString()}
                            </span>
                            <span>{txn.paymentMethod}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${txn.amount}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1 ${config.color}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {txn.status}
                          </span>
                          {txn.status === "failed" && txn.failureReason && (
                            <p className="text-xs text-red-600 mt-1">
                              {txn.failureReason}
                            </p>
                          )}
                        </div>
                        {txn.status === "failed" && (
                          <button className="flex items-center gap-1 text-xs border border-orange-500 text-orange-500 px-2 py-1 rounded hover:bg-orange-50">
                            <RotateCcw className="w-3 h-3" /> Retry
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Active Services Tab */}
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
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 capitalize">
                            {service.type.replace(/_/g, " ")}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {service.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${service.amount}
                        </p>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      </div>
                    </div>
                    {daysLeft !== null && (
                      <div className="mt-3 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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

      {/* PayPal Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex gap-3">
          <CreditCard className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">
              Secure Payment Processing
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              All payments are processed securely through PayPal. Your payment
              information is never stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBilling;
