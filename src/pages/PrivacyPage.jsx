const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-lg text-gray-400 mb-12">
          We respect your privacy. Read our privacy policy to understand how we
          handle your data.
        </p>

        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-300 leading-relaxed">
              CayEats ("we" or "us" or "our") operates the CayEats website. This
              page informs you of our policies regarding the collection, use,
              and disclosure of personal data when you use our service and the
              choices you have associated with that data.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              2. Information Collection and Use
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We collect several different types of information for various
              purposes to provide and improve our service to you.
            </p>
            <h3 className="text-lg font-semibold text-white mb-3">
              Types of Data Collected:
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <span className="text-orange-400 font-semibold">
                  Personal Data:
                </span>{" "}
                Name, email address, phone number, delivery address
              </li>
              <li>
                <span className="text-orange-400 font-semibold">
                  Usage Data:
                </span>{" "}
                Pages visited, time and date of visits, time spent on pages
              </li>
              <li>
                <span className="text-orange-400 font-semibold">
                  Payment Data:
                </span>{" "}
                Processed through secure payment gateways
              </li>
              <li>
                <span className="text-orange-400 font-semibold">Cookies:</span>{" "}
                Small data files stored on your device
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              3. Use of Data
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              CayEats uses the collected data for various purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>
                To allow you to participate in interactive features of our
                service
              </li>
              <li>To provide customer support</li>
              <li>
                To gather analysis or valuable information so that we can
                improve our service
              </li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              4. Security of Data
            </h2>
            <p className="text-gray-300 leading-relaxed">
              The security of your data is important to us, but remember that no
              method of transmission over the Internet or method of electronic
              storage is 100% secure. While we strive to use commercially
              acceptable means to protect your personal data, we cannot
              guarantee its absolute security.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              5. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "effective date" at the top of this Privacy
              Policy.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              6. Your Rights
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>
                Data portability - receive your data in a structured format
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              7. Contact Us
            </h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <div className="mt-4 space-y-2 text-gray-300">
              <p>
                <span className="text-orange-400 font-semibold">Email:</span>{" "}
                hello@cayeats.ky
              </p>
              <p>
                <span className="text-orange-400 font-semibold">Phone:</span> +1
                (345) 999-9999
              </p>
              <p>
                <span className="text-orange-400 font-semibold">Address:</span>{" "}
                George Town, Grand Cayman, Cayman Islands
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Have Questions About Your Data?
            </h2>
            <p className="text-gray-400 mb-6">
              Contact our privacy team for any concerns or inquiries about your
              personal information.
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

export default PrivacyPage;
