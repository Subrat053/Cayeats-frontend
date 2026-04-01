import { Link } from "react-router-dom";
import {
  Target,
  Users,
  Award,
  Heart,
  Utensils,
  Truck,
  MapPin,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Button from "../components/ui/Button";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-orange-500 via-orange-600 to-orange-700 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-1/4 -right-1/4 w-1/2 h-full bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-full bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            The Heart of Cayman <br />
            <span className="text-orange-200">Dining Excellence</span>
          </h1>
          <p className="text-xl text-orange-50 max-w-2xl mx-auto leading-relaxed">
            CayEats is the definitive bridge between the Cayman Islands' vibrant
            culinary landscape and the people who love great food.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800"
                alt="Cayman Dining"
                className="rounded-3xl shadow-2xl relative z-10"
              />
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-orange-100 rounded-3xl -z-0" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-6">
                <Target className="w-4 h-4" />
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Empowering Local Restaurants, <br />
                Delighting Island Diners.
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded with a passion for the diverse flavors of the Cayman
                Islands, CayEats was born to simplify how people discover and
                order from their favorite local spots. We noticed a gap between
                world-class dining and digital accessibility—so we built the
                bridge.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our platform centralizes island restaurants, providing
                up-to-date menus, direct links to delivery partners, and a
                seamless discovery experience for locals and tourists alike.
              </p>
              <div className="flex gap-4">
                <Link to="/restaurants">
                  <Button icon={Utensils}>Explore Restaurants</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-4xl font-bold text-orange-600 mb-2">100+</div>
              <div className="text-gray-500 font-medium">Restaurants</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-4xl font-bold text-orange-600 mb-2">12+</div>
              <div className="text-gray-500 font-medium">Cuisines</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-4xl font-bold text-orange-600 mb-2">3</div>
              <div className="text-gray-500 font-medium">Delivery Partners</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-4xl font-bold text-orange-600 mb-2">50k+</div>
              <div className="text-gray-500 font-medium">Monthly Foodies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why We Do What We Do
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Our values guide every decision we make, ensuring we provide the
            best service to our community.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Heart,
                title: "Community First",
                desc: "We are deeply rooted in the Cayman Islands, prioritizing local business growth and community connections.",
                color: "orange",
              },
              {
                icon: Award,
                title: "Excellence",
                desc: "We strive for accuracy and quality in every listing, ensuring users get the best dining experience.",
                color: "blue",
              },
              {
                icon: Users,
                title: "Inclusivity",
                desc: "Connecting everyone to the best food options, across Grand Cayman, Little Cayman, and Cayman Brac.",
                color: "green",
              },
            ].map((value, i) => (
              <div
                key={i}
                className="p-8 bg-white border border-gray-100 rounded-3xl hover:shadow-xl transition-shadow group text-center"
              >
                <div
                  className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                    value.color === "orange"
                      ? "bg-orange-100 text-orange-600"
                      : value.color === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                  }`}
                >
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-900 py-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-3xl p-8 md:p-16 text-center text-white shadow-xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Taste the Best of Cayman?
            </h2>
            <p className="text-orange-100 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of diners who use CayEats to discover new flavors
              every day.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/restaurants">
                <Button
                  variant="white"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Browse Restaurants
                </Button>
              </Link>
              <Link to="/partner">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Partner With Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;