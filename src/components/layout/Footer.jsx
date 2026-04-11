import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import logo from "../../assets/cayeats-rmbg.png";
import { getFooterSettings } from "../../api/adminService";

const DEFAULT_FOOTER_LINKS = {
  discover: [
    { label: "All Restaurants", href: "/restaurants" },
    { label: "Cuisines", href: "/cuisines" },
    { label: "Tonight's Cravings", href: "/cravings" },
    { label: "Featured Restaurants", href: "/restaurants?featured=true" },
  ],
  forBusiness: [
    { label: "Partner With Us", href: "/partner" },
    { label: "Restaurant Sign Up", href: "/register?type=restaurant" },
    { label: "Delivery Partners", href: "/register?type=delivery" },
    { label: "Advertising", href: "/advertise" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Report an Issue", href: "/report" },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [footerLinks, setFooterLinks] = useState(DEFAULT_FOOTER_LINKS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFooterSettings = async () => {
      try {
        setLoading(true);
        const settings = await getFooterSettings();

        if (
          settings &&
          typeof settings === "object" &&
          Object.keys(settings).length > 0
        ) {
          setFooterLinks({
            discover:
              settings.discover && settings.discover.length > 0
                ? settings.discover
                : DEFAULT_FOOTER_LINKS.discover,
            forBusiness:
              settings.forBusiness && settings.forBusiness.length > 0
                ? settings.forBusiness
                : DEFAULT_FOOTER_LINKS.forBusiness,
            support:
              settings.support && settings.support.length > 0
                ? settings.support
                : DEFAULT_FOOTER_LINKS.support,
            legal:
              settings.legal && settings.legal.length > 0
                ? settings.legal
                : DEFAULT_FOOTER_LINKS.legal,
          });
        } else {
          setFooterLinks(DEFAULT_FOOTER_LINKS);
        }
      } catch (error) {
        // Silently fail - use default footer links
        setFooterLinks(DEFAULT_FOOTER_LINKS);
      } finally {
        setLoading(false);
      }
    };

    loadFooterSettings();
  }, []);

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 w-full">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2 mb-3 sm:mb-4 md:mb-6 hover:opacity-80 transition-opacity"
            >
              <img src={logo} alt="CayEats Logo" className="h-10 sm:h-12" />
            </Link>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-3 sm:mb-4 md:mb-6">
              Island Dining Authority. Discover the best restaurants in the
              Cayman Islands.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61582245794929"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-2.5 bg-gray-800 rounded-lg hover:bg-orange-500 transition-all duration-300 transform hover:scale-110"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/cay_eats"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-2.5 bg-gray-800 rounded-lg hover:bg-orange-500 transition-all duration-300 transform hover:scale-110"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/cay-eats-810bb53bb/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-2.5 bg-gray-800 rounded-lg hover:bg-orange-500 transition-all duration-300 transform hover:scale-110"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Discover */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm uppercase tracking-widest">
              Discover
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.discover && footerLinks.discover.length > 0
                ? footerLinks.discover.map((link, idx) => (
                    <li key={`discover-${idx}`}>
                      <Link
                        to={link.href}
                        className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200 inline-flex items-center group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))
                : DEFAULT_FOOTER_LINKS.discover.map((link, idx) => (
                    <li key={`discover-default-${idx}`}>
                      <Link
                        to={link.href}
                        className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200 inline-flex items-center group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>

          {/* For Business */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm uppercase tracking-widest">
              For Business
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.forBusiness && footerLinks.forBusiness.length > 0
                ? footerLinks.forBusiness.map((link, idx) => (
                    <li key={`forBusiness-${idx}`}>
                      <Link
                        to={link.href}
                        className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200 inline-flex items-center group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))
                : DEFAULT_FOOTER_LINKS.forBusiness.map((link, idx) => (
                    <li key={`forBusiness-default-${idx}`}>
                      <Link
                        to={link.href}
                        className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200 inline-flex items-center group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm uppercase tracking-widest">
              Support
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.support && footerLinks.support.length > 0
                ? footerLinks.support.map((link, idx) => (
                    <li key={`support-${idx}`}>
                      <Link
                        to={link.href}
                        className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200 inline-flex items-center group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))
                : DEFAULT_FOOTER_LINKS.support.map((link, idx) => (
                    <li key={`support-default-${idx}`}>
                      <Link
                        to={link.href}
                        className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200 inline-flex items-center group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm uppercase tracking-widest">
              Contact
            </h3>
            <ul className="space-y-2 sm:space-y-4">
              <li className="flex items-start gap-3 text-xs sm:text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-orange-400 mt-0.5" />
                <span className="leading-relaxed">
                  George Town, Grand Cayman, Cayman Islands
                </span>
              </li>
              <li className="flex items-center gap-3 text-xs sm:text-sm group cursor-pointer">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-orange-400" />
                <a
                  href="mailto:info@cayeats.com"
                  className="text-gray-400 group-hover:text-orange-400 transition-colors duration-200"
                >
                  info@cayeats.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-xs sm:text-sm group cursor-pointer">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-orange-400" />
                <a
                  href="tel:+13459999999"
                  className="text-gray-400 group-hover:text-orange-400 transition-colors duration-200"
                >
                  +1 (345) 999-9999
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"></div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-6">
            <p className="text-xs sm:text-sm text-gray-500">
              © {currentYear} CayEats. All rights reserved.
            </p>
            <div className="flex items-center gap-6 flex-wrap justify-center md:justify-end">
              {(footerLinks.legal && footerLinks.legal.length > 0
                ? footerLinks.legal
                : DEFAULT_FOOTER_LINKS.legal
              ).map((link, idx) => (
                <Link
                  key={`legal-${idx}`}
                  to={link.href}
                  className="text-xs sm:text-sm text-gray-500 hover:text-orange-400 transition-colors duration-200"
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
