import { Link } from "react-router-dom";
import { Star, Clock, ImagePlus, Truck, ArrowRight } from "lucide-react";

const AD_OPTIONS = [
  {
    id: "featured-listings",
    name: "Featured Listing",
    description:
      "Top position in All Restaurants list and your cuisine category pages",
    icon: Star,
    color: "bg-yellow-500",
    stats: "Avg 4× more profile views",
  },
  {
    id: "tonights-cravings",
    name: "Tonight's Cravings",
    description: "Prime evening placement when customers decide where to eat",
    icon: Clock,
    color: "bg-orange-500",
    stats: "Displayed during peak dinner hours",
    popular: true,
  },
  {
    id: "banner-ads",
    name: "Banner Ads",
    description:
      "Eye-catching banners in top, middle, or bottom homepage zones",
    icon: ImagePlus,
    color: "bg-blue-500",
    stats: "Highest brand exposure on site",
  },
  {
    id: "preferred-delivery",
    name: "Preferred Delivery",
    description: "One delivery partner appears first — 40% larger and bolder",
    icon: Truck,
    color: "bg-purple-500",
    stats: "Only 1 preferred slot per restaurant",
  },
];

const DashboardAdvertising = () => (
  <div className="space-y-6 p-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Advertising</h1>
      <p className="text-gray-600 mt-1">
        Boost your visibility and attract more customers
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      {AD_OPTIONS.map((option) => {
        const Icon = option.icon;
        return (
          <Link
            key={option.id}
            to={`/dashboard/${option.id}`}
            className="relative bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-orange-400 hover:shadow-md transition-all group"
          >
            {option.popular && (
              <span className="absolute -top-3 left-4 bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}

            <div className="flex items-start gap-4">
              <div className={`p-3 ${option.color} rounded-xl shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                  {option.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {option.description}
                </p>
                <p className="text-xs text-orange-500 font-medium mt-3">
                  {option.stats}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-orange-400 group-hover:translate-x-1 transition-all mt-1 shrink-0" />
            </div>
          </Link>
        );
      })}
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <p className="text-sm text-blue-700">
        All advertising drives <strong>visibility only</strong> — CayEats routes
        customers to your preferred delivery provider to place orders. Track
        performance in real-time via your{" "}
        <Link to="/dashboard/analytics" className="underline font-medium">
          Analytics
        </Link>{" "}
        page.
      </p>
    </div>
  </div>
);

export default DashboardAdvertising;
