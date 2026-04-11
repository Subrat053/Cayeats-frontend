import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { useFooterPage } from "../context/FooterPageContext";
import { logger } from "../utils/logger";
import MarkdownRenderer from "../components/ui/MarkdownRenderer";

const CookiesPage = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getFooterPage } = useFooterPage();

  useEffect(() => {
    const loadCookiesPolicy = async () => {
      try {
        setLoading(true);
        const data = await getFooterPage("cookies");
        setPageData(data);
      } catch (err) {
        setError("Failed to load cookie policy");
        logger.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCookiesPolicy();
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Error Loading Page
          </h1>
          <p className="text-lg text-red-400">{error}</p>
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
            {pageData?.title || "Cookie Policy"}
          </h1>
          <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4 sm:mb-6"></div>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
            {pageData?.description ||
              "Learn about our use of cookies and how you can control them."}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Content Box */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl">
            {pageData?.content ? (
              <MarkdownRenderer content={pageData.content} />
            ) : (
              <p className="text-gray-400 italic text-center py-8 sm:py-12 text-sm sm:text-base">
                No content available for this page. Please contact the
                administrator.
              </p>
            )}
          </div>

          {/* Contact Section */}
          <section className="mt-16 bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10 border border-orange-500/30 rounded-xl p-8 md:p-12 shadow-lg">
            <h2 className="text-3xl font-bold text-white mb-3">
              Cookie Preferences?
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4"></div>
            <p className="text-gray-300 mb-6 text-lg">
              Have questions about our cookie usage? Contact us for more
              information.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
            >
              Contact Us
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;
