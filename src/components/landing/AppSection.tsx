"use client";

import { motion } from "framer-motion";
import { Smartphone, Star, Users, Trophy } from "lucide-react";

const AppSection = () => {
  return (
    <section
      id="app"
      aria-label="WLA Mobile App – Download on iOS and Android"
      className="py-24 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(var(--primary)/0.12),transparent_60%)] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-16 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <span className="inline-block rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-primary mb-5">
              Coming Soon
            </span>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
              The Official{" "}
              <span className="text-primary">WLA Mobile App</span>{" "}
              Is Launching Soon
            </h2>

            <p className="text-secondary text-lg leading-relaxed mb-4">
              The <strong className="text-foreground">World Lowrider Association app</strong> is the
              ultimate lowrider community platform — built for builders, collectors, and car show
              enthusiasts worldwide. Manage your membership, enter lowrider contests, browse the
              marketplace, and connect with the global lowrider scene, all from your phone.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                { icon: Users, text: "Connect with lowrider clubs and enthusiasts worldwide" },
                { icon: Trophy, text: "Enter digital car shows and lowrider contests on the go" },
                { icon: Smartphone, text: "Manage your WLA membership and digital ID card" },
                { icon: Star, text: "Buy and sell lowrider parts in the WLA marketplace" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-secondary text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <Icon className="h-3 w-3 text-primary" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>

            {/* Store badges */}
            <div className="flex flex-wrap gap-4">
              {/* App Store */}
              <a
                href="#"
                aria-label="Download WLA on the Apple App Store"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 px-5 py-3.5 backdrop-blur transition-colors hover:border-primary/50 hover:bg-background/80"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 814 1000"
                  className="h-7 w-7 text-foreground"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.9 269-317.9 70.6 0 129.5 46.6 173.4 46.6 42.7 0 109.2-49.4 190.5-49.4 30.1 0 108.2 3.2 162.7 106.9zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none mb-0.5">
                    Download on the
                  </p>
                  <p className="text-sm font-semibold text-foreground leading-none">App Store</p>
                </div>
              </a>

              {/* Google Play */}
              <a
                href="#"
                aria-label="Download WLA on Google Play"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 px-5 py-3.5 backdrop-blur transition-colors hover:border-primary/50 hover:bg-background/80"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="h-7 w-7"
                  aria-hidden="true"
                >
                  <path
                    d="M48 59.49v393a4.33 4.33 0 007.37 3.07L274 256 55.37 56.42A4.33 4.33 0 0048 59.49z"
                    fill="#32bbff"
                  />
                  <path
                    d="M288 270l-232 162.42A4.33 4.33 0 0048 435.49v17a4.33 4.33 0 007.37 3.07L302 278z"
                    fill="#32bbff"
                    opacity="0.5"
                  />
                  <path
                    d="M408.37 241.41l-84.22-46.89L274 256l50.15 51.48 84-46.79a22 22 0 000-19.28z"
                    fill="#ffda00"
                  />
                  <path
                    d="M55.37 56.42L274 256l50.15-51.48-84.22-46.89z"
                    fill="#eb3d00"
                  />
                  <path
                    d="M274 256l50.15 51.48 84-46.79-184.35-97.17z"
                    fill="#00f076"
                    opacity="0.5"
                  />
                  <path
                    d="M55.37 455.58l184.41-97.1L274 256z"
                    fill="#00f076"
                  />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none mb-0.5">
                    Get it on
                  </p>
                  <p className="text-sm font-semibold text-foreground leading-none">Google Play</p>
                </div>
              </a>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Be the first to know — app launching on iOS &amp; Android. Sign up for early access.
            </p>
          </motion.div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute -inset-10 bg-primary/10 rounded-full blur-3xl" />
              <img
                src="/mockup.png"
                alt="WLA lowrider community app mockup – available on iOS and Android"
                className="relative z-10 max-h-[760px] w-auto drop-shadow-2xl"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppSection;
