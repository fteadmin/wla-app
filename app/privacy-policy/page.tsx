"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold text-primary">
            WLA
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-6 py-16 max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-primary mb-2">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground text-sm mb-12">
          Effective Date: April 2, 2026
        </p>

        <div className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
          <p>
            Future Trends Ent (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the WLA
            application (the &ldquo;App&rdquo;). This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our App.
          </p>
          <p>
            By using the App, you agree to the collection and use of information in accordance with this
            Privacy Policy. If you do not agree, please do not use the App.
          </p>

          {/* 1 */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              1. Information We Collect
            </h2>

            <h3 className="font-semibold text-foreground mb-2">Personal Information You Provide:</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><strong className="text-foreground">Account information:</strong> email address, display name, and password when you register.</li>
              <li><strong className="text-foreground">Profile information:</strong> avatar image, bio, and website URL (optional).</li>
              <li><strong className="text-foreground">Payment information:</strong> processed securely by Stripe, Inc. We store only a Stripe customer reference ID. We never store, process, or have access to your credit card numbers, bank account details, or other financial account information.</li>
              <li><strong className="text-foreground">Membership data:</strong> tier selection, membership ID, and QR code data.</li>
              <li><strong className="text-foreground">Communications:</strong> direct messages to other users, community board posts, and support inquiries.</li>
              <li><strong className="text-foreground">Contest submissions:</strong> photos, videos, and captions you upload for contests.</li>
            </ul>

            <h3 className="font-semibold text-foreground mb-2">Information Collected Automatically:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-foreground">Device information:</strong> device type, operating system version, and unique device identifiers.</li>
              <li><strong className="text-foreground">Push notification tokens:</strong> Expo push tokens for delivering notifications.</li>
              <li><strong className="text-foreground">Usage data:</strong> features accessed, interactions within the App, and timestamps.</li>
            </ul>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              2. How We Use Your Information
            </h2>
            <p className="mb-2">We use collected information to:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Provide, operate, and maintain the App and its features.</li>
              <li>Process transactions including membership purchases and token purchases.</li>
              <li>Send push notifications about messages, events, contests, and account activity.</li>
              <li>Display your profile to other members within the App.</li>
              <li>Enable direct messaging and community messaging features.</li>
              <li>Administer contests, including displaying submissions and vote counts.</li>
              <li>Provide customer support and respond to inquiries.</li>
              <li>Detect, prevent, and address fraud, abuse, and technical issues.</li>
              <li>Comply with legal obligations.</li>
            </ul>

            <p className="mb-2">We do <strong className="text-foreground">NOT</strong> use your information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Sell your personal data to third parties.</li>
              <li>Serve targeted advertisements.</li>
              <li>Build advertising profiles.</li>
              <li>Track you across other apps or websites.</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              3. How We Share Your Information
            </h2>
            <p className="mb-4">We may share your information only in the following circumstances:</p>

            <h3 className="font-semibold text-foreground mb-2">Service Providers</h3>
            <p className="mb-2">
              We share data with third-party service providers who assist us in operating the App:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><strong className="text-foreground">Supabase, Inc.</strong> — Database hosting, authentication, and file storage (hosted on Amazon Web Services in the United States).</li>
              <li><strong className="text-foreground">Stripe, Inc.</strong> — Payment processing for memberships and token purchases.</li>
              <li><strong className="text-foreground">Expo (650 Industries, Inc.)</strong> — Push notification delivery and app distribution.</li>
            </ul>
            <p className="mb-4">
              These providers are contractually obligated to protect your data and use it only for the
              services they provide to us.
            </p>

            <h3 className="font-semibold text-foreground mb-2">Legal Requirements</h3>
            <p className="mb-4">
              We may disclose your information if required to do so by law or in response to valid requests
              by public authorities (e.g., a court order or government agency).
            </p>

            <h3 className="font-semibold text-foreground mb-2">Business Transfers</h3>
            <p className="mb-4">
              In the event of a merger, acquisition, or sale of all or a portion of our assets, your
              information may be transferred as part of that transaction. We will notify you via the App or
              email before your information becomes subject to a different privacy policy.
            </p>

            <h3 className="font-semibold text-foreground mb-2">With Your Consent</h3>
            <p>We may share your information for any other purpose with your explicit consent.</p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              4. Data Storage and Security
            </h2>
            <p className="mb-4">
              Your data is stored on servers provided by Supabase, Inc., located in the United States,
              utilizing Amazon Web Services (AWS) infrastructure. We implement industry-standard security
              measures including:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Encryption of all data in transit using HTTPS/TLS.</li>
              <li>Row-level security (RLS) policies on all database tables.</li>
              <li>Secure authentication with hashed passwords (handled by Supabase Auth).</li>
              <li>Role-based access controls for administrative functions.</li>
            </ul>
            <p>
              While we strive to protect your personal information, no method of transmission over the
              Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              5. Data Retention
            </h2>
            <p className="mb-4">
              We retain your personal data for as long as your account is active or as needed to provide you
              services. Specifically:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><strong className="text-foreground">Account and profile data:</strong> retained until you delete your account.</li>
              <li><strong className="text-foreground">Messages:</strong> retained until deleted by both participants (DMs) or removed by admin (community).</li>
              <li><strong className="text-foreground">Transaction records:</strong> retained for seven (7) years to comply with financial record-keeping requirements.</li>
              <li><strong className="text-foreground">Contest submissions:</strong> retained for the duration of the contest and archival purposes.</li>
            </ul>
            <p>
              Upon account deletion, your personal data will be removed within thirty (30) days, except where
              retention is required by applicable law.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              6. Your Rights and Choices
            </h2>
            <p className="mb-4">
              Depending on your state of residence, you may have the following rights:
            </p>

            <h3 className="font-semibold text-foreground mb-2">All Users:</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><strong className="text-foreground">Access:</strong> request a copy of your personal data.</li>
              <li><strong className="text-foreground">Correction:</strong> update your profile information directly in the App.</li>
              <li><strong className="text-foreground">Deletion:</strong> request deletion of your account and associated data by contacting support@futuretrendsent.info.</li>
              <li><strong className="text-foreground">Opt-out of notifications:</strong> disable push notifications in your device settings at any time.</li>
            </ul>

            <h3 className="font-semibold text-foreground mb-2">California Residents (CCPA/CPRA):</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Right to know what personal information is collected, used, and shared.</li>
              <li>Right to delete personal information.</li>
              <li>Right to opt-out of the sale of personal information. Note: we do not sell personal information.</li>
              <li>Right to non-discrimination for exercising your privacy rights.</li>
              <li>Right to correct inaccurate personal information.</li>
              <li>Right to limit use of sensitive personal information.</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:support@futuretrendsent.info" className="text-primary hover:underline">
                support@futuretrendsent.info
              </a>
              . We will respond to verifiable requests within forty-five (45) days.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              7. Children&apos;s Privacy
            </h2>
            <p className="mb-4">
              The App is not intended for children under the age of thirteen (13). We do not knowingly
              collect personal information from children under 13. If we become aware that we have collected
              personal information from a child under 13 without parental consent, we will take steps to
              delete that information promptly.
            </p>
            <p>
              If you are a parent or guardian and believe your child has provided us with personal
              information, please contact us at{" "}
              <a href="mailto:support@futuretrendsent.info" className="text-primary hover:underline">
                support@futuretrendsent.info
              </a>
              .
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              8. Do Not Track
            </h2>
            <p>
              The App does not respond to &ldquo;Do Not Track&rdquo; signals because we do not track users
              across third-party websites or online services.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              9. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by
              posting the updated policy in the App and updating the &ldquo;Effective Date&rdquo; above. Your
              continued use of the App after any changes constitutes your acceptance of the updated Privacy
              Policy.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              10. Contact Us
            </h2>
            <p>
              If you have questions or concerns about this Privacy Policy, contact us at:
            </p>
            <p className="mt-2">
              <strong className="text-foreground">Future Trends Ent</strong>
              <br />
              Email:{" "}
              <a href="mailto:support@futuretrendsent.info" className="text-primary hover:underline">
                support@futuretrendsent.info
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} World Lowrider Association. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage;
