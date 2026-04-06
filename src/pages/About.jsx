import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { useFooterPage } from "../context/FooterPageContext";
import MarkdownRenderer from "../components/ui/MarkdownRenderer";

const AboutPage = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getFooterPage } = useFooterPage();

  useEffect(() => {
    const loadAboutPage = async () => {
      try {
        setLoading(true);
        const data = await getFooterPage("about");
        setPageData(data);
      } catch (err) {
        setError("Failed to load about page");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAboutPage();
  }, [getFooterPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Page
          </h1>
          <p className="text-gray-600">{error}</p>
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
            {pageData?.title || "About CayEats"}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-6"></div>
          <p className="text-xl text-gray-300">
            {pageData?.description ||
              "CayEats is the definitive bridge between the Cayman Islands' vibrant culinary landscape and the people who love great food."}
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
              <p className="text-center text-gray-500 italic py-12">
                No content available for this page. Please contact the
                administrator.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
