"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2200&q=80"
          alt="Lowrider at sunset"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,hsl(var(--primary)/0.15),transparent_55%)]" />
      </div>

      <div className="relative z-10 container mx-auto flex min-h-screen items-center px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto w-full max-w-4xl text-center"
        >
          <motion.p
            className="mb-6 inline-block rounded-full border border-border/60 bg-background/35 px-5 py-2 text-xs font-medium uppercase tracking-[0.25em] text-primary backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            World Lowrider Association
          </motion.p>

          <h1 className="font-display text-5xl font-bold leading-[0.95] text-foreground sm:text-6xl md:text-7xl xl:text-8xl">
            Built for the
            <span className="text-primary"> Lowrider Culture</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-secondary sm:text-lg md:text-xl">
            Join a global community of builders, collectors, and enthusiasts. Share your ride,
            enter contests, and grow your legacy with WLA.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-primary px-8 py-6 text-lg text-primary-foreground hover:bg-primary/90"
              onClick={() => router.push("/signup")}
            >
              Join WLA <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border/80 bg-background/30 px-8 py-6 text-lg text-foreground hover:bg-background/50"
              onClick={() => {
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Learn More
            </Button>
          </div>

          {/* <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-3 rounded-2xl border border-border/60 bg-background/35 p-3 backdrop-blur-md">
            {[
              ["25+", "Countries"],
              ["10K+", "Members"],
              ["500+", "Contests"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg bg-background/45 px-2 py-3">
                <p className="font-display text-xl text-foreground md:text-2xl">{value}</p>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground md:text-xs">{label}</p>
              </div>
            ))}
          </div> */}
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
