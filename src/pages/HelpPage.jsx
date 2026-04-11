import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader } from "lucide-react";
import { useFooterPage } from "../context/FooterPageContext";
import MarkdownRenderer from "../components/ui/MarkdownRenderer";

const HelpPage = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getFooterPage } = useFooterPage();

  useEffect(() => {
    const loadHelpPage = async () => {
      try {
        setLoading(true);
        const data = await getFooterPage("help");
        setPageData(data);
      } catch (err) {
        setError("Failed to load help page");
        logger.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadHelpPage();
  }, [getFooterPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <Loader className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Error Loading Page
          </h1>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-gray-300">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border-b border-gray-800 py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            {pageData?.title || "Help Center"}
          </h1>
          <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4 sm:mb-6"></div>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
            {pageData?.description ||
              "Get help with your CayEats account and orders. Find answers to common questions and learn how to use our platform."}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Content Box */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl mb-8 sm:mb-12 md:mb-16">
            {pageData?.content ? (
              <MarkdownRenderer content={pageData.content} />
            ) : (
              <p className="text-center text-gray-500 italic py-8 sm:py-12 text-sm sm:text-base">
                No content available for this page. Please contact the
                administrator.
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">
              Quick Links
            </h2>
            <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4 sm:mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              <Link
                to="/faq"
                className="p-3 sm:p-4 bg-gray-700 hover:bg-orange-500/10 border border-gray-600 hover:border-orange-500/30 rounded-lg transition-all text-center"
              >
                <p className="text-white font-semibold text-sm sm:text-base">
                  FAQ
                </p>
                <p className="text-xs sm:text-sm text-gray-400">Find answers</p>
              </Link>
              <Link
                to="/contact"
                className="p-3 sm:p-4 bg-gray-700 hover:bg-orange-500/10 border border-gray-600 hover:border-orange-500/30 rounded-lg transition-all text-center"
              >
                <p className="text-white font-semibold text-sm sm:text-base">
                  Contact Us
                </p>
                <p className="text-xs sm:text-sm text-gray-400">Get support</p>
              </Link>
              <Link
                to="/report"
                className="p-3 sm:p-4 bg-gray-700 hover:bg-orange-500/10 border border-gray-600 hover:border-orange-500/30 rounded-lg transition-all text-center"
              >
                <p className="text-white font-semibold text-sm sm:text-base">
                  Report Issue
                </p>
                <p className="text-xs sm:text-sm text-gray-400">Feedback</p>
              </Link>
              <Link
                to="/restaurants"
                className="p-3 sm:p-4 bg-gray-700 hover:bg-orange-500/10 border border-gray-600 hover:border-orange-500/30 rounded-lg transition-all text-center"
              >
                <p className="text-white font-semibold text-sm sm:text-base">
                  Browse Restaurants
                </p>
                <p className="text-xs sm:text-sm text-gray-400">Find food</p>
              </Link>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-8 sm:mt-12 bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-lg p-4 sm:p-6 md:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
              Still Need Help?
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed">
              Our dedicated support team is available to assist you. Reach out
              to us anytime.
            </p>
            <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
              <a
                href="mailto:hello@cayeats.ky"
                className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                Email Support
              </a>
              <a
                href="tel:+13459999999"
                className="px-4 sm:px-6 py-2 text-sm sm:text-base border border-orange-500 text-orange-400 hover:bg-orange-500/10 font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
