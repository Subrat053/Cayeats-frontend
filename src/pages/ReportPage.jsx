import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";
import { submitReportIssue, getFooterPage } from "../api/browseServices";
import { useFooterPage } from "../context/FooterPageContext";
import MarkdownRenderer from "../components/ui/MarkdownRenderer";

const ReportPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issueType: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const { getFooterPage: fetchFooterPage } = useFooterPage();

  const issueTypes = [
    "App not working",
    "Order issue",
    "Payment problem",
    "Delivery delay",
    "Restaurant information",
    "Food quality",
    "Other",
  ];

  useEffect(() => {
    const loadReportGuidelines = async () => {
      try {
        setPageLoading(true);
        const data = await fetchFooterPage("report-guidelines");
        setPageData(data);
      } catch (err) {
        console.error("Failed to load report guidelines:", err);
      } finally {
        setPageLoading(false);
      }
    };

    loadReportGuidelines();
  }, [fetchFooterPage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await submitReportIssue(formData);
      setStatus({
        type: "success",
        message:
          "Thank you! Your report has been submitted. Your report will be verified soon and we'll contact you via email if we need more information.",
      });
      setFormData({
        name: "",
        email: "",
        issueType: "",
        description: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Failed to submit report",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-gray-300">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border-b border-gray-800 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {pageData?.title || "Report an Issue"}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-6"></div>
          <p className="text-xl text-gray-300">
            {pageData?.description ||
              "Help us improve by reporting any issues you encounter. Your feedback is valuable and helps us provide better service."}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Guidelines Box */}
          {pageData?.content && (
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 md:p-12 shadow-2xl mb-16">
              <MarkdownRenderer content={pageData.content} />
            </div>
          )}

          {/* Report Form */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 md:p-12">
            {status && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                  status.type === "success"
                    ? "bg-green-900/20 border border-green-500/30"
                    : "bg-red-900/20 border border-red-500/30"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <p
                  className={
                    status.type === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {status.message}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Issue Type */}
              <div>
                <label
                  htmlFor="issueType"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Issue Type *
                </label>
                <select
                  id="issueType"
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
                >
                  <option value="">Select an issue type...</option>
                  {issueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  placeholder="Please describe the issue in detail. Include any order numbers, restaurant names, or other relevant information."
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-700 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  {loading ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-12 bg-blue-900/20 border border-blue-500/30 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                ✓ We review all reports to ensure the quality of our service
              </li>
              <li>
                ✓ Our team investigates the issue and works on a resolution
              </li>
              <li>
                ✓ We'll contact you at the provided email with updates or if we
                need more information
              </li>
              <li>✓ For urgent issues, please call us at +1 (345) 999-9999</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
