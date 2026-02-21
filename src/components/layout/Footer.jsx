import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin,
  ExternalLink
} from 'lucide-react';
import logo from '../../assets/cayeats-rmbg.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    discover: [
      { label: 'All Restaurants', href: '/restaurants' },
      { label: 'Cuisines', href: '/cuisines' },
      { label: 'Tonight\'s Cravings', href: '/cravings' },
      { label: 'Featured Restaurants', href: '/restaurants?featured=true' },
    ],
    forBusiness: [
      { label: 'Partner With Us', href: '/partner' },
      { label: 'Restaurant Sign Up', href: '/register?type=restaurant' },
      { label: 'Delivery Partners', href: '/register?type=delivery' },
      { label: 'Advertising', href: '/advertise' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Report an Issue', href: '/report' },
    ],
    legal: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center justify-center lg:justify-start -ml-5 lg:ml-5 gap-2 mb-6">
              <img src={logo} alt="CayEats Logo" className='h-16 scale-125  ' />
              {/* <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🍽️</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white">Cay</span>
                <span className="text-xl font-bold text-primary-400">Eats</span>
              </div> */}
            </Link>
            <p className="text-sm text-gray-400 mb-4 px-5 lg:px-0">
              Island Dining Authority. Discover the best restaurants in the Cayman Islands and order from your favorite delivery providers.
            </p>
            <div className="flex justify-center lg:justify-start gap-3">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Discover */}
          <div>
            <h3 className="text-white font-semibold mb-4">Discover</h3>
            <ul className="space-y-2">
              {footerLinks.discover.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Business */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Business</h3>
            <ul className="space-y-2">
              {footerLinks.forBusiness.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>George Town, Grand Cayman, Cayman Islands</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:hello@cayeats.ky" className="hover:text-primary-400 transition-colors">
                  hello@cayeats.ky
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+13459999999" className="hover:text-primary-400 transition-colors">
                  +1 (345) 999-9999
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} CayEats. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {footerLinks.legal.map((link) => (
                <Link 
                  key={link.href} 
                  to={link.href}
                  className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
