import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  ShoppingCart,
  Truck,
  HelpCircle,
  MessageSquare,
} from "lucide-react";

const HelpPage = () => {
  const helpSections = [
    {
      icon: Search,
      title: "Getting Started",
      description:
        "Learn how to search for restaurants, browse menus, and discover new cuisines.",
      content: [
        "Visit the home page to search for restaurants",
        "Use filters to narrow down by cuisine or special offers",
        "Check restaurant ratings and reviews",
        "View menus and available items",
      ],
    },
    {
      icon: ShoppingCart,
      title: "Placing an Order",
      description:
        "Step-by-step guide to placing and managing your food orders.",
      content: [
        "Select a restaurant and browse the menu",
        "Add items to your cart and customize if needed",
        "Review your order and proceed to checkout",
        "Provide delivery address and payment information",
        "Receive order confirmation and tracking",
      ],
    },
    {
      icon: Truck,
      title: "Delivery & Tracking",
      description:
        "Everything you need to know about delivery and order tracking.",
      content: [
        "Track your order in real-time",
        "Receive notifications at each stage",
        "Multiple delivery partner options available",
        "Estimated delivery times provided",
        "Support for delivery modifications",
      ],
    },
    {
      icon: MapPin,
      title: "Restaurants & Menus",
      description:
        "Discover and explore restaurants in detail to find your perfect meal.",
      content: [
        "View restaurant information and hours",
        "Browse complete menus with prices",
        "Read customer reviews and ratings",
        "Check special offers and promotions",
        "Save favorite restaurants",
      ],
    },
    {
      icon: MessageSquare,
      title: "Account & Profile",
      description: "Manage your account, preferences, and order history.",
      content: [
        "Create and manage your profile",
        "View order history and reorder favorite meals",
        "Save delivery addresses",
        "Update payment methods",
        "Manage notification preferences",
      ],
    },
    {
      icon: HelpCircle,
      title: "Common Issues",
      description: "Find solutions to common problems and questions.",
      content: [
        "Payment issues - contact support immediately",
        "Order delays - check tracking for updates",
        "Delivery address issues - provide clear directions",
        "Menu item unavailable - restaurants suggest alternatives",
        "Refunds and cancellations - handled within 24 hours",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Help Center
          </h1>
          <p className="text-lg text-gray-400">
            Get help with your CayEats account and orders. Find answers to
            common questions and learn how to use our platform.
          </p>
        </div>

        {/* Help Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {helpSections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-lg p-8 hover:border-orange-500/50 transition-colors"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <IconComponent className="w-6 h-6 text-orange-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {section.title}
                  </h2>
                </div>

                <p className="text-gray-400 mb-6">{section.description}</p>

                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-3 text-sm text-gray-300"
                    >
                      <span className="text-orange-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/faq"
              className="p-4 bg-gray-700 hover:bg-orange-500/10 border border-gray-600 hover:border-orange-500/30 rounded-lg transition-all text-center"
            >
              <p className="text-white font-semibold">FAQ</p>
              <p className="text-sm text-gray-400">Find answers</p>
            </Link>
            <Link
              to="/contact"
              className="p-4 bg-gray-700 hover:bg-orange-500/10 border border-gray-600 hover:border-orange-500/30 rounded-lg transition-all text-center"
            >
              <p className="text-white font-semibold">Contact Us</p>
              <p className="text-sm text-gray-400">Get support</p>
            </Link>
            <Link
              to="/report"
              className="p-4 bg-gray-700 hover:bg-orange-500/10 border border-gray-600 hover:border-orange-500/30 rounded-lg transition-all text-center"
            >
              <p className="text-white font-semibold">Report Issue</p>
              <p className="text-sm text-gray-400">Feedback</p>
            </Link>
            <Link
              to="/restaurants"
              className="p-4 bg-gray-700 hover:bg-orange-500/10 border border-gray-600 hover:border-orange-500/30 rounded-lg transition-all text-center"
            >
              <p className="text-white font-semibold">Browse Restaurants</p>
              <p className="text-sm text-gray-400">Find food</p>
            </Link>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Still Need Help?
          </h2>
          <p className="text-gray-400 mb-6">
            Our dedicated support team is available to assist you. Reach out to
            us anytime.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="mailto:hello@cayeats.ky"
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
            >
              Email Support
            </a>
            <a
              href="tel:+13459999999"
              className="px-6 py-2 border border-orange-500 text-orange-400 hover:bg-orange-500/10 font-semibold rounded-lg transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
