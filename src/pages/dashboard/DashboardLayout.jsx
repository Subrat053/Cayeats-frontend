import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
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
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "My Restaurant", path: "/dashboard/profile", icon: UtensilsCrossed },
  { label: "Menu", path: "/dashboard/menu", icon: ShoppingBag },
  { label: "Products", path: "/dashboard/products", icon: ShoppingBag },
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
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 h-full z-10">
        {/* Logo */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
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

      {/* Main Content */}
      <div className="flex-1 ml-56 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-end items-center sticky top-0 z-10">
          <button className="relative p-2 text-gray-500 hover:text-orange-500">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
