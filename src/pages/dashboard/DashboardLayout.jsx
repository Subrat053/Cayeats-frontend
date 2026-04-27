import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  BarChart2,
  Megaphone,
  ClipboardList,
  CreditCard,
  Receipt,
  ChevronDown,
  ChevronUp,
  Bell,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { getRestaurantProfile } from "../../api/restaurantService";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "My Restaurant", path: "/dashboard/profile", icon: UtensilsCrossed },
  {
    label: "Menu Management",
    icon: ShoppingBag,
    children: [
      { label: "Menu Items", path: "/dashboard/menu" },
      { label: "Menu Images", path: "/dashboard/menu-images" },
      { label: "Categories", path: "/dashboard/categories" },
      { label: "Category Analytics", path: "/dashboard/categories/analytics" },
    ],
  },
  { label: "Analytics", path: "/dashboard/analytics", icon: BarChart2 },
  {
    label: "Marketing",
    icon: Megaphone,
    children: [
      { label: "Featured Listings", path: "/dashboard/featured-listings" },
      { label: "Tonight's Cravings", path: "/dashboard/tonights-cravings" },
      { label: "Banner Ads", path: "/dashboard/banner-ads" },
      { label: "Preferred Delivery", path: "/dashboard/preferred-delivery" },
    ],
  },
  { label: "Orders", path: "/dashboard/orders", icon: ClipboardList },
  { label: "Subscription", path: "/dashboard/subscription", icon: CreditCard },
  { label: "Billing", path: "/dashboard/billing", icon: Receipt },
];

const DashboardLayout = () => {
  const [marketingOpen, setMarketingOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState({
    loading: true,
    isApproved: true,
  });
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    // ✅ Use AuthContext logout to properly update React state and clear auth
    // Redirect to home page so user can choose to log in as any role
    logout(navigate, "/");
  };

  useEffect(() => {
    let isMounted = true;
    getRestaurantProfile()
      .then((data) => {
        if (!isMounted) return;
        setApprovalStatus({
          loading: false,
          isApproved: data?.isApproved !== false,
        });
      })
      .catch(() => {
        if (!isMounted) return;
        setApprovalStatus({ loading: false, isApproved: true });
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-20 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:w-56`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <img
                src="/cayeats-logo.jpeg"
                alt="cayEats"
                className="object-contain"
              />
            </div>
            <span className="font-bold text-gray-900">
              <span className="text-orange-500">Cay</span>Eats
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            if (item.children) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setMarketingOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition-colors text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </div>
                    {marketingOpen ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                  {marketingOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              isActive
                                ? "bg-orange-50 text-orange-500 font-medium"
                                : "text-gray-500 hover:text-orange-500 hover:bg-orange-50"
                            }`
                          }
                          onClick={() => setSidebarOpen(false)} // close sidebar on mobile after navigation
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-orange-50 text-orange-500 font-medium"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                  }`
                }
                onClick={() => setSidebarOpen(false)} // close sidebar on mobile after navigation
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-56 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-10">
          {/* Hamburger button (mobile only) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-500 hover:text-orange-500 lg:hidden"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Right side - Visit Site & Bell */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              title="Go to homepage"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Visit Site</span>
            </Link>

            <button className="relative p-2 text-gray-500 hover:text-orange-500">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {!approvalStatus.loading && !approvalStatus.isApproved && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 text-sm font-semibold uppercase">
              ⏳ WAITING FOR ADMIN APPROVAL. YOU CAN VIEW YOUR DASHBOARD, BUT
              UPDATES AND ACTIONS ARE DISABLED UNTIL APPROVAL.
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
