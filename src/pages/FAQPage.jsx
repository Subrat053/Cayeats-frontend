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
        console.error(err);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {pageData?.title || "Frequently Asked Questions"}
          </h1>
          <p className="text-lg text-gray-400">
            {pageData?.description ||
              "Find answers to common questions about CayEats and food delivery."}
          </p>
        </div>

        {/* FAQ Items */}
        {faqs && faqs.length > 0 ? (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq._id || index}
                className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-orange-500/30 transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-700/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-orange-400 shrink-0 transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openIndex === index && (
                  <div className="px-6 py-4 border-t border-gray-700 bg-gray-800/50">
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No FAQs available at the moment.
            </p>
          </div>
        )}

        {/* Additional Help */}
        <div className="mt-16 bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Didn't find your answer?
          </h2>
          <p className="text-gray-400 mb-6">
            Our support team is here to help. Get in touch with us anytime.
          </p>
          <button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors duration-200">
            <a href="/contact">Contact Support</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
