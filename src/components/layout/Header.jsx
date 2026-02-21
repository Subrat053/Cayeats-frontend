import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  User,
  LogOut,
  Settings,
  ChefHat,
  Truck,
  ChevronDown,
  Heart,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import Button from "../ui/Button";
import SearchBar from "./SearchBar";
import logo from "../../assets/cayeats-logo.jpeg";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const {
    user,
    logout,
    isAuthenticated,
    isAdmin,
    isRestaurantOwner,
    isDeliveryPartner,
  } = useAuth();

  const { favoritesCount } = useFavorites();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsUserMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (isAdmin) return "/admin";
    if (isRestaurantOwner) return "/dashboard";
    if (isDeliveryPartner) return "/partner-dashboard";
    return "/account";
  };

  const getDashboardLabel = () => {
    if (isAdmin) return "Admin Panel";
    if (isRestaurantOwner) return "Restaurant Dashboard";
    if (isDeliveryPartner) return "Partner Dashboard";
    return "My Account";
  };

  const getDashboardIcon = () => {
    if (isAdmin) return Settings;
    if (isRestaurantOwner) return ChefHat;
    if (isDeliveryPartner) return Truck;
    return User;
  };

  const DashboardIcon = getDashboardIcon();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="CayEats Logo" className="h-12" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/restaurants" className="nav-link">
              Restaurants
            </NavLink>
            <NavLink to="/cuisines" className="nav-link">
              Cuisines
            </NavLink>
            <NavLink to="/partner" className="nav-link">
              Partner With Us
            </NavLink>
          </nav>

          {/* Search */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              to="/profile"
              className="relative p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-lg"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {favoritesCount > 9 ? "9+" : favoritesCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>

                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user?.fullName?.split(" ")[0]}
                  </span>

                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserMenuOpen(false)}
                    />

                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.fullName}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        <Heart className="w-4 h-4" />
                        My Favorites
                      </Link>

                      <Link
                        to={getDashboardLink()}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        <DashboardIcon className="w-4 h-4" />
                        {getDashboardLabel()}
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" className="hidden sm:block">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="lg:hidden pb-4">
            <SearchBar />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
