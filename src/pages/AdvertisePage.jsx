import { Link } from "react-router-dom";
import {
  Zap,
  Eye,
  TrendingUp,
  Users,
  Target,
  Smartphone,
  Award,
  ArrowRight,
} from "lucide-react";

const AdvertisePage = () => {
  const advertisingOptions = [
    {
      icon: Eye,
      title: "Featured Listings",
      description: "Get top placement on our platform and increase visibility",
      features: [
        "Premium placement on homepage",
        "Featured restaurant badge",
        "Increased visibility in search results",
        "Higher click-through rates",
      ],
      price: "From $99/month",
    },
    {
      icon: Smartphone,
      title: "Banner Advertising",
      description: "Prominent banner ads on our most-visited pages",
      features: [
        "Homepage banner placement",
        "Category page banners",
        "High engagement rates",
        "Trackable analytics",
      ],
      price: "From $199/month",
    },
    {
      icon: Target,
      title: "Targeted Promotions",
      description: "Reach specific audience segments with targeted ads",
      features: [
        "Geographic targeting",
        "Cuisine-based targeting",
        "Customer behavior targeting",
        "Custom audience segments",
      ],
      price: "From $299/month",
    },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Increase Sales",
      description:
        "Drive more orders through increased visibility and targeted marketing",
    },
    {
      icon: Users,
      title: "Reach More Customers",
      description:
        "Connect with thousands of hungry customers actively searching for food",
    },
    {
      icon: Award,
      title: "Build Brand Awareness",
      description:
        "Establish your restaurant as a premier option in Cayman Islands",
    },
    {
      icon: Zap,
      title: "Fast Results",
      description:
        "See immediate impact with our high-traffic platform and engaged users",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Advertising with CayEats
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Reach customers on CayEats. Our advertising solutions help
            restaurants grow their business by increasing visibility and driving
            more orders.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Advertise on CayEats?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-orange-500/50 transition-colors"
                >
                  <div className="p-3 bg-orange-500/20 rounded-lg w-fit mb-4">
                    <IconComponent className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advertising Options */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our Advertising Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advertisingOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-8 hover:border-orange-500/30 transition-colors"
                >
                  <div className="p-3 bg-orange-500/20 rounded-lg w-fit mb-4">
                    <IconComponent className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-400 mb-6">{option.description}</p>

                  <ul className="space-y-3 mb-8">
                    {option.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start gap-3 text-sm text-gray-300"
                      >
                        <span className="text-orange-400 mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-gray-700 pt-6">
                    <p className="text-orange-400 font-semibold">
                      {option.price}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
              <p className="text-4xl font-bold text-orange-400 mb-2">50K+</p>
              <p className="text-gray-400">Monthly Visitors</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
              <p className="text-4xl font-bold text-orange-400 mb-2">100+</p>
              <p className="text-gray-400">Listed Restaurants</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
              <p className="text-4xl font-bold text-orange-400 mb-2">12</p>
              <p className="text-gray-400">Cuisine Categories</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
              <p className="text-4xl font-bold text-orange-400 mb-2">3</p>
              <p className="text-gray-400">Delivery Partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Grow Your Restaurant?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Get in touch with our advertising team to discuss the best options
            for your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              Contact Sales <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+13459999999"
              className="px-8 py-3 border border-orange-500 text-orange-400 hover:bg-orange-500/10 font-bold rounded-lg transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 mb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                How quickly will I see results?
              </h3>
              <p className="text-gray-400">
                Most customers see increased engagement within the first few
                days. Full results typically appear within 2-4 weeks.
              </p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I track the performance of my ads?
              </h3>
              <p className="text-gray-400">
                Yes! We provide detailed analytics dashboards so you can track
                clicks, impressions, and conversions from your advertising.
              </p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                What if I want to modify my ads?
              </h3>
              <p className="text-gray-400">
                You can update your advertising content anytime. Contact our
                team for free revisions and optimization suggestions.
              </p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Do you offer custom advertising packages?
              </h3>
              <p className="text-gray-400">
                Absolutely! For larger campaigns or unique needs, we offer
                custom packages. Contact our sales team for a personalized
                quote.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdvertisePage;
