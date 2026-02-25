import { motion } from "framer-motion";
import { ShoppingBag, Camera, ArrowRight } from "lucide-react";

const previews = [
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description:
      "Buy, sell, and trade lowrider parts, accessories, and custom builds with verified WLA members.",
    tag: "Coming Soon",
  },
  {
    icon: Camera,
    title: "Photo Contests",
    description:
      "Compete in themed photo contests, earn BLVD tokens, and get featured across the WLA community.",
    tag: "Coming Soon",
  },
];

const PreviewSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-primary tracking-[0.2em] uppercase text-sm font-medium mb-4">
            Platform Features
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            What's <span className="text-primary">Inside</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {previews.map((item, i) => (
            <motion.div
              key={item.title}
              className="group relative rounded-2xl p-8 border border-border bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="flex items-center justify-between mb-4">
                <item.icon className="h-8 w-8 text-primary" />
                <span className="text-xs uppercase tracking-wider text-accent font-medium px-3 py-1 rounded-full border border-accent/20 bg-accent/5">
                  {item.tag}
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">{item.description}</p>
              <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                Learn more <ArrowRight className="h-4 w-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PreviewSection;
