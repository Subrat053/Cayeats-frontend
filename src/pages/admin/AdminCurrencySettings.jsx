import { useState, useEffect } from "react";
import { DollarSign, Save, Info, Globe, RefreshCw } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { logger } from "../../utils/logger";
import { useCurrency } from "../../context/CurrencyContext";
import api from "../../api/axios";

const SUPPORTED_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "KYD", name: "Cayman Islands Dollar", symbol: "CI$" },
];

const AdminCurrencySettings = () => {
  const { setCurrencyDirectly } = useCurrency();
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch current currency
  useEffect(() => {
    fetchCurrency();
  }, []);

  const fetchCurrency = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/settings");
      const currentCurrency = response.data?.data?.payments?.currency || "USD";
      setCurrency(currentCurrency);
    } catch (err) {
      setError("Failed to load currency settings");
      logger.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.put("/admin/settings", {
        payments: {
          currency: currency,
        },
      });

      // Immediately update the global currency context
      setCurrencyDirectly(currency);

      setMessage(
        `✅ Currency changed to ${SUPPORTED_CURRENCIES.find((c) => c.code === currency)?.name} (${SUPPORTED_CURRENCIES.find((c) => c.code === currency)?.symbol || currency})! Updates are live now across the platform.`,
      );
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setError("Failed to save currency settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchCurrency();
      setMessage("✅ Currency refreshed!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setError("Failed to refresh currency");
    } finally {
      setRefreshing(false);
    }
  };

  const selectedCurrencyData = SUPPORTED_CURRENCIES.find(
    (c) => c.code === currency,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-orange-500" />
            Currency Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Set the platform currency for all restaurants and prices
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          title="Manually refresh currency from server"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Global Currency</h3>
            <p className="text-sm text-blue-700 mt-1">
              Select between USD ($) and KYD (CI$) for the entire platform. When
              you change the currency, all prices will automatically update
              across all pages within 10 seconds. Restaurants must price their
              products in the selected currency.
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Currency Selection Card */}
      <Card>
        <Card.Header>
          <Card.Title>Select Platform Currency</Card.Title>
          <Card.Description>
            Choose the currency for all prices on your platform
          </Card.Description>
        </Card.Header>
        <Card.Content className="pt-6">
          <div className="space-y-6">
            {/* Current Selection Display */}
            <div className="bg-linear-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Currency</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {selectedCurrencyData?.symbol}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mt-2">
                    {selectedCurrencyData?.name} ({selectedCurrencyData?.code})
                  </p>
                </div>
                <Globe className="w-16 h-16 text-orange-200 opacity-50" />
              </div>
            </div>

            {/* Currency Selection Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {SUPPORTED_CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Select your preferred currency from the dropdown above
              </p>
            </div>

            {/* Currency Grid Preview */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">
                Available Currencies
              </p>
              <div className="grid grid-cols-2 gap-4">
                {SUPPORTED_CURRENCIES.map((curr) => (
                  <div
                    key={curr.code}
                    onClick={() => setCurrency(curr.code)}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                      currency === curr.code
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 bg-white hover:border-orange-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-4xl font-bold text-gray-900">
                          {curr.symbol}
                        </p>
                        <p className="text-lg font-semibold text-gray-700 mt-2">
                          {curr.code}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {curr.name}
                        </p>
                      </div>
                      {currency === curr.code && (
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card.Content>

        {/* Footer with Save Button */}
        <Card.Footer className="border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-sm text-gray-600">
                {currency !== "USD" ? (
                  <>
                    <span className="font-semibold">New Currency:</span>{" "}
                    {selectedCurrencyData?.symbol} {selectedCurrencyData?.code}
                  </>
                ) : (
                  "Default currency: USD"
                )}
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Currency"}
            </button>
          </div>
        </Card.Footer>
      </Card>

      {/* Impact Information */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="font-semibold text-amber-900 mb-3">Impact Summary</h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold">•</span>
            <span>
              <strong>Restaurant Prices:</strong> Restaurants will be required
              to update product prices in the new currency
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold">•</span>
            <span>
              <strong>Customer Display:</strong> All prices shown to customers
              will display in this currency
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold">•</span>
            <span>
              <strong>Orders & Payments:</strong> All new orders will be
              processed in this currency
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold">•</span>
            <span>
              <strong>Subscriptions:</strong> Pricing plans will display in this
              currency
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold">•</span>
            <span>
              <strong>Ads & Services:</strong> All advertising and premium
              service pricing will be in this currency
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminCurrencySettings;
