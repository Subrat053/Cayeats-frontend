const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-lg text-gray-400 mb-12">
          Please read our terms of service carefully before using CayEats.
        </p>

        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using CayEats, you accept and agree to be bound
              by the terms and provision of this agreement. If you do not agree
              to abide by the above, please do not use this service.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              2. Use License
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the
              materials (information or software) on CayEats for personal,
              non-commercial transitory viewing only. This is the grant of a
              license, not a transfer of title, and under this license you may
              not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Modifying or copying the materials</li>
              <li>
                Using the materials for any commercial purpose or for any public
                display
              </li>
              <li>
                Attempting to decompile or reverse engineer any software
                contained on CayEats
              </li>
              <li>
                Removing any copyright or other proprietary notations from the
                materials
              </li>
              <li>
                Transferring the materials to another person or "mirroring" the
                materials on any other server
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              3. Disclaimer
            </h2>
            <p className="text-gray-300 leading-relaxed">
              The materials on CayEats are provided "as is". CayEats makes no
              warranties, expressed or implied, and hereby disclaims and negates
              all other warranties including, without limitation, implied
              warranties or conditions of merchantability, fitness for a
              particular purpose, or non-infringement of intellectual property
              or other violation of rights.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              4. Limitations
            </h2>
            <p className="text-gray-300 leading-relaxed">
              In no event shall CayEats or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use the materials on CayEats.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              5. Accuracy of Materials
            </h2>
            <p className="text-gray-300 leading-relaxed">
              The materials appearing on CayEats could include technical,
              typographical, or photographic errors. CayEats does not warrant
              that any of the materials on our website is accurate, complete, or
              current. We may make changes to the materials contained on our
              website at any time without notice.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Links</h2>
            <p className="text-gray-300 leading-relaxed">
              CayEats has not reviewed all of the sites linked to our website
              and is not responsible for the contents of any such linked site.
              The inclusion of any link does not imply endorsement by CayEats of
              the site. Use of any such linked website is at the user's own
              risk.
            </p>
          </section>

          {/* Section 7 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              7. Modifications
            </h2>
            <p className="text-gray-300 leading-relaxed">
              CayEats may revise these terms of service for our website at any
              time without notice. By using this website, you are agreeing to be
              bound by the then current version of these terms of service.
            </p>
          </section>

          {/* Section 8 */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              8. Governing Law
            </h2>
            <p className="text-gray-300 leading-relaxed">
              These terms and conditions are governed by and construed in
              accordance with the laws of Cayman Islands, and you irrevocably
              submit to the exclusive jurisdiction of the courts in that
              location.
            </p>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Questions?</h2>
            <p className="text-gray-400 mb-6">
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
