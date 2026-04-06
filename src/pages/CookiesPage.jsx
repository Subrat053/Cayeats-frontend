const CookiesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Cookie Policy
        </h1>
        <p className="text-lg text-gray-400 mb-12">
          Learn about our use of cookies and how you can control them.
        </p>

        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              1. What Are Cookies?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Cookies are small text files that are stored on your device when
              you visit our website. They are widely used to make websites work
              more efficiently and to provide information to the website
              operators. Cookies allow us to recognize your device and remember
              your preferences and actions over time.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              2. Types of Cookies We Use
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-orange-400 mb-2">
                  Essential Cookies
                </h3>
                <p className="text-gray-300">
                  These cookies are necessary for the website to function
                  properly. They include cookies for authentication and
                  security.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-400 mb-2">
                  Performance Cookies
                </h3>
                <p className="text-gray-300">
                  These cookies collect information about how you use our
                  website, such as which pages you visit most often and any
                  error messages.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-400 mb-2">
                  Functional Cookies
                </h3>
                <p className="text-gray-300">
                  These cookies remember your preferences and choices to provide
                  a more personalized experience.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-400 mb-2">
                  Marketing Cookies
                </h3>
                <p className="text-gray-300">
                  These cookies are used to track your activity across websites
                  to deliver targeted advertisements.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              3. Third-Party Cookies
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Some cookies may be set by third-party services we use, such as
              analytics providers and payment processors. We do not have control
              over these cookies, but we require third parties to respect your
              privacy. Third-party cookies are governed by the privacy policies
              of those third parties.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              4. How We Use Cookies
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>To remember your login information</li>
              <li>To store your preferences and settings</li>
              <li>To analyze website traffic and usage patterns</li>
              <li>To improve our website and services</li>
              <li>To personalize your experience</li>
              <li>To provide targeted advertising</li>
              <li>To prevent fraud and ensure security</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              5. Your Cookie Choices
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Most web browsers allow you to control cookies through their
              settings. You can:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>
                View what cookies are set and delete them on an individual basis
              </li>
              <li>Reject all cookies or non-essential cookies</li>
              <li>Be notified when a cookie is being set</li>
              <li>Block cookies from specific sites</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Please note that disabling essential cookies may affect the
              functionality of our website.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              6. How to Control Cookies
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              To learn more about cookies and how to manage them, visit the
              following resources:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>
                <a
                  href="https://www.aboutcookies.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300"
                >
                  About Cookies
                </a>
              </li>
              <li>
                <a
                  href="https://www.yourchoices.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Your Online Choices
                </a>
              </li>
              <li>
                <a
                  href="https://www.allaboutcookies.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300"
                >
                  All About Cookies
                </a>
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              7. Changes to This Cookie Policy
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect
              changes in our practices and cookie technology. We encourage you
              to review this policy periodically to stay informed about how we
              use cookies.
            </p>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Cookie Preferences?
            </h2>
            <p className="text-gray-400 mb-6">
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
