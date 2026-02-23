import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdminSettingsProvider } from "./context/AdminSettingsContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { AppDataProvider } from "./context/AppDataContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import { MainLayout } from "./components/layout";
import ScrollToTop from "./components/layout/ScrollToTop";
import { AdminLayout } from "./pages/admin";
import { DashboardLayout } from "./pages/dashboard";

import Products from "./pages/dashboard/Products";
import DashboardSubscription from "./pages/dashboard/DashboardSubscription";

import {
  HomePage,
  RestaurantsPage,
  RestaurantDetailPage,
  CuisinesPage,
  CuisineCategoryPage,
  PartnerPage,
  NotFoundPage,
  UserProfilePage,
} from "./pages";

import { LoginPage, RegisterPage } from "./pages/auth";

import {
  AdminDashboard,
  AdminSettings,
  ManageRestaurants,
  ManageDeliveryProviders,
  ManageBanners,
  PricingSettings,
  UserManagement,
  Analytics,
  DataImport,
  AdminMarketing,
  AdminSiteSettings,
  AdminCRM,
  AdminBlog,
} from "./pages/admin";

import {
  DashboardOverview,
  DashboardProfile,
  DashboardAnalytics,
  DashboardAdvertising,
  DashboardMenu,
  DashboardFeaturedListings,
  DashboardTonightsCravings,
  DashboardBannerAds,
  DashboardPreferredDelivery,
  DashboardBilling,
  DashboardOrders,
  DashboardProducts,
} from "./pages/dashboard";

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <AdminSettingsProvider>
          <AppDataProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                {/* ── Auth Routes ── */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* ── Public Routes ── */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/restaurants" element={<RestaurantsPage />} />
                  <Route
                    path="/restaurant/:slug"
                    element={<RestaurantDetailPage />}
                  />
                  <Route path="/cuisines" element={<CuisinesPage />} />
                  <Route
                    path="/cuisines/:categoryId"
                    element={<CuisineCategoryPage />}
                  />
                  <Route path="/partner" element={<PartnerPage />} />
                  <Route path="/profile" element={<UserProfilePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* ── Admin Routes ── */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="restaurants" element={<ManageRestaurants />} />
                  <Route
                    path="delivery-providers"
                    element={<ManageDeliveryProviders />}
                  />
                  <Route path="banners" element={<ManageBanners />} />
                  <Route path="pricing" element={<PricingSettings />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="import" element={<DataImport />} />
                  <Route path="marketing" element={<AdminMarketing />} />
                  <Route path="site-settings" element={<AdminSiteSettings />} />
                  <Route path="crm" element={<AdminCRM />} />
                  <Route path="blog" element={<AdminBlog />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* ── Dashboard Routes (restaurant only) ── */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["restaurant"]}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardOverview />} />
                  <Route path="profile" element={<DashboardProfile />} />
                  <Route path="menu" element={<DashboardMenu />} />
                  <Route path="products" element={<Products />} />
                  <Route path="analytics" element={<DashboardAnalytics />} />
                  <Route
                    path="advertising"
                    element={<DashboardAdvertising />}
                  />
                  <Route
                    path="featured-listings"
                    element={<DashboardFeaturedListings />}
                  />
                  <Route
                    path="tonights-cravings"
                    element={<DashboardTonightsCravings />}
                  />
                  <Route path="banner-ads" element={<DashboardBannerAds />} />
                  <Route
                    path="preferred-delivery"
                    element={<DashboardPreferredDelivery />}
                  />
                  <Route path="orders" element={<DashboardOrders />} />
                  {/* ✅ New Stripe subscription page */}
                  <Route
                    path="subscription"
                    element={<DashboardSubscription />}
                  />
                  {/* ✅ Billing / transaction history */}
                  <Route path="billing" element={<DashboardBilling />} />
                </Route>
              </Routes>
            </Router>
          </AppDataProvider>
        </AdminSettingsProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
