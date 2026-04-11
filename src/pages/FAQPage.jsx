import { useState, useEffect } from "react";
import { ChevronDown, Loader } from "lucide-react";
import { useFooterPage } from "../context/FooterPageContext";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getFooterPage } = useFooterPage();

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        setLoading(true);
        const data = await getFooterPage("faq");
        setPageData(data);
      } catch (err) {
        setError("Failed to load FAQs");
        logger.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFAQs();
  }, [getFooterPage]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <Loader className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  const faqs = pageData?.faqs || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 py-8 sm:py-12 md:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            {pageData?.title || "Frequently Asked Questions"}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 leading-relaxed">
            {pageData?.description ||
              "Find answers to common questions about CayEats and food delivery."}
          </p>
        </div>

        {/* FAQ Items */}
        {faqs && faqs.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq._id || index}
                className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-orange-500/30 transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-left hover:bg-gray-700/50 transition-colors"
                >
                  <h3 className="text-base sm:text-lg font-semibold text-white pr-3 sm:pr-4 leading-tight">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-orange-400 shrink-0 transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openIndex === index && (
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-700 bg-gray-800/50">
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <p className="text-sm sm:text-lg text-gray-400">
              No FAQs available at the moment.
            </p>
          </div>
        )}

        {/* Additional Help */}
        <div className="mt-8 sm:mt-12 md:mt-16 bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-lg p-4 sm:p-6 md:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
            Didn't find your answer?
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed">
            Our support team is here to help. Get in touch with us anytime.
          </p>
          <button className="px-6 sm:px-8 py-2 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base font-bold rounded-lg transition-colors duration-200 w-full sm:w-auto">
            <a href="/contact">Contact Support</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
