import { Link } from 'react-router-dom';
import { 
  Store, 
  Truck, 
  DollarSign, 
  TrendingUp,
  Check,
  ArrowRight,
  Users,
  BarChart3
} from 'lucide-react';
// import Button from '../../components/ui/Button';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { claimPricing } from '../data/mockData';
import { formatCurrency } from '../utils/helpers';

const PartnerPage = () => {
  const restaurantBenefits = [
    'Get verified badge on your listing',
    'Manage your restaurant profile',
    'Update operating hours and info',
    'Access performance analytics',
    'Purchase featured listings',
    'Priority customer support',
  ];

  const deliveryBenefits = [
    'Participate as delivery provider',
    'Purchase preferred placement',
    'Access to all restaurant listings',
    'Banner advertising options',
    'Performance analytics dashboard',
    'Grow your delivery network',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Partner with CayEats
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Join the Cayman Islands' premier restaurant discovery platform. Reach more customers and grow your business.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register?type=restaurant">
                <Button size="lg" icon={Store}>
                  List Your Restaurant
                </Button>
              </Link>
              <Link to="/register?type=delivery">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" icon={Truck}>
                  Become Delivery Partner
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-500 mb-2">100+</div>
              <div className="text-gray-600">Restaurants Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-500 mb-2">3</div>
              <div className="text-gray-600">Delivery Partners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-500 mb-2">50K+</div>
              <div className="text-gray-600">Monthly Visitors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-500 mb-2">12</div>
              <div className="text-gray-600">Cuisine Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* For Restaurants */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                <Store className="w-4 h-4" />
                For Restaurants
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Reach More Customers in the Cayman Islands
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                List your restaurant on CayEats and connect with hungry customers looking for their next meal. Our platform makes it easy for diners to find you and order through their preferred delivery provider.
              </p>
              
              <ul className="space-y-4 mb-8">
                {restaurantBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register?type=restaurant">
                <Button size="lg" icon={ArrowRight} iconPosition="right">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800"
                alt="Restaurant"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Claim Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Restaurant Claim Pricing
            </h2>
            <p className="text-gray-600">
              Claim your restaurant listing to unlock all management features and get a verified badge.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="border-2 border-gray-200 hover:border-primary-300 transition-colors">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {claimPricing.sixMonths.label}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatCurrency(claimPricing.sixMonths.price)}
                  </span>
                  <span className="text-gray-500"> USD</span>
                </div>
                <p className="text-gray-600 mb-6">Perfect for trying out the platform</p>
                <Link to="/register?type=restaurant">
                  <Button variant="outline" className="w-full">Choose Plan</Button>
                </Link>
              </div>
            </Card>

            <Card className="border-2 border-primary-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                  Best Value
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {claimPricing.oneYear.label}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatCurrency(claimPricing.oneYear.price)}
                  </span>
                  <span className="text-gray-500"> USD</span>
                </div>
                <p className="text-gray-600 mb-6">Save $80 compared to 6-month plan</p>
                <Link to="/register?type=restaurant">
                  <Button className="w-full">Choose Plan</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* For Delivery Partners */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800"
                alt="Delivery"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium mb-6">
                <Truck className="w-4 h-4" />
                For Delivery Partners
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Expand Your Delivery Network
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Partner with CayEats to connect your delivery service with restaurants across the Cayman Islands. Get premium placement and drive more orders to your platform.
              </p>
              
              <ul className="space-y-4 mb-8">
                {deliveryBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-secondary-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register?type=delivery">
                <Button size="lg" variant="secondary" icon={ArrowRight} iconPosition="right">
                  Become a Partner
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join CayEats today and connect with hungry customers across the Cayman Islands.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register?type=restaurant">
              <Button size="lg" variant="white">
                List Your Restaurant
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnerPage;
