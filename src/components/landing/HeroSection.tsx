import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(38 46% 68% / 0.3) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, hsl(46 49% 55% / 0.3) 0%, transparent 70%)",
          }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="text-primary tracking-[0.3em] uppercase text-sm font-medium mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            World Lowrider Association
          </motion.p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="text-foreground">United by </span>
            <span className="text-primary">Culture</span>
            <br />
            <span className="text-foreground">Driven by </span>
            <span className="text-accent">Legacy</span>
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
            The premier global platform for lowrider enthusiasts. Join the movement,
            showcase your ride, and connect with a worldwide community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 shadow-[0_0_30px_hsl(38_46%_68%_/_0.3)] hover:shadow-[0_0_50px_hsl(38_46%_68%_/_0.5)] transition-all duration-300"
              onClick={() => navigate("/signup")}
            >
              Join WLA <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-muted text-lg px-8 py-6"
              onClick={() => {
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
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
