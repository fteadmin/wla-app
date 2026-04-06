"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

const toggleClass =
  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none";

type ToggleProps = {
  enabled: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
};

const Toggle = ({ enabled, onChange, disabled = false }: ToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    disabled={disabled}
    onClick={() => !disabled && onChange(!enabled)}
    className={`${toggleClass} ${
      enabled ? "bg-primary" : "bg-border"
    } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <span
      className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
        enabled ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

const PrivacyChoicesPage = () => {
  const [preferences, setPreferences] = useState({
    essential: true,        // always on
    analytics: false,
    marketing: false,
    pushNotifications: true,
  });

  const [saved, setSaved] = useState(false);

  const update = (key: keyof typeof preferences) => (val: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    // Persist choices here when backend is ready
    setSaved(true);
  };

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
          Your Privacy Choices
        </h1>
        <p className="text-muted-foreground text-sm mb-12">
          Manage how your data is used. Your choices are saved to your account and apply across all devices.
        </p>

        <div className="space-y-4">
          {/* Essential */}
          <div className="border border-border rounded-xl p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-foreground text-sm">Essential Data</h2>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Always on</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Required to operate the app — authentication, membership verification, payment processing, and security. This cannot be disabled.
                </p>
              </div>
              <Toggle enabled={preferences.essential} onChange={() => {}} disabled />
            </div>
          </div>

          {/* Analytics */}
          <div className="border border-border rounded-xl p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-1">
                <h2 className="font-semibold text-foreground text-sm">Analytics & Usage Data</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Helps us understand how you use the app so we can improve features and fix issues. Data is aggregated and not linked to your identity.
                </p>
              </div>
              <Toggle enabled={preferences.analytics} onChange={update("analytics")} />
            </div>
          </div>

          {/* Marketing */}
          <div className="border border-border rounded-xl p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-1">
                <h2 className="font-semibold text-foreground text-sm">Marketing Communications</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Receive emails about new features, events, contests, and WLA news. You can unsubscribe at any time from any email we send.
                </p>
              </div>
              <Toggle enabled={preferences.marketing} onChange={update("marketing")} />
            </div>
          </div>

          {/* Push Notifications */}
          <div className="border border-border rounded-xl p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-1">
                <h2 className="font-semibold text-foreground text-sm">Push Notifications</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  In-app and device push notifications for messages, contest updates, and account activity. You can also manage this in your device settings.
                </p>
              </div>
              <Toggle enabled={preferences.pushNotifications} onChange={update("pushNotifications")} />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={handleSave}
            className="bg-primary text-primary-foreground font-semibold text-sm px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Save Preferences
          </button>
          {saved && (
            <p className="text-sm text-muted-foreground">Preferences saved.</p>
          )}
        </div>

        {/* Additional rights */}
        <div className="mt-16 space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Additional Rights
            </h2>
            <p className="mb-4">
              Beyond the toggles above, you have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground">Access:</strong> Request a copy of the personal data we hold about you.
              </li>
              <li>
                <strong className="text-foreground">Correction:</strong> Update your profile information directly in the app at any time.
              </li>
              <li>
                <strong className="text-foreground">Deletion:</strong> Request deletion of your account and all associated data.
              </li>
              <li>
                <strong className="text-foreground">Portability:</strong> Request your data in a portable, machine-readable format.
              </li>
              <li>
                <strong className="text-foreground">Restriction:</strong> Ask us to restrict processing of your data in certain circumstances.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Do Not Sell or Share My Personal Information
            </h2>
            <p>
              We do <strong className="text-foreground">not</strong> sell or share your personal information with third parties for advertising or marketing purposes. This right is already honored by default — no action is required.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Contact Us
            </h2>
            <p>
              To exercise any of the rights above, or if you have questions about how your data is handled, contact us at{" "}
              <a href="mailto:support@wla.network" className="text-primary hover:underline">
                support@wla.network
              </a>
              . We will respond to verifiable requests within 45 days.
            </p>
            <p className="mt-3">
              For more detail, see our full{" "}
              <Link href="/privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} World Lowrider Association. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyChoicesPage;
