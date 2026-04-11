import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { useFooterPage } from "../context/FooterPageContext";
import { logger } from "../utils/logger";
import MarkdownRenderer from "../components/ui/MarkdownRenderer";

const TermsPage = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getFooterPage } = useFooterPage();

  useEffect(() => {
    const loadTermsPage = async () => {
      try {
        setLoading(true);
        const data = await getFooterPage("terms");
        setPageData(data);
      } catch (err) {
        setError("Failed to load terms of service");
        logger.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTermsPage();
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
      <div className="bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border-b border-gray-800 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {pageData?.title || "Terms of Service"}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-6"></div>
          <p className="text-xl text-gray-300">
            {pageData?.description ||
              "Please read our terms of service carefully before using CayEats."}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Content Box */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 md:p-12 shadow-2xl">
            {pageData?.content ? (
              <MarkdownRenderer content={pageData.content} />
            ) : (
              <p className="text-gray-400 italic text-center py-12">
                No content available for this page. Please contact the
                administrator.
              </p>
            )}
          </div>

          {/* Contact Section */}
          <section className="mt-16 bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10 border border-orange-500/30 rounded-xl p-8 md:p-12 shadow-lg">
            <h2 className="text-3xl font-bold text-white mb-3">Questions?</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4"></div>
            <p className="text-gray-300 mb-6 text-lg">
              If you have any questions about our Terms of Service, please
              contact us.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
            >
              Contact Us
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
