import { useState, useEffect } from "react";
import {
  Save,
  Upload,
  Image,
  Globe,
  CreditCard,
  Eye,
  Trash2,
  Palette,
  Shield,
  Bell,
  ExternalLink,
  Info,
  CheckCircle2,
  Loader,
} from "lucide-react";

const AdminSiteSettings = () => {
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const markChanged = () => setHasChanges(true);

  // --- Logo & Branding - Load from localStorage ---
  const [branding, setBranding] = useState(() => {
    const stored = localStorage.getItem("siteBranding");
    return stored
      ? JSON.parse(stored)
      : {
          logoUrl: "/assets/cayeats-rmbg.png",
          faviconUrl: "/favicon.ico",
          siteName: "CayEats",
          tagline: "Cayman Islands Food Delivery & Restaurant Guide",
          primaryColor: "#E63946",
          secondaryColor: "#1D3557",
        };
  });

  // --- Payment Settings - Load from localStorage ---
  const [payments, setPayments] = useState(() => {
    const stored = localStorage.getItem("paymentSettings");
    return stored
      ? JSON.parse(stored)
      : {
          paypalEnabled: true,
          paypalClientId: "AaBbCcDdEeFf_sandbox_client_id",
          paypalSecret: "••••••••••••••••",
          paypalMode: "sandbox",
          stripeEnabled: false,
          stripePublicKey: "",
          stripeSecretKey: "",
          currency: "USD",
          taxRate: 0,
        };
  });

  // --- Notification Settings - Load from localStorage ---
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem("notificationSettings");
    return stored
      ? JSON.parse(stored)
      : {
          emailNewOrder: true,
          emailNewClaim: true,
          emailNewSubscription: true,
          emailWeeklyReport: true,
          adminEmail: "admin@cayeats.com",
        };
  });

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      // Persist settings to localStorage
      localStorage.setItem("siteBranding", JSON.stringify(branding));
      localStorage.setItem("paymentSettings", JSON.stringify(payments));
      localStorage.setItem(
        "notificationSettings",
        JSON.stringify(notifications),
      );

      setSuccess("Site settings saved successfully!");
      setHasChanges(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to save settings: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const FileUploadBox = ({ label, currentUrl, onUpload, accept, hint }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden">
          {currentUrl ? (
            <img
              src={currentUrl}
              alt={label}
              className="w-full h-full object-contain p-1"
            />
          ) : (
            <Image className="w-8 h-8 text-gray-300" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex gap-2">
            <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm">
              <Upload className="w-4 h-4" />
              Upload
              <input
                type="file"
                accept={accept}
                className="hidden"
                onChange={() => markChanged()}
              />
            </label>
            {currentUrl && (
              <button
                onClick={markChanged}
                className="flex items-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure branding, payments, and global site preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || loading}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${hasChanges && !loading ? "bg-primary text-white hover:bg-primary/90" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* ====== BRANDING & LOGO ====== */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Palette className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Branding</h2>
              <p className="text-sm text-gray-600">
                Logo, favicon, and site identity
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <FileUploadBox
              label="Site Logo"
              currentUrl={branding.logoUrl}
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              hint="PNG, SVG, or WebP. Recommended: 200×60px. Max 2MB."
            />
            <FileUploadBox
              label="Favicon"
              currentUrl={branding.faviconUrl}
              accept="image/x-icon,image/png,image/svg+xml"
              hint="ICO, PNG, or SVG. Must be 32×32px or 16×16px."
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Site Name
              </label>
              <input
                type="text"
                value={branding.siteName}
                onChange={(e) => {
                  setBranding({ ...branding, siteName: e.target.value });
                  markChanged();
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={branding.tagline}
                onChange={(e) => {
                  setBranding({ ...branding, tagline: e.target.value });
                  markChanged();
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Primary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={branding.primaryColor}
                  onChange={(e) => {
                    setBranding({ ...branding, primaryColor: e.target.value });
                    markChanged();
                  }}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-gray-300"
                />
                <input
                  type="text"
                  value={branding.primaryColor}
                  onChange={(e) => {
                    setBranding({ ...branding, primaryColor: e.target.value });
                    markChanged();
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Secondary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={branding.secondaryColor}
                  onChange={(e) => {
                    setBranding({
                      ...branding,
                      secondaryColor: e.target.value,
                    });
                    markChanged();
                  }}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-gray-300"
                />
                <input
                  type="text"
                  value={branding.secondaryColor}
                  onChange={(e) => {
                    setBranding({
                      ...branding,
                      secondaryColor: e.target.value,
                    });
                    markChanged();
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== PAYMENT SETTINGS ====== */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Payment Settings
              </h2>
              <p className="text-sm text-gray-600">
                Configure payment gateways for subscriptions and purchases
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-8">
          {/* PayPal */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs">
                  PP
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">PayPal</h3>
                  <p className="text-xs text-gray-500">
                    Accept payments via PayPal
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPayments({
                    ...payments,
                    paypalEnabled: !payments.paypalEnabled,
                  });
                  markChanged();
                }}
                className={`relative w-12 h-6 rounded-full transition-colors ${payments.paypalEnabled ? "bg-green-500" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${payments.paypalEnabled ? "translate-x-6" : ""}`}
                />
              </button>
            </div>
            {payments.paypalEnabled && (
              <div className="pl-13 space-y-4 ml-13">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Client ID
                    </label>
                    <input
                      type="text"
                      value={payments.paypalClientId}
                      onChange={(e) => {
                        setPayments({
                          ...payments,
                          paypalClientId: e.target.value,
                        });
                        markChanged();
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Secret
                    </label>
                    <input
                      type="password"
                      value={payments.paypalSecret}
                      onChange={(e) => {
                        setPayments({
                          ...payments,
                          paypalSecret: e.target.value,
                        });
                        markChanged();
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Mode
                  </label>
                  <div className="flex gap-3">
                    {["sandbox", "live"].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                          setPayments({ ...payments, paypalMode: mode });
                          markChanged();
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${payments.paypalMode === mode ? (mode === "live" ? "border-green-500 bg-green-50 text-green-700" : "border-yellow-500 bg-yellow-50 text-yellow-700") : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                      >
                        {mode === "sandbox" ? "🔧 Sandbox" : "🟢 Live"}
                      </button>
                    ))}
                  </div>
                  {payments.paypalMode === "live" && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Live mode — real
                      transactions will be processed!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <hr className="border-gray-200" />

          {/* Stripe */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-xs">
                  ST
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Stripe</h3>
                  <p className="text-xs text-gray-500">
                    Accept credit card payments via Stripe
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPayments({
                    ...payments,
                    stripeEnabled: !payments.stripeEnabled,
                  });
                  markChanged();
                }}
                className={`relative w-12 h-6 rounded-full transition-colors ${payments.stripeEnabled ? "bg-green-500" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${payments.stripeEnabled ? "translate-x-6" : ""}`}
                />
              </button>
            </div>
            {payments.stripeEnabled && (
              <div className="pl-13 space-y-4 ml-13">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Publishable Key
                    </label>
                    <input
                      type="text"
                      value={payments.stripePublicKey}
                      onChange={(e) => {
                        setPayments({
                          ...payments,
                          stripePublicKey: e.target.value,
                        });
                        markChanged();
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="pk_test_..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Secret Key
                    </label>
                    <input
                      type="password"
                      value={payments.stripeSecretKey}
                      onChange={(e) => {
                        setPayments({
                          ...payments,
                          stripeSecretKey: e.target.value,
                        });
                        markChanged();
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="sk_test_..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <hr className="border-gray-200" />

          {/* Currency & Tax */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Currency
              </label>
              <select
                value={payments.currency}
                onChange={(e) => {
                  setPayments({ ...payments, currency: e.target.value });
                  markChanged();
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="USD">USD — US Dollar</option>
                <option value="KYD">KYD — Cayman Islands Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={payments.taxRate}
                onChange={(e) => {
                  setPayments({
                    ...payments,
                    taxRate: parseFloat(e.target.value) || 0,
                  });
                  markChanged();
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Applied to all purchases. Set to 0 for tax-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== NOTIFICATION PREFERENCES ====== */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Bell className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Admin Notifications
              </h2>
              <p className="text-sm text-gray-600">
                Configure which events trigger admin email alerts
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Admin Email
            </label>
            <input
              type="email"
              value={notifications.adminEmail}
              onChange={(e) => {
                setNotifications({
                  ...notifications,
                  adminEmail: e.target.value,
                });
                markChanged();
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full max-w-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="space-y-3">
            {[
              {
                key: "emailNewOrder",
                label: "New Order Placed",
                desc: "Get notified when a customer places an order",
              },
              {
                key: "emailNewClaim",
                label: "New Restaurant Claim",
                desc: "Get notified when a restaurant is claimed",
              },
              {
                key: "emailNewSubscription",
                label: "New Subscription",
                desc: "Get notified when a new subscription is purchased",
              },
              {
                key: "emailWeeklyReport",
                label: "Weekly Report",
                desc: "Receive a weekly summary of platform activity",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => {
                    setNotifications({
                      ...notifications,
                      [item.key]: !notifications[item.key],
                    });
                    markChanged();
                  }}
                  className={`relative w-12 h-6 rounded-full transition-colors ${notifications[item.key] ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[item.key] ? "translate-x-6" : ""}`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <strong>Note:</strong> Logo and Favicon changes will be reflected
          site-wide after saving. Payment gateway changes take effect
          immediately for new transactions. Always test in sandbox mode before
          switching to live.
        </div>
      </div>
    </div>
  );
};

export default AdminSiteSettings;
