import { useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Truck,
  Image,
  DollarSign,
  Settings,
  Users,
  BarChart3,
  FileSpreadsheet,
  Bell,
  ChevronDown,
  Menu,
  X,
  LogOut,
  ChefHat,
  Megaphone,
  Globe,
  Newspaper,
  BookOpen,
  UserCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/cayeats-rmbg.png";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const navigate = useNavigate();

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Restaurants", href: "/admin/restaurants", icon: Store },
    {
      name: "Delivery Providers",
      href: "/admin/delivery-providers",
      icon: Truck,
    },
    { name: "Banners & Ads", href: "/admin/banners", icon: Image },
    { name: "Pricing", href: "/admin/pricing", icon: DollarSign },
    { name: "Marketing", href: "/admin/marketing", icon: Megaphone },
    { name: "CRM", href: "/admin/crm", icon: UserCheck },
    { name: "Blog", href: "/admin/blog", icon: BookOpen },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Data Import", href: "/admin/import", icon: FileSpreadsheet },
    { name: "Site Settings", href: "/admin/site-settings", icon: Globe },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (href) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        overflow-y-auto
      `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-800">
          <Link to="/admin" className="flex justify-center">
            <img src={logo} alt="" className="h-16 object-contain scale-95" />
            {/* <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🍽️</span>
            </div>
            <div>
              <span className="text-lg font-bold text-white">Cay</span>
              <span className="text-lg font-bold text-primary-400">Eats</span>
            </div> */}
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Badge */}
        <div className="px-4 py-3 border-b border-gray-800">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs font-medium">
            <Settings className="w-3 h-3" />
            Admin Panel
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1  overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    active
                      ? "bg-primary-500 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-gray-300 font-medium">
                {user?.name?.charAt(0) || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logout(navigate)}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-primary-500"
              >
                View Site →
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
