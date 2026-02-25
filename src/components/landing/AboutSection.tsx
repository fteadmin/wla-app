import { motion } from "framer-motion";
import { Users, Globe, Trophy } from "lucide-react";

const stats = [
  { icon: Users, label: "Members Worldwide", value: "10,000+" },
  { icon: Globe, label: "Countries Represented", value: "25+" },
  { icon: Trophy, label: "Contests Held", value: "500+" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary tracking-[0.2em] uppercase text-sm font-medium mb-4">
            About WLA
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-foreground">
            More Than a Club.{" "}
            <span className="text-primary">A Movement.</span>
          </h2>
          <p className="text-secondary text-lg leading-relaxed">
            The World Lowrider Association is dedicated to preserving and elevating lowrider
            culture worldwide. We bring together builders, collectors, and enthusiasts under
            one unified platform — celebrating artistry, heritage, and community.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <stat.icon className="h-8 w-8 text-primary mx-auto mb-4" />
              <p className="font-display text-4xl font-bold text-foreground mb-2">{stat.value}</p>
              <p className="text-muted-foreground text-sm uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
