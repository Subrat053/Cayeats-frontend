import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";
import { submitContact, getFooterPage } from "../api/browseServices";
import { useFooterPage } from "../context/FooterPageContext";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    restaurantName: "",
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const { getFooterPage: fetchFooterPage } = useFooterPage();

  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        setPageLoading(true);
        const data = await fetchFooterPage("contact");
        setPageData(data);
      } catch (err) {
        console.error("Failed to load contact info:", err);
      } finally {
        setPageLoading(false);
      }
    };

    loadContactInfo();
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
      await submitContact(formData);
      setStatus({ type: "success", message: "Message sent successfully!" });
      setFormData({
        restaurantName: "",
        name: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Failed to send message",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Contact Form Modal */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section - Black Background */}
          <div className="bg-black px-6 md:px-10 py-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Send us a Message
            </h2>
            <p className="text-gray-300 mt-2 text-base">
              Ready to reach out? Fill out the details below and we'll get back
              to you shortly.
            </p>
          </div>

          {/* Form Section - White Background */}
          <div className="px-6 md:px-10 py-10">
            {status && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                  status.type === "success"
                    ? "bg-green-50 border border-green-300"
                    : "bg-red-50 border border-red-300"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <p
                  className={
                    status.type === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }
                >
                  {status.message}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Restaurant Name */}
              <div>
                <label
                  htmlFor="restaurantName"
                  className="block text-xs font-bold text-gray-600 mb-3 uppercase tracking-widest"
                >
                  Restaurant Name
                </label>
                <input
                  type="text"
                  id="restaurantName"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors bg-gray-50"
                  placeholder="The Burger Shack"
                />
              </div>

              {/* Your Name and Phone Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Your Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-bold text-gray-600 mb-3 uppercase tracking-widest"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors bg-gray-50"
                    placeholder="John Doe"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-bold text-gray-600 mb-3 uppercase tracking-widest"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors bg-gray-50"
                    placeholder="+1 345 123-4567"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold text-gray-600 mb-3 uppercase tracking-widest"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors bg-gray-50"
                  placeholder="you@restaurant.com"
                />
              </div>

              {/* Message or Questions */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-bold text-gray-600 mb-3 uppercase tracking-widest"
                >
                  Message or Questions (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors bg-gray-50 resize-none"
                  placeholder="Anything else we should know?"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold text-base rounded-lg transition-colors duration-300 uppercase tracking-widest shadow-lg hover:shadow-xl"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {pageLoading ? (
            <div className="col-span-3 flex justify-center items-center py-12">
              <Loader className="animate-spin text-orange-500" size={32} />
            </div>
          ) : pageData?.contactInfo ? (
            <>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 rounded-full mb-4">
                  <Mail className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-gray-900 font-bold mb-2">Email</h3>
                <a
                  href={`mailto:${pageData.contactInfo.email}`}
                  className="text-gray-600 hover:text-orange-600 transition-colors text-sm"
                >
                  {pageData.contactInfo.email || "Not available"}
                </a>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 rounded-full mb-4">
                  <Phone className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-gray-900 font-bold mb-2">Phone</h3>
                <a
                  href={`tel:${pageData.contactInfo.phone}`}
                  className="text-gray-600 hover:text-orange-600 transition-colors text-sm"
                >
                  {pageData.contactInfo.phone || "Not available"}
                </a>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 rounded-full mb-4">
                  <MapPin className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-gray-900 font-bold mb-2">Address</h3>
                <p className="text-gray-600 text-sm">
                  {pageData.contactInfo.address || "Not available"}
                </p>
              </div>

              {pageData.contactInfo.hours && (
                <div className="col-span-full bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-gray-900 font-bold mb-3 text-center">
                    Business Hours
                  </h3>
                  <p className="text-gray-600 text-sm text-center whitespace-pre-line">
                    {pageData.contactInfo.hours}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-600">Contact information not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
